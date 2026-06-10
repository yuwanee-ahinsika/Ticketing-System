<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'department_name',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if user is IT staff.
     */
    public function isIt(): bool
    {
        // 1. Check by explicit role
        if ($this->role === 'it' || $this->role === 'admin') {
            return true;
        }

        // 2. Check by department assignment in employee_job table via employee_id
        if ($this->employee_id) {
            $itDepartmentId = \Illuminate\Support\Facades\Cache::remember('it_department_id', 3600, function () {
                return \Illuminate\Support\Facades\DB::table('departments')
                    ->where('name', 'IT')
                    ->value('department_id');
            });

            if ($itDepartmentId) {
                $userDeptId = \Illuminate\Support\Facades\DB::table('employee_job')
                    ->where('employee_id', $this->employee_id)
                    ->value('department_id');

                if ($userDeptId && (int)$userDeptId === (int)$itDepartmentId) {
                    return true;
                }
            }
        }

        // 3. Fallback: Check direct department_id field in users table
        if ($this->department_id) {
            $itDepartmentId = \Illuminate\Support\Facades\Cache::remember('it_department_id', 3600, function () {
                return \Illuminate\Support\Facades\DB::table('departments')
                    ->where('name', 'IT')
                    ->value('department_id');
            });

            if ($itDepartmentId && (int)$this->department_id === (int)$itDepartmentId) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if user is IT HOD or Admin.
     */
    public function isItHod(): bool
    {
        // 1. Check by role: Admin is allowed
        if ($this->role === 'admin') {
            return true;
        }

        // 2. Must be HOD
        if (strcasecmp($this->role, 'HOD') !== 0) {
            return false;
        }

        // 3. Must be in the IT department (department_id 24)
        if ($this->employee_id) {
            $itDepartmentId = \Illuminate\Support\Facades\Cache::remember('it_department_id', 3600, function () {
                return \Illuminate\Support\Facades\DB::table('departments')
                    ->where('name', 'IT')
                    ->value('department_id');
            });

            if ($itDepartmentId) {
                $userDeptId = \Illuminate\Support\Facades\DB::table('employee_job')
                    ->where('employee_id', $this->employee_id)
                    ->value('department_id');

                if ($userDeptId && (int)$userDeptId === (int)$itDepartmentId) {
                    return true;
                }
            }
        }

        if ($this->department_id) {
            $itDepartmentId = \Illuminate\Support\Facades\Cache::remember('it_department_id', 3600, function () {
                return \Illuminate\Support\Facades\DB::table('departments')
                    ->where('name', 'IT')
                    ->value('department_id');
            });

            if ($itDepartmentId && (int)$this->department_id === (int)$itDepartmentId) {
                return true;
            }
        }

        return false;
    }


    /**
     * Get the tickets for the user.
     */
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function replies()
    {
        return $this->hasMany(TicketReply::class);
    }

    /**
     * Get the employee profile for the user.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }

    /**
     * Get the department for the user.
     */
    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id', 'department_id');
    }

    /**
     * Get the department name.
     */
    public function getDepartmentNameAttribute(): string
    {
        if ($this->role === 'it' || $this->role === 'admin') {
            return 'IT';
        }

        if ($this->employee_id) {
            $deptId = \Illuminate\Support\Facades\Cache::remember('user_dept_id_' . $this->id, 3600, function () {
                return \Illuminate\Support\Facades\DB::table('employee_job')
                    ->where('employee_id', $this->employee_id)
                    ->value('department_id');
            });

            if ($deptId) {
                $name = \Illuminate\Support\Facades\Cache::remember('dept_name_' . $deptId, 3600, function () use ($deptId) {
                    return \Illuminate\Support\Facades\DB::table('departments')
                        ->where('department_id', $deptId)
                        ->value('name');
                });
                if ($name) {
                    return $name;
                }
            }
        }

        if ($this->department_id) {
            $name = \Illuminate\Support\Facades\Cache::remember('dept_name_' . $this->department_id, 3600, function () {
                return \Illuminate\Support\Facades\DB::table('departments')
                    ->where('department_id', $this->department_id)
                    ->value('name');
            });
            if ($name) {
                return $name;
            }
        }

        return 'User';
    }
}

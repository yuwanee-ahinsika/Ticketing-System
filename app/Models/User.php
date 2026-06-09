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

        // 2. Check by department (department named 'IT')
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
}

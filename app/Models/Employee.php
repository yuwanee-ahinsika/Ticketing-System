<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $table = 'employees';
    protected $primaryKey = 'employee_id';

    const CREATED_AT = 'date_created';
    const UPDATED_AT = 'last_updated_date';

    protected $fillable = [
        'employee_code',
        'employment_status',
        'full_name',
        'preferred_name',
        'date_of_birth',
        'gender',
        'marital_status',
        'nationality',
        'blood_group',
        'epf_number',
        'attendance_type',
        'created_by',
        'last_updated_by',
    ];

    /**
     * Get the user account associated with the employee.
     */
    public function user()
    {
        return $this->hasOne(User::class, 'employee_id', 'employee_id');
    }
}

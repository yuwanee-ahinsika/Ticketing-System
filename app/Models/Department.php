<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $table = 'departments';
    protected $primaryKey = 'department_id';

    public $timestamps = false;

    protected $fillable = ['name'];

    /**
     * Get the users in this department.
     */
    public function users()
    {
        return $this->hasMany(User::class, 'department_id', 'department_id');
    }
}

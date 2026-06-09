<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Platform extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];

    /**
     * Get the common issues for this platform.
     */
    public function commonIssues()
    {
        return $this->hasMany(CommonIssue::class);
    }

    /**
     * Get the tickets created under this platform.
     */
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}

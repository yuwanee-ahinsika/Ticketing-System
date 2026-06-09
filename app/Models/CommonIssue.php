<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CommonIssue extends Model
{
    use HasFactory;

    protected $fillable = ['platform_id', 'title', 'description'];

    /**
     * Get the platform that this issue belongs to.
     */
    public function platform()
    {
        return $this->belongsTo(Platform::class);
    }

    /**
     * Get the tickets created with this issue type.
     */
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}

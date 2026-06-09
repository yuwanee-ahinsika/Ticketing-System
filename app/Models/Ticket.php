<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'platform_id',
        'common_issue_id',
        'title',
        'description',
        'status',
    ];

    /**
     * Get the user who created this ticket.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the platform for this ticket.
     */
    public function platform()
    {
        return $this->belongsTo(Platform::class);
    }

    /**
     * Get the common issue category of this ticket (if any).
     */
    public function commonIssue()
    {
        return $this->belongsTo(CommonIssue::class);
    }

    /**
     * Get the replies/conversation for this ticket.
     */
    public function replies()
    {
        return $this->hasMany(TicketReply::class);
    }
}

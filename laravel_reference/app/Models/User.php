<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'id',
        'username',
        'email',
        'password_hash',
        'avatar_level',
        'avatar_xp',
        'avatar_title',
        'avatar_theme',
        'discipline_score',
        'streak',
        'unlocked_tracks',
        'last_active'
    ];

    /**
     * Disable auto-incrementing strings since id is UUID/custom hash based.
     */
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * Cast unlocked array lists to standard JSON types.
     */
    protected $casts = [
        'unlocked_tracks' => 'array',
        'last_active' => 'datetime',
    ];

    /**
     * Relationship: An avatar possesses multiple placement preparation tasks.
     */
    public function tasks()
    {
        return $this->hasMany(Task::class, 'user_id', 'id');
    }

    /**
     * Relationship: Cumulative timed focus sessions.
     */
    public function focusSessions()
    {
        return $this->hasMany(FocusSession::class, 'user_id', 'id');
    }

    /**
     * Relationship: Custom scheduled pleasure catalog rewards.
     */
    public function rewards()
    {
        return $this->hasMany(Reward::class, 'user_id', 'id');
    }

    /**
     * Relationship: Earned discipline achievements/badges.
     */
    public function achievements()
    {
        return $this->hasMany(Achievement::class, 'user_id', 'id');
    }
}

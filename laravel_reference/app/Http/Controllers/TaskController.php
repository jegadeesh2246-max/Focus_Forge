<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;

class TaskController extends Controller
{
    /**
     * Get tasks for the certified user.
     */
    public function index(Request $request, $userId)
    {
        $tasks = Task::where('user_id', $userId)->orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'tasks' => $tasks
        ], 200);
    }

    /**
     * Insert a new dynamic prep task.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|string',
            'title' => 'required|string|max:255',
            'category' => 'required|string|in:DSA,Aptitude,Resume,Mock_Interview,General',
            'difficulty' => 'required|string|in:Easy,Medium,Hard',
        ]);

        $xpReward = 15;
        if ($validated['difficulty'] === 'Medium') $xpReward = 30;
        if ($validated['difficulty'] === 'Hard') $xpReward = 50;

        $task = Task::create([
            'id' => 'task_' . uniqid(),
            'user_id' => $validated['userId'],
            'title' => $validated['title'],
            'category' => $validated['category'],
            'difficulty' => $validated['difficulty'],
            'status' => 'Pending',
            'xp_reward' => $xpReward,
            'created_at' => Carbon::now()
        ]);

        return response()->json([
            'success' => true,
            'task' => $task
        ], 201);
    }

    /**
     * Complete check trigger to level up character and increase overall score.
     */
    public function toggle($id)
    {
        $task = Task::findOrFail($id);
        $user = User::findOrFail($task->user_id);

        if ($task->status === 'Pending') {
            $task->status = 'Completed';
            $task->completed_at = Carbon::now();

            // Reward progression experience
            $user->avatar_xp += $task->xp_reward;
            $user->discipline_score = min(100, $user->discipline_score + 5);
            $user->streak += 1;
        } else {
            $task->status = 'Pending';
            $task->completed_at = null;

            // Roll back progression points
            $user->avatar_xp = max(0, $user->avatar_xp - $task->xp_reward);
            $user->discipline_score = max(0, $user->discipline_score - 5);
            $user->streak = max(0, $user->streak - 1);
        }

        // Recalculate avatar level milestones (200 XP per level boundary)
        $level = floor($user->avatar_xp / 200) + 1;
        $user->avatar_level = $level;

        $task->save();
        $user->save();

        return response()->json([
            'success' => true,
            'task' => $task,
            'user' => $user
        ], 200);
    }

    /**
     * Purge checklist item.
     */
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task purged cleanly from queue'
        ], 200);
    }
}

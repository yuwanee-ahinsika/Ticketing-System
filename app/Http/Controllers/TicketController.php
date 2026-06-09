<?php

namespace App\Http\Controllers;

use App\Models\Platform;
use App\Models\CommonIssue;
use App\Models\Ticket;
use App\Models\TicketReply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TicketController extends Controller
{
    /**
     * Display the correct dashboard based on user role.
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->isIt()) {
            // IT Dashboard: Fetch all tickets with user details, platforms, and replies
            $tickets = Ticket::with(['user.employee', 'user.department', 'platform', 'commonIssue', 'replies.user'])
                ->latest()
                ->get();
            $platforms = Platform::with('commonIssues')->get();

            return Inertia::render('ITDashboard', [
                'tickets' => $tickets,
                'platforms' => $platforms,
            ]);
        }

        // User Dashboard: Fetch platforms (with their issues) and user's own tickets
        $platforms = Platform::with('commonIssues')->get();
        $tickets = Ticket::where('user_id', $user->id)
            ->with(['platform', 'commonIssue', 'replies.user', 'user.employee', 'user.department'])
            ->latest()
            ->get();

        return Inertia::render('UserDashboard', [
            'platforms' => $platforms,
            'tickets' => $tickets,
        ]);
    }

    /**
     * Store a newly created ticket.
     */
    public function store(Request $request)
    {
        $request->validate([
            'platform_id' => 'required|exists:platforms,id',
            'common_issue_id' => 'nullable|exists:common_issues,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        Ticket::create([
            'user_id' => Auth::id(),
            'platform_id' => $request->platform_id,
            'common_issue_id' => $request->common_issue_id,
            'title' => $request->title,
            'description' => $request->description,
            'status' => 'open',
        ]);

        return redirect()->route('dashboard')->with('success', 'Ticket submitted successfully!');
    }

    /**
     * Display the specified ticket details.
     */
    public function show(Ticket $ticket)
    {
        $user = Auth::user();

        // Check if user is authorized to view (IT staff can view all, users can view only their own)
        if (!$user->isIt() && $ticket->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        $ticket->load(['user.employee', 'user.department', 'platform', 'commonIssue', 'replies.user']);

        return Inertia::render('TicketDetails', [
            'ticket' => $ticket,
        ]);
    }

    /**
     * Store a reply/solution to a ticket.
     */
    public function storeReply(Request $request, Ticket $ticket)
    {
        $user = Auth::user();

        // Check authorization: Only IT department employees and admin can reply
        if (!$user->isIt()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'message' => 'required|string',
            'update_status' => 'nullable|string|in:open,in_progress,resolved,closed'
        ]);

        // Create the reply
        TicketReply::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'message' => $request->message,
        ]);

        // If IT staff replies, and asks to update the status, do so.
        // Otherwise, automatically change "open" status to "in_progress" when IT replies.
        if ($user->isIt()) {
            if ($request->update_status) {
                $ticket->update(['status' => $request->update_status]);
            } elseif ($ticket->status === 'open') {
                $ticket->update(['status' => 'in_progress']);
            }
        }

        return redirect()->back()->with('success', 'Reply submitted successfully.');
    }

    /**
     * Update the ticket status directly.
     */
    public function updateStatus(Request $request, Ticket $ticket)
    {
        $user = Auth::user();

        if (!$user->isIt()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'status' => 'required|string|in:open,in_progress,resolved,closed',
        ]);

        $ticket->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Ticket status updated to ' . $request->status . '.');
    }
}

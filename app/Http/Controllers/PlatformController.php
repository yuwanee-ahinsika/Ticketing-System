<?php

namespace App\Http\Controllers;

use App\Models\Platform;
use App\Models\CommonIssue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlatformController extends Controller
{
    /**
     * Authorize that the authenticated user is an IT HOD or Admin.
     */
    private function authorizeUser(): void
    {
        $user = Auth::user();
        if (!$user || !$user->isItHod()) {
            abort(403, 'Unauthorized action.');
        }
    }

    /**
     * Store a newly created platform.
     */
    public function store(Request $request)
    {
        $this->authorizeUser();

        $request->validate([
            'name' => 'required|string|max:255|unique:platforms,name',
            'description' => 'nullable|string',
        ]);

        Platform::create($request->only('name', 'description'));

        return redirect()->back()->with('success', 'Platform created successfully.');
    }

    /**
     * Update the specified platform.
     */
    public function update(Request $request, Platform $platform)
    {
        $this->authorizeUser();

        $request->validate([
            'name' => 'required|string|max:255|unique:platforms,name,' . $platform->id,
            'description' => 'nullable|string',
        ]);

        $platform->update($request->only('name', 'description'));

        return redirect()->back()->with('success', 'Platform updated successfully.');
    }

    /**
     * Remove the specified platform.
     */
    public function destroy(Platform $platform)
    {
        $this->authorizeUser();

        $platform->delete();

        return redirect()->back()->with('success', 'Platform deleted successfully.');
    }

    /**
     * Store a new common issue under a platform.
     */
    public function storeIssue(Request $request, Platform $platform)
    {
        $this->authorizeUser();

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $platform->commonIssues()->create($request->only('title', 'description'));

        return redirect()->back()->with('success', 'Issue category created successfully.');
    }

    /**
     * Update a common issue.
     */
    public function updateIssue(Request $request, CommonIssue $issue)
    {
        $this->authorizeUser();

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $issue->update($request->only('title', 'description'));

        return redirect()->back()->with('success', 'Issue category updated successfully.');
    }

    /**
     * Remove a common issue.
     */
    public function destroyIssue(CommonIssue $issue)
    {
        $this->authorizeUser();

        $issue->delete();

        return redirect()->back()->with('success', 'Issue category deleted successfully.');
    }
}

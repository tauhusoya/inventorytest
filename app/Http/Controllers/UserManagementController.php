<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (auth()->user()->role !== 'Admin') {
                abort(403, 'Unauthorized action. Only Admin users can access this page.');
            }
            return $next($request);
        });
    }

    public function index(Request $request)
    {
        $activeTab = $request->get('tab', 'manage');
        
        if ($activeTab === 'reactivate') {
            $inactiveUsers = User::select('id', 'first_name', 'last_name', 'email', 'role', 'status', 'created_at')
                                ->where('status', 'Inactive')
                                ->orderBy('created_at', 'desc')
                                ->paginate(10);
            
            return Inertia::render('Users/Index', [
                'activeTab' => $activeTab,
                'inactiveUsers' => $inactiveUsers
            ]);
        } elseif ($activeTab === 'password-reset') {
            $users = User::select('id', 'first_name', 'last_name', 'email', 'role', 'status')
                         ->where('status', 'Active')
                         ->orderBy('created_at', 'desc')
                         ->paginate(10);
            
            $reactivationRequests = \App\Models\ReactivationRequest::with(['user', 'processedBy'])
                                                                ->orderBy('created_at', 'desc')
                                                                ->paginate(10);
            
            return Inertia::render('Users/Index', [
                'activeTab' => $activeTab,
                'users' => $users,
                'reactivationRequests' => $reactivationRequests
            ]);
        } else {
            $users = User::select('id', 'first_name', 'last_name', 'email', 'role', 'status')
                         ->where('status', 'Active')
                         ->orderBy('created_at', 'desc')
                         ->paginate(10);
            
            return Inertia::render('Users/Index', [
                'activeTab' => $activeTab,
                'users' => $users
            ]);
        }
    }

    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:Admin,Staff',
        ]);

        User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => 'Active',
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully!');
    }

    public function show(User $user)
    {
        return Inertia::render('Users/Show', [
            'user' => $user
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            'user' => $user
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:Admin,Staff',
        ]);

        $user->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'role' => $request->role,
        ]);

        return redirect()->route('users.index')->with('success', 'User updated successfully!');
    }

    public function destroy(User $user)
    {
        $user->update(['status' => 'Inactive']);

        return redirect()->route('users.index')->with('success', 'User deactivated successfully!');
    }

    public function reactivate(User $user)
    {
        $user->update(['status' => 'Active']);

        // Update any pending reactivation requests
        \App\Models\ReactivationRequest::where('user_id', $user->id)
            ->where('status', 'pending')
            ->update([
                'status' => 'approved',
                'processed_by' => auth()->id(),
                'processed_at' => now(),
            ]);

        return redirect()->route('users.index', ['tab' => 'reactivate'])->with('success', 'User reactivated successfully!');
    }

    public function permanentlyDelete(User $user)
    {
        // Delete reactivation requests first
        \App\Models\ReactivationRequest::where('user_id', $user->id)->delete();
        
        // Permanently delete the user
        $user->delete();

        return redirect()->route('users.index', ['tab' => 'reactivate'])->with('success', 'User permanently deleted!');
    }

    public function approveReactivation(\App\Models\ReactivationRequest $request)
    {
        $request->update([
            'status' => 'approved',
            'processed_by' => auth()->id(),
            'processed_at' => now(),
        ]);

        // Reactivate the user
        $request->user->update(['status' => 'Active']);

        return redirect()->route('users.index', ['tab' => 'reactivate'])->with('success', 'Reactivation request approved!');
    }

    public function rejectReactivation(\App\Models\ReactivationRequest $request)
    {
        $request->update([
            'status' => 'rejected',
            'processed_by' => auth()->id(),
            'processed_at' => now(),
        ]);

        return redirect()->route('users.index', ['tab' => 'reactivate'])->with('success', 'Reactivation request rejected!');
    }
}
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset request view.
     */
    public function create(Request $request): Response
    {
        $email = $request->get('email');
        
        // If email is provided, check if there's an approved request
        if ($email) {
            $approvedRequest = \App\Models\ReactivationRequest::where('email', $email)
                ->where('status', 'approved')
                ->first();
                
            if ($approvedRequest) {
                return Inertia::render('Auth/ResetPassword', [
                    'email' => $email,
                    'status' => session('status'),
                ]);
            }
        }
        
        return Inertia::render('Auth/Reactivate', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming reactivation request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Check which field is provided
        if ($request->has('reset_email')) {
            $request->validate([
                'reset_email' => 'required|email',
            ]);
            $email = $request->reset_email;
        } else {
            $request->validate([
                'email' => 'required|email',
            ]);
            $email = $request->email;
        }

        // Check if user exists
        $user = \App\Models\User::where('email', $email)->first();
        
        if (!$user) {
            $field = $request->has('reset_email') ? 'reset_email' : 'email';
            throw ValidationException::withMessages([
                $field => ['No account found with this email address.'],
            ]);
        }

        // Check if user already has an approved request first
        $approvedRequest = \App\Models\ReactivationRequest::where('email', $email)
            ->where('status', 'approved')
            ->first();
            
        if ($approvedRequest) {
            // If approved, redirect to password reset form with approval message
            return redirect()->route('password.reset', [
                'email' => $email,
                'status' => 'Your request has been approved. You can now change your password.'
            ]);
        }

        // Check if user already has a pending request
        $pendingRequest = \App\Models\ReactivationRequest::where('email', $email)
            ->where('status', 'pending')
            ->first();
            
        if ($pendingRequest) {
            $field = $request->has('reset_email') ? 'reset_email' : 'email';
            throw ValidationException::withMessages([
                $field => ['A password reset request is already pending for this email.'],
            ]);
        }

        // Create password reset request
        \App\Models\ReactivationRequest::create([
            'user_id' => $user->id,
            'email' => $user->email,
            'status' => 'pending',
        ]);

        return back()->with('status', 'Password reset request submitted successfully. An admin will review your request.');
    }
}

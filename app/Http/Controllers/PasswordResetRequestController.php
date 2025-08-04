<?php

namespace App\Http\Controllers;

use App\Models\ReactivationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PasswordResetRequestController extends Controller
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

    public function index()
    {
        $requests = ReactivationRequest::with(['user', 'processed_by_user'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('PasswordResetRequests/Index', [
            'requests' => $requests
        ]);
    }

    public function approve(Request $request, ReactivationRequest $reactivationRequest)
    {
        $reactivationRequest->update([
            'status' => 'approved',
            'processed_by' => auth()->id(),
            'processed_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Password reset request approved successfully!');
    }

    public function delete(Request $request, ReactivationRequest $reactivationRequest)
    {
        $reactivationRequest->delete();

        return redirect()->back()->with('success', 'Password reset request deleted successfully!');
    }
}

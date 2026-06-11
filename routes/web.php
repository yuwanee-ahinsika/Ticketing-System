<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\TicketController;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', [TicketController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Ticket Routes
    Route::post('/tickets', [TicketController::class, 'store'])->name('tickets.store');
    Route::get('/tickets/{ticket}', [TicketController::class, 'show'])->name('tickets.show');
    Route::post('/tickets/{ticket}/replies', [TicketController::class, 'storeReply'])->name('tickets.replies.store');
    Route::patch('/tickets/{ticket}/status', [TicketController::class, 'updateStatus'])->name('tickets.status.update');
    Route::patch('/tickets/{ticket}/read', [TicketController::class, 'markAsRead'])->name('tickets.read');

    // Platform and Common Issues CRUD Routes
    Route::post('/platforms', [\App\Http\Controllers\PlatformController::class, 'store'])->name('platforms.store');
    Route::patch('/platforms/{platform}', [\App\Http\Controllers\PlatformController::class, 'update'])->name('platforms.update');
    Route::delete('/platforms/{platform}', [\App\Http\Controllers\PlatformController::class, 'destroy'])->name('platforms.destroy');
    Route::post('/platforms/{platform}/issues', [\App\Http\Controllers\PlatformController::class, 'storeIssue'])->name('platforms.issues.store');
    Route::patch('/issues/{issue}', [\App\Http\Controllers\PlatformController::class, 'updateIssue'])->name('issues.update');
    Route::delete('/issues/{issue}', [\App\Http\Controllers\PlatformController::class, 'destroyIssue'])->name('issues.destroy');
});

require __DIR__.'/auth.php';

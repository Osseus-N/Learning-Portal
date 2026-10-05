<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => Inertia::render('LoginPage'))
    ->name('home');

Route::get('/dashboard', fn () => Inertia::render('DashboardPage'))
    ->name('dashboard');
Route::get('/courses', fn () => Inertia::render('CoursesPage'))
    ->name('courses.index');
Route::get('/courses/{courseId}', fn (string $courseId) => Inertia::render('CourseDetailPage', [
    'courseId' => $courseId,
]))->name('courses.show');
Route::get('/courses/{courseId}/lessons/{lessonId}', fn (string $courseId, string $lessonId) => Inertia::render('LessonPage', [
    'courseId' => $courseId,
    'lessonId' => $lessonId,
]))->name('courses.lessons.show');
Route::get('/challenges', fn () => Inertia::render('ChallengesPage'))
    ->name('challenges.index');
Route::get('/progress', fn () => Inertia::render('ProgressPage'))
    ->name('progress.index');
Route::get('/achievements', fn () => Inertia::render('AchievementsPage'))
    ->name('achievements.index');
Route::get('/profile', fn () => Inertia::render('ProfilePage'))
    ->middleware('auth')
    ->name('profile.show');
Route::get('/admin', fn () => Inertia::render('AdminPage', ['section' => 'overview']))
    ->name('admin.index');
Route::get('/admin/courses', fn () => Inertia::render('AdminPage', ['section' => 'courses']))
    ->name('admin.courses.index');
Route::get('/admin/users', fn () => Inertia::render('AdminPage', ['section' => 'users']))
    ->name('admin.users.index');

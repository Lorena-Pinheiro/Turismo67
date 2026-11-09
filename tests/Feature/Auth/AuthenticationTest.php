<?php

use App\Enums\UserRole;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

test('login screen can be rendered', function () {
    $response = $this->get(route('login'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('showOrganizerLogin', true),
        );
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('home', absolute: false));
});

test('demo users can sign in as their assigned roles', function (UserRole $role, string $email) {
    $user = User::factory()->create(['email' => $email]);
    $user->role = $role;
    $user->save();

    $response = $this->post(route('login.store'), [
        'email' => $email,
        'password' => 'password',
    ]);

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect(route('home', absolute: false));

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('auth.user.role', $role->value),
        );
})->with([
    'organizer' => [UserRole::Organizer, 'organizador@example.test'],
    'curator' => [UserRole::Curator, 'curador@example.test'],
    'admin' => [UserRole::Admin, 'admin@example.test'],
]);

test('demo accounts are seeded with one account for each role', function () {
    $this->seed(DatabaseSeeder::class);

    $accounts = [
        'organizador@turismo67.local' => UserRole::Organizer,
        'curador@turismo67.local' => UserRole::Curator,
        'admin@turismo67.local' => UserRole::Admin,
    ];

    foreach ($accounts as $email => $role) {
        $this->assertDatabaseHas('users', [
            'email' => $email,
            'role' => $role->value,
        ]);
        expect(Hash::check('turismo67', User::query()->where('email', $email)->value('password')))->toBeTrue();
    }
});

test('users with two factor enabled are redirected to two factor challenge', function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $user = User::factory()->withTwoFactor()->create();

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('two-factor.login'));
    $response->assertSessionHas('login.id', $user->id);
    $this->assertGuest();
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $response->assertRedirect(route('home'));

    $this->assertGuest();
});

test('users are rate limited', function () {
    $user = User::factory()->create();

    RateLimiter::increment(md5('login'.implode('|', [$user->email, '127.0.0.1'])), amount: 5);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertTooManyRequests();
});

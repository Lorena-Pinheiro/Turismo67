<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            return;
        }

        $demoAccounts = [
            ['name' => 'Organizador Turismo67', 'email' => 'organizador@turismo67.local', 'role' => UserRole::Organizer],
            ['name' => 'Curador Turismo67', 'email' => 'curador@turismo67.local', 'role' => UserRole::Curator],
            ['name' => 'Administrador Turismo67', 'email' => 'admin@turismo67.local', 'role' => UserRole::Admin],
        ];

        foreach ($demoAccounts as $account) {
            $user = User::query()->updateOrCreate(
                ['email' => $account['email']],
                [
                    'name' => $account['name'],
                    'password' => Hash::make('turismo67'),
                ],
            );

            $user->role = $account['role'];
            $user->save();
        }
    }
}

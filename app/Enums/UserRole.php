<?php

namespace App\Enums;

enum UserRole: string
{
    case Organizer = 'organizer';
    case Curator = 'curator';
    case Admin = 'admin';
}

﻿using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API;

public class UserRole : IdentityUserRole<string>
{
    public User User { get; set; }
    public Role Role { get; set; }
}

using API.Entities;

namespace API.Constants;

public static class RoleConstant
{ 
	public static readonly Role ADMINISTRATOR = new Role { Name = "Administrator" };
	public static readonly Role USER = new Role { Name = "User" };
}

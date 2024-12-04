using System;

namespace API.Exceptions;

public class UserNotFoundException : Exception
{
    public UserNotFoundException(string name) 
		: base($"User not found with the following ID: '{name}'!")
	{
	}
}

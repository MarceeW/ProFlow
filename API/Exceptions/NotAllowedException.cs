using System;

namespace API.Exceptions;

public class NotAllowedException : Exception
{
	public NotAllowedException(string message = "You are not allowed to do this!")
		: base(message) {}
}

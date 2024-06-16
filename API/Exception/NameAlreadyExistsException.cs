namespace API.Exceptions;

public class NameAlreadyExistsException : Exception
{
	public NameAlreadyExistsException(string name) 
		: base($"Project with the following name: '{name}' already exists!")
	{
	}
}

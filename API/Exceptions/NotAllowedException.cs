using System;

namespace API.Exceptions;

public class NotAllowedException : Exception
{
    public NotAllowedException() : base("You are not allowed to do this!") {}
}

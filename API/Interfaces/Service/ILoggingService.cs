using System;
using API.Models;

namespace API.Interfaces.Service;

public interface ILoggingService
{
    Task CreateLogAsync(Log log);
}

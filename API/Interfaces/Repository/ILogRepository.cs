using System;
using API.Models;

namespace API.Interfaces.Repository;

public interface ILogRepository : IRepository<Log, Guid>
{
}

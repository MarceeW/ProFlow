using System;
using API.Data;
using API.Interfaces.Repository;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class LogRepository : AbstractRepository<Log, Guid>, ILogRepository
{
    public LogRepository(DataContext dataContext) : base(dataContext, dataContext.Logs)
    {
    }
}

using System;
using API.Data;
using API.Interfaces.Repository;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class TeamRepository : AbstractRepository<Team, Guid>, ITeamRepository
{
    public TeamRepository(DataContext dataContext) : base(dataContext, dataContext.Teams)
    {
    }
}

using System;
using API.Models;

namespace API.Interfaces.Repository;

public interface ITeamRepository : IRepository<Team, Guid>
{
}

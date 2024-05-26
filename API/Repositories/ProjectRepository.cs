using API.Data;
using API.Interfaces.Repository;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class ProjectRepository : AbstractRepository<Project, Guid>, IProjectRepositoy
{
    public ProjectRepository(DataContext dataContext) : base(dataContext, dataContext.Projects)
    {
    }
}

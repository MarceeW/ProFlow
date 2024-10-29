using System;
using API.Data;
using API.Interfaces.Repository;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class StoryStatusChangeRepository : AbstractRepository<StoryStatusChange, Guid>, IStoryStatusChangeRepository
{
    public StoryStatusChangeRepository(DataContext dataContext) : base(dataContext, dataContext.StoryStatusChanges)
    {
    }
}

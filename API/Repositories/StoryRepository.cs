using System;
using API.Data;
using API.Interfaces.Repository;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class StoryRepository : AbstractRepository<Story, Guid>, IStoryRepository
{
    public StoryRepository(DataContext dataContext) : base(dataContext, dataContext.Stories)
    {
    }
}

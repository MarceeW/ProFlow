using System;
using API.Data;
using API.Interfaces.Repository;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class StoryCommitRepository : AbstractRepository<StoryCommit, Guid>, IStoryCommitRepository
{
    public StoryCommitRepository(DataContext dataContext) : base(dataContext, dataContext.StoryCommits)
    {
    }
}

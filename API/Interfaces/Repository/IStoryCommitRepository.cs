using System;
using API.Models;

namespace API.Interfaces.Repository;

public interface IStoryCommitRepository : IRepository<StoryCommit, Guid>
{
}

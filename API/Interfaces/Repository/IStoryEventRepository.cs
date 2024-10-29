using System;
using API.Models;

namespace API.Interfaces.Repository;

public interface IStoryStatusChangeRepository : IRepository<StoryStatusChange, Guid>
{
}

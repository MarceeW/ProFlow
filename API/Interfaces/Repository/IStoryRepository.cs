using System;
using API.Models;

namespace API.Interfaces.Repository;

public interface IStoryRepository : IRepository<Story, Guid>
{
}

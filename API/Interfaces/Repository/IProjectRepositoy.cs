﻿using API.DTO;
using API.DTOs;
using API.Models;

namespace API.Interfaces.Repository;

public interface IProjectRepositoy : IRepository<Project, Guid>
{
	IEnumerable<Project> GetUserProjects(User user);
	Task<Sprint> GetNthSprintAsync(Guid projectId, int n);
}

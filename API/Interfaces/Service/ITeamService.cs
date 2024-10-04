using System;
using API.DTO;
using API.Models;

namespace API.Interfaces.Service;

public interface ITeamService
{
	Task CreateTeamAsync(TeamDTO teamDTO, User user);
	Task DeleteTeamAsync(Guid id, User user);
	Task AddToTeamAsync(User loggedInUser, Guid teamId, IEnumerable<UserDTO> users);
	Task RemoveFromTeamAsync(User loggedInUser, Guid teamId, IEnumerable<UserDTO> users);
	Task RenameAsync(User loggedInUser, TeamDTO teamDTO);
	Task AddToProjectAsync(User loggedInUser, Guid teamId, IEnumerable<ProjectDTO> projects);
	Task RemoveFromProjectAsync(User loggedInUser, Guid teamId, IEnumerable<ProjectDTO> projects);
}

using API.DTO;
using API.DTOs;
using API.Models;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
	public AutoMapperProfiles()
	{
		CreateMap<Invitation, InvitationDTO>();
		
		CreateMap<Role, RoleDTO>();
		
		CreateMap<User, AccountDTO>()
			.ForMember(dest => dest.Roles,
			opt => opt.MapFrom(src => src.UserRoles!.Select(ur => ur.Role.Name)));
				
		CreateMap<User, UserDTO>();
		
		CreateMap<Notification, NotificationDTO>();
		
		CreateMap<Project, ProjectDTO>()
			.ForMember(dest => dest.Sprints,
					opt => opt.MapFrom(src => src.Sprints.OrderByDescending(s => s.End)));
		CreateMap<Sprint, SprintDateDTO>();

		CreateMap<Team, TeamDTO>();
		
		CreateMap<Skill, SkillDTO>();
		
		CreateMap<Story, StoryDTO>()
			.ForMember(dest => dest.StoryPriority,
				opt => opt.MapFrom(src => Enum.GetName(src.StoryPriority)))
			.ForMember(dest => dest.StoryType,
				opt => opt.MapFrom(src => Enum.GetName(src.StoryType)));
				
		CreateMap<StoryCommit, StoryCommitDTO>()
			.ForMember(dest => dest.StoryCommitType,
				opt => opt.MapFrom(src => Enum.GetName(src.StoryCommitType)));
				
		CreateMap<Sprint, SprintDTO>();
	}
}

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
		CreateMap<Sprint, ShortSprintDTO>();

		CreateMap<Team, ShortTeamDTO>()
			.ForMember(dest => dest.MemberIds,
					opt => opt.MapFrom(src => src.Members.Select(m => m.Id)));
		
		CreateMap<Team, TeamDTO>()
			.ForMember(dest => dest.TopUserSkills, 
				opt => opt.MapFrom(src => src.Members
					.SelectMany(m => m.UserSkills)
					.GroupBy(us => us.Skill.Name)
					.Select(group => new UserSkillDTO
					{
						Skill = new SkillDTO 
						{
							Id = group.Select(us => us.SkillId).First(),
							Name = group.Key
						},
						SkillLevel = group.Sum(us => us.SkillLevel)
					}).OrderByDescending(us => us.SkillLevel).Take(4)));
		
		CreateMap<Skill, SkillDTO>();
		CreateMap<UserSkill, UserSkillDTO>();
		
		CreateMap<Story, StoryDTO>()
			.ForMember(dest => dest.StoryPriority,
				opt => opt.MapFrom(src => Enum.GetName(src.StoryPriority)))
			.ForMember(dest => dest.StoryType,
				opt => opt.MapFrom(src => Enum.GetName(src.StoryType)));
				
		CreateMap<StoryStatusChange, StoryStatusChangeDTO>();
		
		CreateMap<StoryCommit, StoryCommitDTO>()
			.ForMember(dest => dest.StoryCommitType,
				opt => opt.MapFrom(src => Enum.GetName(src.StoryCommitType)));
				
		CreateMap<Sprint, SprintDTO>();
	}
}

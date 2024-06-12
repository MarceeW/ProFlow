using API.DTO;
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
	}
}

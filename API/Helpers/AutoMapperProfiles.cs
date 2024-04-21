using API.Data;
using API.DTO;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
	public AutoMapperProfiles()
	{
		CreateMap<Invitation, InvitationDTO>();
		CreateMap<User, UserDTO>()
			.ForMember(dest => dest.Roles,
				opt => opt.MapFrom(src => src.UserRoles!.Select(ur => ur.Role.Name)));
	}
}

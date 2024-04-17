﻿using API.Data;
using API.DTO;
using API.Models;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
	public AutoMapperProfiles()
	{
		CreateMap<Invitation, InvitationDTO>();
	}
}

using System;
using API.DTOs;

namespace API.Interfaces.Service;

public interface ISkillService
{
    Task CreateSkillAsync(SkillDTO skillDTO);
}

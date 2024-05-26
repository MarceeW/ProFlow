using API.Models;

namespace API.Interfaces.Service;

public interface ITokenService
{
    Task<string> CreateToken(User user);
}

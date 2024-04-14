using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Models;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;

public class TokenService : ITokenService
{
	private readonly SymmetricSecurityKey _key;
	private readonly string _issuer;
	private readonly string _audience;
	private readonly UserManager<User> _userManager;

	public TokenService(IConfiguration config, UserManager<User> userManager)
	{
		_key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JwtSettings:Key"]!));
		_issuer = config["JwtSettings:Issuer"]!;
		_audience = config["JwtSettings:Audience"]!;
		_userManager = userManager;
	}
	public async Task<string> CreateToken(User user)
	{
		var roles = await _userManager.GetRolesAsync(user);
		var claims = new List<Claim>
		{
			new Claim(JwtRegisteredClaimNames.NameId, user.UserName!),
		};
		claims.AddRange(roles.Select(x => new Claim(ClaimTypes.Role, x)));

		var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

		var tokenDescriptor = new SecurityTokenDescriptor
		{
			Subject = new ClaimsIdentity(claims),
			Expires = DateTime.Now.AddHours(8),
			Issuer = _issuer,
			Audience = _audience,
			SigningCredentials = creds
		};

		var tokenHandler = new JwtSecurityTokenHandler();

		var token = tokenHandler.CreateToken(tokenDescriptor);

		return tokenHandler.WriteToken(token);
	}
}

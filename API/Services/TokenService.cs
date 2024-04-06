using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;

public class TokenService : ITokenService
{
	private readonly SymmetricSecurityKey _key;
	private readonly string _issuer;
	private readonly string _audience;

	public TokenService(IConfiguration config)
	{
		_key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JwtSettings:Key"]));
		_issuer = config["JwtSettings:Issuer"];
		_audience = config["JwtSettings:Audience"];
	}
	public string CreateToken(User user)
	{
		var claims = new List<Claim>
		{
			new Claim(JwtRegisteredClaimNames.NameId, user.UserName),	
		};
		
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

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
	[Authorize]
	public class EnumValueController : BaseApiController
	{
		[HttpGet("{enumName}")]
		public ActionResult<IEnumerable<string>> GetValues(string enumName) 
		{
			string enumTypeName = $"API.Enums.{enumName}";
			var enumType = Type.GetType(enumTypeName);
			
			if(enumType == null || !enumType.IsEnum)
				return BadRequest($"The '{enumName}' enum type doesn't exists!");
			
			return Ok(Enum.GetNames(enumType));
		}
	}
}

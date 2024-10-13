using System.ComponentModel.DataAnnotations;

namespace API.Attribute;

public class ValidPastDateAttribute : ValidationAttribute
{	
	public override bool IsValid(object? value)
	{
		if(value is DateTime d) 
		{
			return d < DateTime.Now;
		}
		return false;
	}
}

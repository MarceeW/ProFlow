using System;
using API.Interfaces.Service;

namespace API.Services;

public class ApiKeyValidationService : IApiKeyValidationService
{
	private readonly IConfiguration _configuration;

	public ApiKeyValidationService(IConfiguration configuration)
	{
		_configuration = configuration;
	}

	public bool ValidateApiKey(string apiKey)
	{
		if (string.IsNullOrWhiteSpace(apiKey))
			return false;
			
		string? localApiKey = _configuration.GetValue<string>(Constants.Misc.ApiKeyName);
		if (apiKey == null || localApiKey != apiKey)
			return false;
		return true;
	}
}

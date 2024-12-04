using System;

namespace API.Interfaces.Service;

public interface IApiKeyValidationService
{
    bool ValidateApiKey(string apiKey);
}

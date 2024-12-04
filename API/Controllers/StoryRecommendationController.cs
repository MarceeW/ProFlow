using System.Text;
using System.Text.Json;
using API.DTOs;
using API.Extensions;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{	
	[Route("api/[controller]")]
	[ApiController]
	public class StoryRecommendationController : ControllerBase
	{
		private readonly UserManager<User> _userManager;
		private readonly IStoryRepository _storyRepository;
		private readonly IApiKeyValidationService _apiKeyValidationService;
		private readonly HttpClient _httpClient;
		private readonly IConfiguration _configuration;

		public StoryRecommendationController(
			IStoryRepository storyRepository,
			IApiKeyValidationService apiKeyValidationService,
			IConfiguration configuration,
			UserManager<User> userManager)
		{
			_storyRepository = storyRepository;
			_apiKeyValidationService = apiKeyValidationService;

			HttpClientHandler handler = new HttpClientHandler
			{
				ServerCertificateCustomValidationCallback =
					(message, cert, chain, sslPolicyErrors) => true
			};
			_httpClient = new HttpClient(handler);
			_configuration = configuration;
			_userManager = userManager;
		}

		[HttpPost]
		[Authorize]
		public async Task<ActionResult<IEnumerable<double>>> GetPredictions(IEnumerable<Guid> storyIds) 
		{
			
			string url = _configuration["RecommenderApiEndpoint"]! + "/predict";
			string apiKey = _configuration["ApiKey"]!;
			
			var options = new JsonSerializerOptions
			{
				PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
			};
			
			var loggedInUser = await _userManager.GetLoggedInUserAsync(User);
			var stories = await _storyRepository.GetRecommendationDataForPrediction(storyIds, loggedInUser!);
			
			string jsonData = JsonSerializer.Serialize(stories, options);
			HttpContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");

			_httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
			
			try
			{
				HttpResponseMessage response = await _httpClient.PostAsync(url, content);
				if (response.IsSuccessStatusCode)
				{
					string responseBody = await response.Content.ReadAsStringAsync();
					var probabilities = JsonSerializer
						.Deserialize<IEnumerable<double>>(responseBody)!;
						
					var result = Enumerable
						.Range(0, storyIds.Count())
						.Select(i => new 
						{
							storyId = storyIds.ElementAt(i),
							Probability = probabilities.ElementAt(i)
						});
						
					return Ok(result);
				}
				else
					return StatusCode(500,
						$"Error occured during prediction processing. [{response.StatusCode}]");
			}
			catch (Exception e)
			{
				return StatusCode(500,
						new { message = $"Error occured during prediction processing.", e.Message, details = e.Message});
			}
		}
	}
}

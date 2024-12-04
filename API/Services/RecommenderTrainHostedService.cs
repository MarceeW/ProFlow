using System;
using System.Text;
using System.Text.Json;
using API.Interfaces.Repository;
using Microsoft.OpenApi.Expressions;

namespace API.Services;

public class RecommenderTrainHostedService  : IHostedService, IDisposable
{
	public IServiceProvider Services { get; }
	private readonly ILogger<RecommenderTrainHostedService> _logger;
	private readonly IConfiguration _configuration;
	private Timer? _timer = null;

	public RecommenderTrainHostedService(
		ILogger<RecommenderTrainHostedService> logger,
		IConfiguration configuration,
		IServiceProvider services)
	{
		_logger = logger;
		_configuration = configuration;
		Services = services;
	}

	public Task StartAsync(CancellationToken stoppingToken)
	{
		_logger.LogInformation("Recommender train service started running.");

		_timer = new Timer(async _ => await CallRecommenderBackend(), 
			null, 
			TimeSpan.Zero,
			TimeSpan.FromMinutes(30));

		return Task.CompletedTask;
	}

	private async Task CallRecommenderBackend()
	{
		
		using var scope = Services.CreateScope();
		
		var storyRepository = 
			scope.ServiceProvider
				.GetRequiredService<IStoryRepository>();
		
		var data = await storyRepository.GetRecommendationDataForTraining();
		
		if(data.Count() < 100) 
		{
			_logger.LogInformation("Can't call recommendation service since there is not enough data!");
			return;
		}
			
		_logger.LogInformation("Calling Recommendation service training.");
		
		string url = _configuration["RecommenderApiEndpoint"]! + "/train";
		string apiKey = _configuration["ApiKey"]!;
		
		var options = new JsonSerializerOptions
		{
			PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
		};
		
		string jsonData = JsonSerializer.Serialize(data, options);
		HttpContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");
		
		HttpClientHandler handler = new HttpClientHandler
		{
			ServerCertificateCustomValidationCallback = 
				(message, cert, chain, sslPolicyErrors) => true
		};
		
		using HttpClient httpClient = new HttpClient(handler);
		httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
		
		try
		{
			HttpResponseMessage response = await httpClient.PostAsync(url, content);
			if (response.IsSuccessStatusCode)
			{
				string responseBody = await response.Content.ReadAsStringAsync();
				_logger.LogInformation(responseBody);
			}
			else
				_logger.LogInformation($"Error occured during the training. [{response.StatusCode}]");
		}
		catch (Exception e)
		{
			_logger.LogError(e.Message);
		}
	}

	public Task StopAsync(CancellationToken stoppingToken)
	{
		_logger.LogInformation("Recommender train service is stopping.");
		_timer?.Change(Timeout.Infinite, 0);
		return Task.CompletedTask;
	}

	public void Dispose()
	{
		_timer?.Dispose();
	}
}
using System;
using API.Interfaces.Repository;
using API.Interfaces.Service;
using API.Models;
using API.Repositories;

namespace API.Services;

public class LoggingService : ILoggingService
{
	private readonly ILogRepository _logRepository;

	public LoggingService(ILogRepository logRepository)
	{
		_logRepository = logRepository;
	}

	public async Task CreateLogAsync(Log log)
	{
		await _logRepository.CreateAsync(log);
		await _logRepository.SaveAsync();
	}
}

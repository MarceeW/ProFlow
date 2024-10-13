using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Castle.Core.Logging;
using Microsoft.Identity.Client;

namespace API.Models;

public class Log
{
	[Key]
	public Guid Id { get; set; }
	public DateTime TimeStamp { get; set; } = DateTime.Now;
	[AllowNull]
	public Guid? UserId { get; set; }
	public required LoggerLevel LoggerLevel { get; set; }
	public required string Source { get; set; }
	public required string Message { get; set; }
}

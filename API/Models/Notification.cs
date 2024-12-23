﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

public class Notification
{
	[Key]
	public Guid Id { get; set; }
	[MaxLength(32)]
	public required string Type { get; set; }
	public required string Title { get; set; }
	public required string Content { get; set; }
	[ForeignKey(nameof(TargetUserId))]
	public required virtual User TargetUser { get; set; }
	public Guid TargetUserId { get; set; }
	public DateTime Created { get; set; } = DateTime.Now;
	public bool Viewed { get; set; }
}

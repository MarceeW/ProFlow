using System;
using API.Enums;

namespace API.DTOs.Reports;

public class BacklogStatDTO
{
    public required StoryStatus StoryStatus { get; set; }
    public required int Count { get; set; }
}

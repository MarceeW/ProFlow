namespace API.DTOs;

public class UserStatDTO
{
    public int OwnedProjects { get; set; }
    public int LedTeams { get; set; }
    public int Teams { get; set; }
    public int Projects { get; set; }
    public int StoriesDone { get; set; }
    public double? Performance { get; set; }
}

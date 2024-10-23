namespace API.Models;

public class UserSkill
{
	public required Guid UserId { get; set; }
	public required virtual User User { get; set; }
	public required Guid SkillId { get; set; }
	public required virtual Skill Skill { get; set; }
	public required int SkillLevel { get; set; }
}

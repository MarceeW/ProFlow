namespace API.Models;

public class UserSkill
{
	public Guid UserId { get; set; }
	public required virtual User User { get; set; }
	public Guid SkillId { get; set; }
	public required virtual Skill Skill { get; set; }
	public required int SkillLevel { get; set; }
}

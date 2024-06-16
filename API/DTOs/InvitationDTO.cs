namespace API.DTO;

public class InvitationDTO
{
    public required Guid Key { get; set; }
	public required DateTime Expires { get; set; }
	public required bool IsActivated { get; set; }
}

using API.DTO;
using API.Models;

namespace API.Interfaces;

public interface IInvitationRepository : IRepository<Invitation, Guid>
{
	Task<IEnumerable<InvitationDTO>> GetDTOsAsync();
	Task<InvitationDTO> ReadInvitationDTOAsync(Guid key);
	Task<bool> IsValidInvitationExistsAsync();
}

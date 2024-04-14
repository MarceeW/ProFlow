using API.Data;
using API.Interfaces;
using API.Models;

namespace API.Repositories;

public sealed class InvitationRepository : AbstractRepository<Invitation, Guid>, IInvitationRepository
{
	public InvitationRepository(DataContext dataContext) : base(dataContext, dataContext.Invitations)
	{
	}
}

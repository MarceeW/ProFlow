using API.Data;
using API.DTO;
using API.Interfaces;
using API.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public sealed class InvitationRepository : AbstractRepository<Invitation, Guid>, IInvitationRepository
{
	private readonly IMapper _mapper;

	public InvitationRepository(DataContext dataContext, IMapper mapper) : base(dataContext, dataContext.Invitations)
	{
		_mapper = mapper;
	}

	public async Task<IEnumerable<InvitationDTO>> GetDTOsAsync()
	{
		return await _values
			.OrderBy(i => i.IsActivated)
			.ThenBy(i => i.Expires)
			.ProjectTo<InvitationDTO>(_mapper.ConfigurationProvider)
			.ToListAsync();
	}

	public async Task<InvitationDTO> ReadInvitationDTOAsync(Guid key)
	{
		return _mapper.Map<InvitationDTO>(await ReadAsync(key));
	}
	public async Task<bool> IsValidInvitationExistsAsync()
	{
		return await _values.AnyAsync(i => i.Expires > DateTime.UtcNow && !i.IsActivated);
	}
}

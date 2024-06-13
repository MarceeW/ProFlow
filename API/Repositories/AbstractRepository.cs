using API.Data;
using API.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;

namespace API;

public class AbstractRepository<T, K> : IRepository<T, K> 
	where T : class 
	where K : IComparable<K>
{
	protected readonly DataContext _dataContext;
	protected readonly DbSet<T> _values;

	public AbstractRepository(DataContext dataContext, DbSet<T> values)
	{
		_dataContext = dataContext;
		_values = values;
	}

	public virtual void Create(T entity)
	{
		_values.Add(entity);
	}

	public virtual async Task CreateAsync(T entity)
	{
		await _values.AddAsync(entity);
	}

	public virtual void Delete(T entity)
	{
		_values.Remove(entity);
	}

	public virtual IQueryable<T> Get()
	{
		return _values;
	}

	public virtual T Read(K key)
	{
		T? t = _values.Find(key);
		if (t == null)
			throw new KeyNotFoundException();
		return t;
	}

	public virtual async Task<T> ReadAsync(K key)
	{
		T? t = await _values.FindAsync(key);
		if (t == null)
			throw new KeyNotFoundException();
		return t;
	}

	public virtual void Save()
	{
		_dataContext.SaveChanges();
	}

	public virtual async Task SaveAsync()
	{
		await _dataContext.SaveChangesAsync();
	}

	public virtual void Update(T entity)
	{
		_dataContext.Update(entity);
	}
}

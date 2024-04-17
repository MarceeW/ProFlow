using API.Data;
using API.Interfaces;
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

    public virtual IEnumerable<T> Get()
    {
        return _values.ToList();
    }

    public virtual async Task<IEnumerable<T>> GetAsync()
	{
		return await _values.ToListAsync();
	}

    public virtual T? Read(K key)
    {
        return _values.Find(key);
    }

    public virtual async Task<T?> ReadAsync(K key)
    {
        return await _values.FindAsync(key);
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

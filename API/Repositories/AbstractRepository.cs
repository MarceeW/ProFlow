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

    public void Create(T entity)
    {
        _values.Add(entity);
    }

    public async Task CreateAsync(T entity)
	{
		await _values.AddAsync(entity);
	}

	public void Delete(T entity)
	{
		_values.Remove(entity);
	}

    public IEnumerable<T> Get()
    {
        return _values.ToList();
    }

    public async Task<IEnumerable<T>> GetAsync()
	{
		return await _values.ToListAsync();
	}

    public T? Read(K key)
    {
        return _values.Find(key);
    }

    public async Task<T?> ReadAsync(K key)
    {
        return await _values.FindAsync(key);
    }

    public void Save()
    {
        _dataContext.SaveChanges();
    }

    public async Task SaveAsync()
	{
		await _dataContext.SaveChangesAsync();
	}

	public void Update(T entity)
	{
		_dataContext.Update(entity);
	}
}

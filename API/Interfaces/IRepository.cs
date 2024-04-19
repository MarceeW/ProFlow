namespace API.Interfaces;

public interface IRepository<T, K> where K : IComparable<K>
{
	void Create(T entity);
	Task CreateAsync(T entity);
	IEnumerable<T> Get();
	Task<IEnumerable<T>> GetAsync();
	T Read(K key);
	Task<T> ReadAsync(K key);
	void Update(T entity);
	void Delete(T entity);
	void Save();
	Task SaveAsync();
}

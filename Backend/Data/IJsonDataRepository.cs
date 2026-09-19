namespace VK004Demo.Data
{
    public interface IJsonDataRepository
    {
        Task<IEnumerable<T>> GetAllAsync<T>(string collectionName);
        Task SaveAllAsync<T>(string collectionName, IEnumerable<T> items);
    }
}
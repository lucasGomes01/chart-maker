using ChartMaker.Domain.Entities;

public interface IChartRepository
{
    Task AddAsync(Chart chart, CancellationToken cancellationToken);
    Task<IEnumerable<Chart>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Chart?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}

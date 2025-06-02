using ChartMaker.Domain.Entities;

public interface IChartRepository
{
    Task AddAsync(Chart chart, CancellationToken cancellationToken);
}

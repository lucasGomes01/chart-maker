using ChartMaker.Domain.Entities;
using ChartMaker.Infrastructure.Database;

public class ChartRepository : IChartRepository
{
    private readonly AppDbContext _context;

    public ChartRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Chart chart, CancellationToken cancellationToken)
    {
        _context.Charts.Add(chart);
        await _context.SaveChangesAsync(cancellationToken);
    }
}

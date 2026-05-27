using ChartMaker.Domain.Entities;
using ChartMaker.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

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

    public async Task<IEnumerable<Chart>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Charts
            .Include(c => c.Data)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Chart?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Charts
            .Include(c => c.Data)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var chart = await _context.Charts.FindAsync(new object[] { id }, cancellationToken);
        if (chart is not null)
        {
            _context.Charts.Remove(chart);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}

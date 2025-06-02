using Microsoft.EntityFrameworkCore;
using ChartMaker.Domain.Entities;

namespace ChartMaker.Infrastructure.Database
{
    public sealed class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Chart> Charts { get; set; }
    }
}

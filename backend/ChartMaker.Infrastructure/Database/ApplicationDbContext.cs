using Microsoft.EntityFrameworkCore;
using ChartMaker.Domain.Entities;

namespace ChartMaker.Infrastructure.Database
{
    public sealed class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Chart> Charts { get; set; }
    }
}

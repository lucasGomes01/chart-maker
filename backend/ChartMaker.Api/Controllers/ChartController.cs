using ChartMaker.Domain.Entities;
using ChartMaker.Infrastructure.Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ChartController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ChartController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Chart chart)
    {
        chart.CreatedAt = DateTime.UtcNow;
        _context.Charts.Add(chart);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Create), new { id = chart.Id }, chart);
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var charts = await _context.Charts.ToListAsync();
        return Ok(charts);
    }
}

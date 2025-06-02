using ChartMaker.Application.Commands.Chart.CreateChart;
using ChartMaker.Domain.Entities;
using ChartMaker.Infrastructure.Database;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ChartController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMediator _mediator;

    public ChartController(AppDbContext context,
                           IMediator mediator)
    {
        _context = context;
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateChartCommand command)
    {
        var chart = await _mediator.Send(command);
        return CreatedAtAction(nameof(Create), new { id = chart.Id }, chart);
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var charts = await _context.Charts.ToListAsync();
        return Ok(charts);
    }
}

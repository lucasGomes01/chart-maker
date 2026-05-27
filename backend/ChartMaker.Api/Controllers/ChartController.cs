using ChartMaker.Application.Commands.Chart.CreateChart;
using MediatR;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ChartController : ControllerBase
{
    private readonly IChartRepository _repository;
    private readonly IMediator _mediator;

    public ChartController(IChartRepository repository, IMediator mediator)
    {
        _repository = repository;
        _mediator = mediator;
    }

    /// <summary>Lista todos os gráficos</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var charts = await _repository.GetAllAsync(cancellationToken);
        return Ok(charts);
    }

    /// <summary>Retorna um gráfico específico pelo ID</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var chart = await _repository.GetByIdAsync(id, cancellationToken);
        if (chart is null) return NotFound(new { message = $"Gráfico {id} não encontrado." });
        return Ok(chart);
    }

    /// <summary>Cria um novo gráfico a partir de Excel e/ou texto (ExcelFile é opcional)</summary>
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Create([FromForm] CreateChartCommand command, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .ToDictionary(
                    k => k.Key,
                    v => v.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
                );
            return BadRequest(new { message = "Dados inválidos.", errors });
        }

        if (string.IsNullOrWhiteSpace(command.Title))
            return BadRequest(new { message = "O campo 'Title' é obrigatório." });

        try
        {
            var chart = await _mediator.Send(command, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = chart.Id }, chart);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno ao gerar o gráfico.", detail = ex.Message });
        }
    }

    /// <summary>Exclui um gráfico pelo ID</summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var chart = await _repository.GetByIdAsync(id, cancellationToken);
        if (chart is null) return NotFound(new { message = $"Gráfico {id} não encontrado." });

        await _repository.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}

using ChartMaker.Application.Commands.Chart.CreateChart;
using ChartMaker.Domain.Entities;
using MediatR;

public class CreateChartHandler : IRequestHandler<CreateChartCommand, Chart>
{
    private readonly IChartRepository _repository;

    public CreateChartHandler(IChartRepository repository)
    {
        _repository = repository;
    }

    public async Task<Chart> Handle(CreateChartCommand request, CancellationToken cancellationToken)
    {
        var chart = new Chart
        {
            Title = request.Title,
            Description = request.Description,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(chart, cancellationToken);
        return chart;
    }
}

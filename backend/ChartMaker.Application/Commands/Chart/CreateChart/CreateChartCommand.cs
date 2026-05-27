using MediatR;
using Microsoft.AspNetCore.Http;

namespace ChartMaker.Application.Commands.Chart.CreateChart
{
    public class CreateChartCommand : IRequest<Domain.Entities.Chart>
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Opcional — pode criar gráfico só com texto ou só com arquivo
        public IFormFile? ExcelFile { get; set; }
    }
}

using MediatR;
using Microsoft.AspNetCore.Http;

namespace ChartMaker.Application.Commands.Chart.CreateChart
{
    public class CreateChartCommand : IRequest<Domain.Entities.Chart>
    {
        public string Title { get; set; }
        public string Description { get; set; }

        public IFormFile ExcelFile { get; set; }
    }
}

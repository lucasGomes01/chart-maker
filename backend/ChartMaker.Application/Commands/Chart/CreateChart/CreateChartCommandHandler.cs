using ChartMaker.Application.Commands.Chart.CreateChart;
using ChartMaker.Application.Excel.Interfaces;
using ChartMaker.Domain.Entities;
using MediatR;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

public class CreateChartHandler : IRequestHandler<CreateChartCommand, Chart>
{
    private readonly IChartRepository _repository;
    private readonly IExcelDataReader _excelDataReader;

    public CreateChartHandler(IChartRepository repository, IExcelDataReader excelDataReader)
    {
        _repository = repository;
        _excelDataReader = excelDataReader;
    }

    public async Task<Chart> Handle(CreateChartCommand request, CancellationToken cancellationToken)
    {
        var chart = new Chart
        {
            Title = request.Title,
            Description = $"{request.Title} - {request.Description}",
            CreatedAt = DateTime.UtcNow
        };

        var excelData = _excelDataReader.Read(request.ExcelFile.OpenReadStream());

        foreach (var row in excelData)
        {
            chart.AddData(row.Position, row.Value);
        }

        var dados = String.Join(" | ", excelData.Select(x => "cel: " + x.Position + ", valor: " + x.Value));

        // IA

        var apiKey = "";
        var endpoint = "https://api.openai.com/v1/chat/completions";

        using var httpClient = new HttpClient();

        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        var requestBody = new
        {
            model = "gpt-4o-mini",
            messages = new[]
            {
                new { role = "system", content = "Você é um conversor de dados recebidos de uma planilha excel para usar no chart.js. Somente retorne os dados formatados em json e não diga mais nada" },
                new { role = "user", content = "Os dados enviados pelo usuario é: " + dados }
            }
        };

        var json = System.Text.Json.JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await httpClient.PostAsync(endpoint, content);
        var responseBody = await response.Content.ReadAsStringAsync();

        using JsonDocument doc = JsonDocument.Parse(responseBody);
        var message = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();

        chart.Description = $"Response from OpenAI: {message}";
        Console.WriteLine(message);

        await _repository.AddAsync(chart, cancellationToken);
        return chart;
    }
}

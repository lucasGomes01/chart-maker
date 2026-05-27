using ChartMaker.Application.Commands.Chart.CreateChart;
using ChartMaker.Application.Excel.Interfaces;
using ChartMaker.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

public class CreateChartHandler : IRequestHandler<CreateChartCommand, Chart>
{
    private readonly IChartRepository _repository;
    private readonly IExcelDataReader _excelDataReader;
    private readonly IConfiguration _configuration;

    public CreateChartHandler(IChartRepository repository, IExcelDataReader excelDataReader, IConfiguration configuration)
    {
        _repository = repository;
        _excelDataReader = excelDataReader;
        _configuration = configuration;
    }

    public async Task<Chart> Handle(CreateChartCommand request, CancellationToken cancellationToken)
    {
        var chart = new Chart
        {
            Title = request.Title,
            Description = request.Description ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };

        // Lê dados do Excel, se enviado
        if (request.ExcelFile != null)
        {
            var excelData = _excelDataReader.Read(request.ExcelFile.OpenReadStream());

            foreach (var row in excelData)
            {
                chart.AddData(row.Position, row.Value);
            }

            // Monta o contexto para a IA
            var dados = string.Join(" | ", excelData.Select(x => $"cel: {x.Position}, valor: {x.Value}"));
            var contexto = string.IsNullOrWhiteSpace(request.Description)
                ? dados
                : $"{request.Description}\n\nDados da planilha: {dados}";

            chart.Description = await CallOpenAI(contexto) ?? chart.Description;
        }
        else if (!string.IsNullOrWhiteSpace(request.Description))
        {
            // Somente texto — envia para IA interpretar
            chart.Description = await CallOpenAI(request.Description) ?? request.Description;
        }

        await _repository.AddAsync(chart, cancellationToken);
        return chart;
    }

    private async Task<string?> CallOpenAI(string userContent)
    {
        var apiKey = _configuration["OpenAI:ApiKey"]
                     ?? Environment.GetEnvironmentVariable("OPENAI_API_KEY")
                     ?? string.Empty;

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            Console.WriteLine("[OpenAI] Chave de API não configurada. Retornando dados brutos.");
            return null;
        }

        var endpoint = "https://api.openai.com/v1/chat/completions";

        using var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        var requestBody = new
        {
            model = "gpt-4o-mini",
            messages = new[]
            {
                new
                {
                    role = "system",
                    content = "Você é um conversor de dados para Chart.js. Receba dados do usuário e retorne APENAS um objeto JSON válido no formato: {\"type\": \"bar|line|pie|radar\", \"labels\": [...], \"datasets\": [{\"label\": \"...\", \"data\": [...]}]}. Não adicione texto explicativo, markdown ou blocos de código."
                },
                new { role = "user", content = userContent }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await httpClient.PostAsync(endpoint, content);
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            Console.WriteLine($"[OpenAI] Erro {response.StatusCode}: {responseBody}");
            return null;
        }

        using var doc = JsonDocument.Parse(responseBody);
        var message = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        Console.WriteLine($"[OpenAI] Resposta: {message}");
        return message;
    }
}

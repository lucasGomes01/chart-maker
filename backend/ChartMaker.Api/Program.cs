using ChartMaker.Application.Commands.Chart.CreateChart;
using ChartMaker.Application.Excel.Interfaces;
using ChartMaker.Infrastructure.Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ── Controllers ────────────────────────────────────────────
builder.Services.AddControllers(options =>
{
    // Desativa o filtro automático de 400 do [ApiController]
    // para que nossos controllers possam retornar erros customizados
    options.Filters.Add(new ProducesResponseTypeAttribute(400));
})
.ConfigureApiBehaviorOptions(options =>
{
    // Permite que o controller trate o ModelState manualmente
    // em vez do [ApiController] retornar 400 automaticamente
    options.SuppressModelStateInvalidFilter = true;
})
.AddJsonOptions(options =>
{
    // IgnoreCycles evita referências circulares sem adicionar $id/$values no JSON
    options.JsonSerializerOptions.ReferenceHandler =
        System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = false;
});

// ── Swagger ─────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ── Banco de Dados ───────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Database")));

// ── MediatR ──────────────────────────────────────────────────
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(CreateChartCommand).Assembly);
});

// ── Repositórios e Serviços ──────────────────────────────────
builder.Services.AddScoped<IChartRepository, ChartRepository>();
builder.Services.AddScoped<IExcelDataReader, ExcelDataReader>();

// ── CORS — permite qualquer origem (ajustar em produção) ─────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

// ── Pipeline HTTP ─────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS antes de qualquer middleware de rota
app.UseCors("AllowAll");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();
app.MapControllers();

// ── Migrations com retry ──────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    int retries = 10;
    while (retries > 0)
    {
        try
        {
            Console.WriteLine("Tentando aplicar migrações do banco de dados...");
            dbContext.Database.Migrate();
            Console.WriteLine("Migrações aplicadas com sucesso!");
            break;
        }
        catch
        {
            retries--;
            if (retries == 0)
            {
                Console.WriteLine("Falha crítica: não foi possível conectar ao banco de dados.");
                throw;
            }
            Console.WriteLine($"Banco não está pronto. Tentativas restantes: {retries}. Aguardando 2s...");
            Thread.Sleep(2000);
        }
    }
}

app.Run();

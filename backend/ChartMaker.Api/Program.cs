using ChartMaker.Application.Commands.Chart.CreateChart;
using ChartMaker.Application.Excel.Interfaces;
using ChartMaker.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Database")));

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(CreateChartCommand).Assembly);
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
});

// Repositories
builder.Services.AddScoped<IChartRepository, ChartRepository>();

// Excel Data Reader
builder.Services.AddScoped<IExcelDataReader, ExcelDataReader>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
       builder =>
       {
           builder.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
       });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("AllowAll");

    // Apply migrations at startup with resilience
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
            catch (Exception ex)
            {
                retries--;
                if (retries == 0)
                {
                    Console.WriteLine("Falha crítica: não foi possível conectar ao banco de dados.");
                    throw;
                }
                Console.WriteLine($"Banco de dados não está pronto ainda. Tentativas restantes: {retries}. Aguardando 2 segundos...");
                System.Threading.Thread.Sleep(2000);
            }
        }
    }
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

app.Run();

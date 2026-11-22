using WebApplication1ViaHub.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddScoped<Conexao>();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.MapGet("/teste-banco", async (Conexao fabrica) =>
    {
        await using var conexao = fabrica.CriarConexao();
        await conexao.OpenAsync();

        return Results.Ok(new
        {
            mensagem = "Conexão realizada com sucesso!",
            banco = conexao.Database
        });
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

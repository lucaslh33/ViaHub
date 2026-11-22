using Microsoft.Data.SqlClient;

namespace WebApplication1ViaHub.Api.Data
{
    public class Conexao
    {
        private readonly string _connectionString;

        public Conexao(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("ViaHub")
                ?? throw new InvalidOperationException("Conexão ViaHub não configurada.");
        }

        public SqlConnection CriarConexao()
        {
            return new SqlConnection(_connectionString);
        }
    }
}
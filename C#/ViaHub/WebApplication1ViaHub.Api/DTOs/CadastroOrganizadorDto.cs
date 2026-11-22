using System.ComponentModel.DataAnnotations;

namespace WebApplication1ViaHub.Api.DTOs
{
    public class CadastroOrganizadorDto
    {
        [Required(ErrorMessage = "Informe o nome.")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage ="Informe um e-mail.")]
        [EmailAddress(ErrorMessage ="Informe um e-mail válido.")]
        public string Email {  get; set; } = string.Empty;

        [Required(ErrorMessage ="Informe a senha.")]
        [MinLength(8, ErrorMessage = "A senha deve ter pelo menos 8 caracteres.")]
        public string Senha {  get; set; } = string.Empty;
    }
}

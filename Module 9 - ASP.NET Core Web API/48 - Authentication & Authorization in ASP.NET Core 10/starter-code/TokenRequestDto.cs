using System.ComponentModel.DataAnnotations;

namespace ShopAPI.Security.Assignment.Dtos
{
    public class TokenRequestDto
    {
        [Required]
        public string AccessToken { get; set; } = string.Empty;

        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}

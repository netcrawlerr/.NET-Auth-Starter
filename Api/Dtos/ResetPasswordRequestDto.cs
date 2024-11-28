namespace Api.Dtos;

public class ResetPasswordRequestDto
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string Code { get; set; }
}

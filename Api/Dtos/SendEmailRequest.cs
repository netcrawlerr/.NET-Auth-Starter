namespace Api.Dtos;

public class SendEmailRequest
{
    public string Recipient { get; set; }
    public string Subject { get; set; } = "Reset Password";
    public string? Body { get; set; }
}

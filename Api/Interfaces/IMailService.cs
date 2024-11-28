using Api.Dtos;

namespace Api.Interfaces;

public interface IMailService
{
    Task SendMailAsync(SendEmailRequest sendEmailRequest);
}

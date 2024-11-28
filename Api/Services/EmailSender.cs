using System.Net;
using System.Net.Mail;
using Api.Dtos;
using Api.Interfaces;
using Api.Options;
using Microsoft.Extensions.Options;

namespace Api.Services;

public class EmailSender : IMailService
{
    private readonly GmailOptions _gmailOptions;

    public EmailSender(IOptions<GmailOptions> gmailOptions)
    {
        _gmailOptions = gmailOptions.Value;
    }

    public async Task SendMailAsync(SendEmailRequest sendEmailRequest)
    {
        if (string.IsNullOrEmpty(_gmailOptions.Email))
        {
            throw new ArgumentNullException(
                "Gmail sender email address is missing in configuration."
            );
        }

        if (string.IsNullOrEmpty(sendEmailRequest.Recipient))
        {
            throw new ArgumentNullException("Recipient email address cannot be null or empty.");
        }
        MailMessage mailMessage = new MailMessage
        {
            From = new MailAddress(_gmailOptions.Email),
            Subject = sendEmailRequest.Subject,
            Body = sendEmailRequest.Body,
        };

        Random random = new Random();
        int resetCode = random.Next(100000, 1000000);

        mailMessage.Body = $"Here Is Your Password Reset Code: {resetCode}";

        mailMessage.To.Add(sendEmailRequest.Recipient);

        using var smtpClient = new SmtpClient
        {
            Host = _gmailOptions.Host,
            Port = _gmailOptions.Port,
            Credentials = new NetworkCredential(_gmailOptions.Email, _gmailOptions.Password),
            EnableSsl = true,
        };

        await smtpClient.SendMailAsync(mailMessage);
    }
}

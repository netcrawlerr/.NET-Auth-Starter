using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Api.Models;

public class User : IdentityUser
{
    [MaxLength(255)]
    public string FirstName { get; set; } = string.Empty; 

    [MaxLength(255)]
    public string LastName { get; set; } = string.Empty;

    public string? ResetCode { get; set; }
    public DateTime? ResetCodeExpiry { get; set; }
}
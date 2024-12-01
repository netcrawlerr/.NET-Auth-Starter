using Api.Dtos;
using Api.Interfaces;
using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;

    private readonly IMailService _mailService;

    public AuthController(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        IMailService mailService
    )
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _mailService = mailService;
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequestDto) 
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (
                string.IsNullOrEmpty(loginRequestDto.Email)
                || string.IsNullOrEmpty(loginRequestDto.Password)
            )
            {
                return BadRequest("Email and Password are Required");
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(x =>
                x.Email == loginRequestDto.Email
            );

            if (user == null)
            {
                return Unauthorized("User Not Found !");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(
                user,
                loginRequestDto.Password,
                lockoutOnFailure: true
            );

            if (!result.Succeeded)
            {
                return Unauthorized("Invalid Credentials !");
            }
            return Ok(
                new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                }
            );
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto registerRequestDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            if (
                string.IsNullOrEmpty(registerRequestDto.Email)
                || string.IsNullOrEmpty(registerRequestDto.Password)
                || string.IsNullOrEmpty(registerRequestDto.FirstName)
                || string.IsNullOrEmpty(registerRequestDto.LastName)
            )
            {
                return BadRequest("All Fields are required");
            }

            var user = new User
            {
                UserName = registerRequestDto.Email,
                Email = registerRequestDto.Email,
                FirstName = registerRequestDto.FirstName,
                LastName = registerRequestDto.LastName,
            };

            var newUser = await _userManager.CreateAsync(user, registerRequestDto.Password);

            if (newUser.Succeeded)
            {
                // optionally we can sign in the user
                // await _signInManager.SignInAsync(user, isPersistent: false);

                // var confirmationCode = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                // var callbackurl = Url.Action(
                //     "Confirm Email",
                //     "Account",
                //     new { userid = user.Id, confirmationCode },
                //     protocol: HttpContext.Request.Scheme
                // );

                // await _mailService.SendMailAsync(sendEmailRequest);
                return Ok("User Registered !");
            }
            else
            {
                return StatusCode(500, newUser);
            }
        }
        catch (Exception e)
        {
            return StatusCode(500, e);
        }
    }

    [HttpPost]
    [Route("logout")]
    public async Task<IActionResult> LogOut()
    {
        await _signInManager.SignOutAsync();
        return Ok(new { message = "Successfully logged out." });
    }

    [HttpPost]
    [Route("forgot-password")]
    public async Task<IActionResult> SendResetPasswordEmail(
        [FromBody] SendEmailRequest sendEmailRequest
    )
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(x =>
            x.Email == sendEmailRequest.Recipient
        );

        if (user == null)
        {
            return NotFound("User Not Found!");
        }

        Random random = new Random();
        int resetCode = random.Next(100000, 1000000);

        user.ResetCode = resetCode.ToString();
        user.ResetCodeExpiry = DateTime.UtcNow.AddMinutes(5);

        await _userManager.UpdateAsync(user);

        sendEmailRequest.Body = $"Here is your password reset code: {resetCode}";
        await _mailService.SendMailAsync(sendEmailRequest);

        return Ok("Reset code sent successfully.");
    }

    [HttpPost]
    [Route("check-code")]
    public async Task<IActionResult> CheckCode([FromBody] ResetCodeDto resetCodeDto)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == resetCodeDto.Email);

        if (user == null)
        {
            return NotFound("User Not Found!");
        }

        if (user.ResetCode != resetCodeDto.Code || user.ResetCodeExpiry < DateTime.UtcNow)
        {
            return BadRequest("Invalid or expired reset code.");
        }

        user.ResetCode = null;
        user.ResetCodeExpiry = null;
        return Ok("Code Correct");
    }

    [HttpPost]
    [Route("reset-password/confirm")]
    public async Task<IActionResult> ConfirmResetPassword(
        [FromBody] ResetPasswordRequestDto resetPasswordRequestDto
    )
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(x =>
            x.Email == resetPasswordRequestDto.Email
        );

        var passwordHash = new PasswordHasher<User>().HashPassword(
            user,
            resetPasswordRequestDto.Password
        );
        user.PasswordHash = passwordHash;

        await _userManager.UpdateAsync(user);

        return Ok("Password reset successfully.");
    }
}

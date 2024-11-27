using Api.Dtos;
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

    public AuthController(UserManager<User> userManager, SignInManager<User> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
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
}

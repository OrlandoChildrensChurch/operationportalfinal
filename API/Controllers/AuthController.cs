﻿using System;
using AspNet.Security.OpenIdConnect.Extensions;
using AspNet.Security.OpenIdConnect.Primitives;
using AspNet.Security.OpenIdConnect.Server;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OpenIddict.Abstractions;
using OpenIddict.Core;
using OpenIddict.Validation;
using OpenIddict.EntityFrameworkCore.Models;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using API.Models;
using API.Data;
using API.Helpers;
using System.Collections.Generic;

namespace OCCTest.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly OpenIddictApplicationManager<OpenIddictApplication> applicationManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly ConfigurationModel configModel;

        public AuthController(
            OpenIddictApplicationManager<OpenIddictApplication> applicationManager,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IOptions<ConfigurationModel> configModel)
        {
            this.applicationManager = applicationManager;
            this.signInManager = signInManager;
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.configModel = configModel.Value;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Token(OpenIdConnectRequest requestModel)
        {
            if (!requestModel.IsPasswordGrantType())
            {
                // Return bad request if the request is not for password grant type
                return BadRequest(new OpenIdConnectResponse
                {
                    Error = OpenIdConnectConstants.Errors.UnsupportedGrantType,
                    ErrorDescription = "The specified grant type is not supported."
                });
            }

            var user = await userManager.FindByNameAsync(requestModel.Username);

            if (user == null)
            {
                // Return bad request if the user doesn't exist
                return BadRequest(new OpenIdConnectResponse
                {
                    Error = OpenIdConnectConstants.Errors.InvalidGrant,
                    ErrorDescription = "Invalid username or password"
                });
            }

            // Check that the user can sign in and is not locked out.
            // If two-factor authentication is supported, it would also be appropriate to check that 2FA is enabled for the user
            if (!await signInManager.CanSignInAsync(user) || (userManager.SupportsUserLockout && await userManager.IsLockedOutAsync(user)))
            {
                // Return bad request is the user can't sign in
                return BadRequest(new OpenIdConnectResponse
                {
                    Error = OpenIdConnectConstants.Errors.InvalidGrant,
                    ErrorDescription = "The specified user cannot sign in."
                });
            }

            if (!await userManager.CheckPasswordAsync(user, requestModel.Password))
            {
                // Return bad request if the password is invalid
                return BadRequest(new OpenIdConnectResponse
                {
                    Error = OpenIdConnectConstants.Errors.InvalidGrant,
                    ErrorDescription = "Invalid username or password"
                });
            }

            // The user is now validated, so reset lockout counts, if necessary
            if (userManager.SupportsUserLockout)
            {
                await userManager.ResetAccessFailedCountAsync(user);
            }

            // Create the principal
            var principal = await signInManager.CreateUserPrincipalAsync(user);

            // Claims will not be associated with specific destinations by default, so we must indicate whether they should
            // be included or not in access and identity tokens.
            foreach (var claim in principal.Claims)
            {
                // For this sample, just include all claims in all token types.
                // In reality, claims' destinations would probably differ by token type and depending on the scopes requested.
                claim.SetDestinations(OpenIdConnectConstants.Destinations.AccessToken, OpenIdConnectConstants.Destinations.IdentityToken);
            }

            // Create a new authentication ticket for the user's principal
            var ticket = new AuthenticationTicket(
                principal,
                new AuthenticationProperties(),
                OpenIdConnectServerDefaults.AuthenticationScheme);

            // Include resources and scopes, as appropriate
            var scope = new[]
            {
                OpenIdConnectConstants.Scopes.OpenId,
                OpenIdConnectConstants.Scopes.Email,
                OpenIdConnectConstants.Scopes.Profile,
                OpenIdConnectConstants.Scopes.OfflineAccess,
                OpenIddictConstants.Scopes.Roles
            }.Intersect(requestModel.GetScopes());

            ticket.SetScopes(scope);
            ticket.SetAccessTokenLifetime(new TimeSpan(3, 0, 0));
            ticket.SetAuthorizationCodeLifetime(new TimeSpan(3, 0, 0));

            // Sign in the user
            return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Register(RegisterViewModel newUser)
        {
            VolunteerRepository repo = new VolunteerRepository(configModel.ConnectionString);
            VolunteerModel profile;
            List<string> errors = new List<string>();
            IdentityResult passResult;
            bool passwordFailed = false;
            int id;

            // Validate that the first and last name were provided
            if (String.IsNullOrEmpty(newUser.FirstName))
            {
                return Utilities.ErrorJson("You must provide a first name");
            }
            if (String.IsNullOrEmpty(newUser.LastName))
            {
                return Utilities.ErrorJson("You must provide a last name");
            }

            // Check if a user with that email address already exists
            var existingUser = await userManager.FindByNameAsync(newUser.Email);
            if (existingUser != null)
            {
                return Utilities.ErrorJson("That email is already in use.");
            }

            // Validate that the username and password are valid and no account exists with the username.  We do this here to prevent 
            // having to create and then delete a volunteer profile in the database in the event that one is invalid
            if (!UserHelpers.IsValidEmail(newUser.Email))
            {
                return Utilities.ErrorJson("You must use an email address to sign up.");
            }
            foreach (var validator in userManager.PasswordValidators)
            {
                passResult = await validator.ValidateAsync(userManager, null, newUser.Password);

                if (!passResult.Succeeded)
                {
                    passwordFailed = true;
                    foreach (var error in passResult.Errors)
                    {
                        errors.Add(error.Description);
                    }
                }
            }
            if (passwordFailed)
            {
                return Utilities.ErrorJson(String.Join(" ", errors));
            }

            // Create the profile in the database
            try
            {
                id = repo.CreateVolunteer(new VolunteerModel
                {
                    Email = newUser.Email,
                    FirstName = newUser.FirstName,
                    LastName = newUser.LastName,
                    PreferredName = newUser.FirstName,
                    Picture = newUser.Picture
                });

                if (id == 0)
                {
                    throw new Exception("Unable to create profile in database");
                }
            }
            catch (Exception e)
            {
                return Utilities.ErrorJson(e.Message);
            }

            try
            {
                profile = repo.GetVolunteer(id);
            }
            catch(Exception e)
            {
                repo.DeleteVolunteer(id);
                return Utilities.ErrorJson(e.Message);
            }

            ApplicationUser user = new ApplicationUser
            {
                UserName = profile.Email,
                FirstName = profile.FirstName,
                LastName = profile.LastName,
                VolunteerId = profile.Id,
                Email = profile.Email
            };

            if (!await roleManager.RoleExistsAsync(UserHelpers.UserRoles.Volunteer.ToString()))
            {
                await roleManager.CreateAsync(new IdentityRole { Name = UserHelpers.UserRoles.Volunteer.ToString() });
            }

            IdentityResult result = await userManager.CreateAsync(user, newUser.Password);

            if (result.Succeeded)
            {
                user = await userManager.FindByNameAsync(user.UserName);
                await userManager.AddToRoleAsync(user, UserHelpers.UserRoles.Volunteer.ToString());

                try
                {
                    await EmailHelpers.SendEmail(user.Email, "Welcome to Orlando Children's Church!", 
                        $"Thank you for signing up for Orlando Children's Church, {newUser.FirstName}!\n\n"
                        +"Please remember to visit our operation portal's website at https://www.operation-portal.com in order to finish filling out your profile.\n\n"
                        +"Thanks,\nThe OCC team", configModel.EmailOptions);
                }
                catch(Exception e)
                {
                    // We don't want to abord the signup if the user isn't able to get the email, so this catch remains empty
                }
            }
            else
            {
                // If an error occurred and the user account could not be created for whatever reason, we want to delete the volunteer profile
                repo.DeleteVolunteer(profile.Id);

                // Then we want to return an error message
                foreach (var error in result.Errors)
                {
                    errors.Add(error.Description);
                }

                return Utilities.ErrorJson(String.Join(" ", errors));
            }

            return Utilities.NoErrorJson();
        }

        /// <summary>
        /// Returns the current user's profile
        /// </summary>
        /// <returns>An error string, or if no error occurred, a blank error string and the current user's profile encoded in JSON</returns>
        [HttpGet]
        [Route("~/api/auth/user")]
        [Authorize(AuthenticationSchemes = OpenIddictValidationDefaults.AuthenticationScheme)]
        public async Task<ActionResult> UserInfo()
        {
            VolunteerRepository repo = new VolunteerRepository(configModel.ConnectionString);
            CalendarRepository calendarRepo = new CalendarRepository(configModel.ConnectionString);
            ClassRepository classRepo = new ClassRepository(configModel.ConnectionString);
            BusRepository busRepo = new BusRepository(configModel.ConnectionString);
            AttendanceModel attendance;
            VolunteerModel profile;
            var user = await userManager.GetUserAsync(User);
            bool checkedIn = false;
            List<ClassModel> classes = new List<ClassModel>();
            List<BusModel> buses = new List<BusModel>();

            // Get the current user's profile
            try
            {
                profile = repo.GetVolunteer(user.VolunteerId);
            }
            catch(Exception e)
            {
                return Utilities.ErrorJson(e.Message);
            }

            if (profile == null)
            {
                return Utilities.ErrorJson("Could not find user profile");
            }

            if (configModel.DebugMode || DateTime.Now.DayOfWeek == DayOfWeek.Saturday)
            {
                try
                {
                    attendance = calendarRepo.GetSingleAttendance(profile.Id, DateTime.Now.Date);

                    // determine if the current user has been checked in today
                    if (attendance != null && attendance.Attended == true)
                    {
                        checkedIn = true;
                    }

                    // Get the classes the user teaches and buses the user drives
                    classes = classRepo.GetClasses(true).Where(c => c.TeacherId == profile.Id).ToList();
                    buses = busRepo.GetBusList(true).Where(b => b.DriverId == profile.Id).ToList();
                }
                catch(Exception e)
                {
                    return Utilities.ErrorJson(e.Message);
                }
            }

            return new JsonResult(new
            {
                Error = "",
                Profile = profile,
                CheckedIn = checkedIn,
                Classes = classes,
                Buses = buses
            });

        }

        [HttpPost]
        [Route("~/api/auth/password-reset-request")]
        [AllowAnonymous]
        public async Task<IActionResult> PasswordResetRequest(PasswordResetViewModel vm)
        {
            string email = vm.Email;
            string token;
            var user = await userManager.FindByNameAsync(email);
            VolunteerRepository repo = new VolunteerRepository(configModel.ConnectionString);
            VolunteerModel profile;

            if (!UserHelpers.IsValidEmail(email))
            {
                return Utilities.ErrorJson("Must provide a valid email address");
            }

            if (user == null)
            {
                return Utilities.NoErrorJson();
            }

            try
            {
                profile = repo.GetVolunteer(user.VolunteerId);
            }
            catch(Exception)
            {
                return Utilities.ErrorJson("Unable to get volunteer profile - please try again later.");
            } 

            if (profile == null)
            {
                return Utilities.ErrorJson("Unable to get volunteer profile - please try again later.");
            }

            token = await userManager.GeneratePasswordResetTokenAsync(user);

            try
            {
                await EmailHelpers.SendEmail(email, "Password Reset - OCC",
                    $"Hello {profile.PreferredName + " " + profile.LastName},\n\n" +
                    "You are receiving this email because you requested a password reset for Orlando Children's Church. " +
                    "In order to reset your password, please follow the link below, or copy/paste the code below when prompted.\n\n" +
                    "Link: https://www.operation-portal.com/password-reset-confirm?email=" + HttpUtility.UrlEncode(email) + "&token=" + HttpUtility.UrlEncode(token) + "\n\n" +
                    $"Code: {token}\n\n" +
                    "This code will be valid for 1 hour.  If you did not request a password reset, please ignore this email.",
                    configModel.EmailOptions);
            }
            catch (Exception)
            {
                return Utilities.ErrorJson("An error occurred and a password reset email could not be sent.  Please try again later.");
            }

            return new JsonResult(new { token = token });
        }

        [HttpPost]
        [Route("~/api/auth/password-reset-confirm")]
        [AllowAnonymous]
        public async Task<IActionResult> PasswordResetConfirm(PasswordResetViewModel vm)
        {
            string email = vm.Email;
            string token = vm.Token;
            string password = vm.Password;
            var user = await userManager.FindByNameAsync(email);
            List<string> errors = new List<string>();
            IdentityResult passResult;
            bool passwordFailed = false;

            if (!UserHelpers.IsValidEmail(email))
            {
                return Utilities.ErrorJson("Must send a valid email address");
            }

            if (user == null)
            {
                return Utilities.NoErrorJson();
            }

            // Validate the password prior to changing it, and if it does not work, kick it back to the user.
            foreach (var validator in userManager.PasswordValidators)
            {
                passResult = await validator.ValidateAsync(userManager, null, password);

                if (!passResult.Succeeded)
                {
                    passwordFailed = true;
                    foreach (var error in passResult.Errors)
                    {
                        errors.Add(error.Description);
                    }
                }
            }
            if (passwordFailed)
            {
                return Utilities.ErrorJson(String.Join(" ", errors));
            }

            IdentityResult result = await userManager.ResetPasswordAsync(user, token, password);

            if (!result.Succeeded)
            {
                return Utilities.ErrorJson("The code you provided was invalid.  Please double check the code and try again, or request a new code.");
            }

            return Utilities.NoErrorJson();
        }
    }
}
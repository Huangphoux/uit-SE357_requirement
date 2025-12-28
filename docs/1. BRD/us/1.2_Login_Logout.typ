

= Login/Logout

#table(
  columns: (auto, 1fr),
  [*Epic*], [User Authentication & Roles],
  [*Actor*], [Any User],
  [*MVP*], [Yes],
  [*Description / Notes*], [Authenticate with credentials],
  [*As a*], [User],
  [*I want to*], [Log in/out securely],
  [*Trigger*],
  [
    - User clicks the "Login" or "Sign In" button after entering credentials on the login page.
    - User navigates to a protected page and is prompted to authenticate.
    - User clicks the "Logout" or "Sign Out" button while authenticated.
  ],

  [*Pre-conditions*],
  [
    - For Login:
      - User already has an account (registered) or an account was created previously.
      - User is not currently authenticated (no valid session/JWT present).
      - Authentication service (backend API, database) is available and reachable.
      - User has a stable internet connection.
    - For Logout:
      - User is currently authenticated (session/JWT present).
  ],

  [*So that*], [I can access my dashboard safely],
  [*Solution (Step-by-Step)*],
  [
    - Show login form
    - Validate credentials
    - Backend returns session/JWT
    - Store token (cookie/localStorage)
    - Redirect to dashboard
    - Logout: clear token, redirect
  ],

  [*Post-conditions*],
  [
    - After successful Login:
      - Backend issues a valid session or JWT tied to the user.
      - Client stores the token securely (HTTP-only cookie or secure storage per policy).
      - User is redirected to their dashboard or the originally requested protected resource.
      - User gains access to authorized features according to their role.
      - Login event is recorded in audit/logging systems.
    - After Logout:
      - Client-side authentication token is removed/cleared.
      - Server-side session (if any) is invalidated.
      - User is redirected to the public home or login page.
      - Logout event is recorded in audit/logging systems.
  ],
)

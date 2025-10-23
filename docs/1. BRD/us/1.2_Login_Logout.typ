#set heading(offset: 1)

= Login/Logout

- Epic: User Authentication & Roles
- Actor: Any User
- MVP: Yes
- BR: BR2
- Description / Notes: Authenticate with credentials
- As a: User
- I want to: Log in/out securely
- So that: I can access my dashboard safely
- Solution (Step-by-Step):
  - Show login form
  - Validate credentials
  - Backend returns session/JWT
  - Store token (cookie/localStorage)
  - Redirect to dashboard
  - Logout: clear token, redirect

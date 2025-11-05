

= Sign up

- Epic: User Authentication & Roles
- Actor: Student
- MVP: Yes
- BR: BR1
- Description / Notes: Register on the platform
- As a: New student
- I want to: Sign up with email and password
- Trigger: User clicks on the “Sign Up” or “Create Account” button
- Pre-conditions:
  - User is not currently logged in.
  - User has a stable internet connection.
  - Registration page and backend API are available.
  - The email entered has not been registered before.
- So that: I can access my account
- Solution (Step-by-Step):
  - Display registration form (email, password)
  - Validate input fields
  - Submit to backend API
  - Hash password, create user
  - Send confirmation email (optional)
  - Redirect or auto-login
- Post-conditions:
  - New user account is successfully created in the database.
  - (Optional) Verification email is sent.
  - User can log in with their credentials.
  - Registration event is logged for tracking.

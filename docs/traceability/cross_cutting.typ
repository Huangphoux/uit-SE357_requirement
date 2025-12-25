= Cross-Cutting Concerns

== Authentication & Authorization
*Middleware:* #link("../../server/src/auth/auth.middleware.ts")[auth.middleware.ts]
- authenticateUser - JWT validation
- requireAdmin - Admin-only endpoints
- requireTeacher - Teacher-only endpoints
- requireStudent - Student-only endpoints

*Context:* #link("../../client/src/contexts/AuthContext.tsx")[AuthContext.tsx]
- Login/logout state management
- User role management
- Protected route handling

== Dark Mode Support
*Toggle:* #link("../../client/src/pages/DarkModeToggle.tsx")[DarkModeToggle.tsx]
*Context:* #link("../../client/src/contexts/DarkModeContext.tsx")[DarkModeContext.tsx]

== Form Validation
*Backend:* #link("../../server/src/util/validation.ts")[validation.ts] (Zod schemas)
*Frontend:*
- #link("../../client/src/pages/ValidatedInput.tsx")[ValidatedInput.tsx]
- #link("../../client/src/utils/validation.ts")[validation.ts] (client-side rules)

== API Configuration
*Backend:* #link("../../server/src/api/axios.ts")[axios.ts] (API client setup)
*Frontend:* #link("../../client/src/api/axios.ts")[axios.ts] (interceptors, base URL)

== Main Application Entry Points
*Backend:*
- #link("../../server/src/index.ts")[index.ts] (server startup)
- #link("../../server/src/app.ts")[app.ts] (Express app configuration, routes)

*Frontend:*
- #link("../../client/src/main.tsx")[main.tsx] (React app entry)
- #link("../../client/src/App.tsx")[App.tsx] (routing)

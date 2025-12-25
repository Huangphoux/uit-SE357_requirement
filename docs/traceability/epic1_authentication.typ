== Epic 1: User Authentication & Roles

=== US 1.1: Sign Up

==== BRD
- #link("../1. BRD/us/1.1_Sign_up.typ")[1.1_Sign_up.typ]

==== Diagrams
- Sequence: #link("../2. Diagrams/Sequence diagram/0. SignUp/SignUp.pu")[SignUp.pu]
- Activity: #link("../2. Diagrams/Activity diagram/0. SignUp/SignUp.pu")[SignUp.pu]

==== Backend
- #link("../../server/src/auth/auth.controller.ts")[auth.controller.ts] - register method
- #link("../../server/src/auth/auth.service.ts")[auth.service.ts] - register method
- #link("../../server/src/auth/auth.route.ts")[auth.route.ts] - POST /register
- #link("../../server/src/auth/auth.schema.ts")[auth.schema.ts] - registerSchema

==== Frontend
- #link("../../client/src/pages/StudentRegistration.tsx")[StudentRegistration.tsx]
- #link("../../client/src/service/auth.ts")[auth.ts] - register function

==== Database
- #link("../../server/prisma/schema.prisma")[schema.prisma] (User model)

=== US 1.2: Login/Logout

==== BRD
- #link("../1. BRD/us/1.2_Login_Logout.typ")[1.2_Login_Logout.typ]

==== Diagrams
- Sequence: #link("../2. Diagrams/Sequence diagram/1. Login/Login.pu")[Login.pu], #link("../2. Diagrams/Sequence diagram/1. Login/Logout.pu")[Logout.pu]
- Activity: #link("../2. Diagrams/Activity diagram/1. Login/Login.pu")[Login.pu], #link("../2. Diagrams/Activity diagram/1. Login/Logout.pu")[Logout.pu]

==== Backend
- #link("../../server/src/auth/auth.controller.ts")[auth.controller.ts] - login, logout methods
- #link("../../server/src/auth/auth.service.ts")[auth.service.ts] - login, logout methods
- #link("../../server/src/auth/auth.route.ts")[auth.route.ts] - POST /login, /logout, /refresh-token
- #link("../../server/src/auth/auth.middleware.ts")[auth.middleware.ts] - JWT validation

==== Frontend
- #link("../../client/src/pages/Login.tsx")[Login.tsx]
- #link("../../client/src/contexts/AuthContext.tsx")[AuthContext.tsx]
- #link("../../client/src/service/auth.ts")[auth.ts] - login, logout functions

==== Database
- #link("../../server/prisma/schema.prisma")[schema.prisma] (User.refreshToken)

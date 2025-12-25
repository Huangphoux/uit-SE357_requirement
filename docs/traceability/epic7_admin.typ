== Epic 7: Admin Dashboard & Settings

=== US 7.2: Manage User Accounts

==== BRD
- #link("../1. BRD/us/7.2_Manage_User_Accounts.typ")[7.2_Manage_User_Accounts.typ]

==== Status
- Partially implemented (read-only)

==== Backend
- #link("../../server/src/user/user.controller.ts")[user.controller.ts] - getUserInfo, listTeachers, listStudents, listAllUsers
- #link("../../server/src/user/user.service.ts")[user.service.ts]
- #link("../../server/src/user/user.route.ts")[user.route.ts]

==== Frontend
- #link("../../client/src/pages/AdminDashboard.tsx")[AdminDashboard.tsx] - UserManagement
- #link("../../client/src/service/user.ts")[user.ts]

==== Future
- Create users, update roles, activate/deactivate accounts

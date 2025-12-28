#set heading(numbering: "1.")

= ViewPlatformStats Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR216],
  [Displaying Rules:
    Admin navigates to statistics dashboard from "Admin Dashboard" screen (Refer to "Admin Dashboard" view in "View Description" file). System calls method `displayPlatformStats()` to show statistics page.],

  [(2)],
  [BR217],
  [Authorization Rules:
    System verifies [User.role] = 'ADMIN' by checking session user.
    If not admin, display error (Refer to MSG 53) and redirect to dashboard.
    Only admin role can access platform statistics.],

  [(3)],
  [BR218],
  [Data Aggregation Rules:
    System calls multiple aggregate methods to calculate key metrics:
    - `getTotalUsers()`: `SELECT COUNT(\*) FROM User`
    - `getActiveCourses()`: `SELECT COUNT(\*) FROM Course`
    - `getTotalEnrollments()`: `SELECT COUNT(\*) FROM Enrollment WHERE status = 'ACTIVE'`
    - `getSubmissionCompletionRate()`: `SELECT (SELECT COUNT(\*) FROM Submission WHERE status = 'SUBMITTED') \* 100.0 / (SELECT COUNT(\*) FROM Assignment)`
    Refer to respective tables in "DB Sheet" file.],

  [(4)],
  [BR219],
  [Time Filter Rules:
    Admin can select date range filter from dropdown (today, week, month, year, custom). System calls method `setDateFilter(String period)` to update statistics queries with date constraints.],

  [(5)],
  [BR220],
  [Custom Date Rules:
    If admin selects custom range, system displays date pickers for start and end dates. System calls method `applyCustomDateRange(Date startDate, Date endDate)` to filter statistics.
    Validate start date < end date.],

  [(6)],
  [BR221],
  [Display Rules:
    System displays statistics in charts and figures showing:
    - Total users count (by role breakdown)
    - Active courses count
    - Enrollment rate
    - Submission completion percentage
    - Active sessions count
    System calls method `renderStatsDashboard(Stats stats)` to display visualizations.],

  [(7)],
  [BR222],
  [Refresh Rules:
    Admin can click refresh button to update statistics. System calls method `refreshStats()` to re-query all metrics and update display.],
)

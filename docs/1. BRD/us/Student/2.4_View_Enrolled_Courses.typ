= View Enrolled Courses

#table(
  columns: (auto, 1fr),
  [*Epic*], [Course & Class Management],
  [*Actor*], [Student],
  [*MVP*], [Yes],
  [*Description / Notes*], [Show list of joined courses],
  [*As a*], [Student],
  [*I want to*], [View my enrolled courses],
  [*So that*], [I know when and what I'm learning],
  [*Trigger*], [The student logs in or navigates to their dashboard.],
  [*Pre-condition*],
  [
    - The student is logged in.
  ],

  [*Post-condition*],
  [
    - A list of the student's enrolled courses is displayed.
  ],

  [*Solution (Step-by-Step)*],
  [
    - Student logs in
    - Fetch enrolled courses from backend
    - Display course list in dashboard
  ],
)

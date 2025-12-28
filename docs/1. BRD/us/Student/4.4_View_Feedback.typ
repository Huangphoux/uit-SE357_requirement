= View Feedback

#table(
  columns: (auto, 1fr),
  [*Epic*], [Assignment Management],
  [*Actor*], [Student],
  [*MVP*], [Yes6],
  [*Description / Notes*], [Read teacher comments],
  [*As a*], [Student],
  [*I want to*], [View teacher feedback/comments],
  [*So that*], [I can learn from my mistakes],
  [*Trigger*], [The student opens a graded assignment.],
  [*Pre-condition*],
  [
    - The student is logged in.
    - The teacher has provided feedback on a submission.
  ],

  [*Post-condition*],
  [
    - The teacher's feedback and grade are displayed.
  ],

  [*Solution (Step-by-Step)*],
  [
    - Open submitted assignment
    - View teacher feedback
    - Backend fetches feedback
    - Display comments/scores
  ],
)

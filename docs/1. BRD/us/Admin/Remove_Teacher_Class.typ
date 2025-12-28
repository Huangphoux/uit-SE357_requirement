= Remove Teacher from Class

#table(
  columns: (auto, 1fr),
  [*Epic*], [Teacher Management],
  [*Actor*], [Admin],
  [*MVP*], [Yes],
  [*BR*], [BR-TCH-2],
  [*Description / Notes*], [Remove a teacher's assignment from a class.],
  [*As a*], [Admin],
  [*I want to*], [Remove a teacher from a class],
  [*So that*], [The class no longer has the teacher assigned.],
  [*Trigger*], [A teacher's assignment to a class needs to be revoked.],
  [*Pre-condition*],
  [
    - Admin is logged in.
    - The teacher is currently assigned to the class.
  ],

  [*Post-condition*],
  [
    - The teacher is no longer assigned to the class.
  ],

  [*Solution (Step-by-Step)*],
  [
    - Open the class management panel.
    - Select the class.
    - View the assigned teacher.
    - Remove the teacher's assignment.
  ],
)

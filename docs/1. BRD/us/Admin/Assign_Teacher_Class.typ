= Assign Teacher to Class

#table(
  columns: (auto, 1fr),
  [*Epic*], [Teacher Management],
  [*Actor*], [Admin],
  [*MVP*], [Yes],
  [*BR*], [BR-TCH-1],
  [*Description / Notes*], [Assign a teacher to a class.],
  [*As a*], [Admin],
  [*I want to*], [Assign a teacher to a class],
  [*So that*], [The class has an assigned teacher.],
  [*Trigger*], [A class needs a teacher to be assigned to it.],
  [*Pre-condition*],
  [
    - Admin is logged in.
    - Teacher and Class exist.
  ],

  [*Post-condition*],
  [
    - The teacher is assigned to the class.
  ],

  [*Solution (Step-by-Step)*],
  [
    - Open the class management panel.
    - Select a class.
    - Select a teacher from the list of available teachers.
    - Assign the teacher to the class.
  ],
)

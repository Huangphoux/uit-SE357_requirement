#set page(width: auto)

#table(
  columns: 13,
  [*\#*], [*Column Name*], [*Column Type*], [*Label*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*], [*Design Solution*], [*Extracting UT*], [*Pre-Processing UT*], [*Transforming UT*], [*Post-Processing UT*], [*Comment*],
  [1], [Image], [Image], [Image], [No], [Yes], [], [This field describes image of the document.], [], [], [], [], [],
  [2], [Title], [Single line Of Text], [Title], [No], [Yes], [], [This field describes title of the document.], [], [], [], [], [],
  [3], [Content], [Rich Text], [Content], [No], [Yes], [], [This field describes content in the document.], [], [], [], [], [],
  [4], [Views], [Number], [Views], [No], [Yes], [], [This field describes number of views of the document.], [], [], [], [], [],
  [5], [], [Button], [Update], [No], [], [], [This button opens a form to update info.], [], [], [], [], [],
  [6], [], [Button], [Delete], [No], [], [], [This button displays a confirmation box.], [], [], [], [], [],
)

#table(
  columns: 2,
  [*\#*], [*Rule Name*], [*Rule Description*],
  [1], [Validation Rules], [If any mandatory field is left blank, system shows error message MSG 1.],
  [2], [Creating Rule], [Only Administrator has permission to create "Document Management" items.],
  [3], [Updating Rule], [Only Administrator has permission to update "Document Management" items.],
  [4], [Deleting Rule], [Only Administrator has permission to delete "Document Management" items.],
  [5], [Reading Rule], [Only Administrator has permission to read "Document Management" items.],
)
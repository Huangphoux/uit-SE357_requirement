#set page(
  paper: "a4",
  width: auto,
  height: auto,
)

= Danh sách các chức năng và tính điểm chức năng


= Bảng phân tích chức năng

#table(
  columns: 14,
  align: center + horizon,

  // Header row 1
  table.cell(rowspan: 2)[*STT*],
  table.cell(rowspan: 2)[*Chức năng chính*],
  table.cell(rowspan: 2)[*Chức năng con*],
  table.cell(colspan: 10)[*Danh sách độ đo*],
  table.cell(rowspan: 2)[*UFP*],

  // Header row 2
  [*EI-C*], [*EI-W*],
  [*EO-C*], [*EO-W*],
  [*EQ-C*], [*EQ-W*],
  [*ILF-C*], [*ILF-W*],
  [*EIF-C*], [*EIF-W*],

  // 1. Authentication
  [1], [Xác thực], [Sign up], [S], [4], [], [], [], [], [S], [7], [], [], [11],
  [2], [], [Login], [S], [3], [], [], [], [], [], [], [], [], [3],
  [3], [], [Logout], [S], [3], [], [], [], [], [], [], [], [], [3],

  // 2. Course Management
  [4], [Quản lý khóa học], [Create Course], [A], [6], [], [], [], [], [A], [10], [], [], [16],
  [5], [], [Update Course], [A], [6], [], [], [], [], [], [], [], [], [6],
  [6], [], [Delete Course], [A], [6], [], [], [], [], [], [], [], [], [6],
  [7], [], [View Courses], [], [], [A], [7], [], [], [], [], [], [], [7],

  // 3. Class Management
  [8], [Quản lý lớp học], [Create Class], [A], [6], [], [], [], [], [S], [7], [], [], [13],
  [9], [], [Update Class], [A], [6], [], [], [], [], [], [], [], [], [6],
  [10], [], [Delete Class], [A], [6], [], [], [], [], [], [], [], [], [6],
  [11], [], [Assign Teacher], [A], [6], [], [], [], [], [], [], [], [], [6],

  // 4. Enrollment
  [12], [Đăng ký học], [Enroll Student], [A], [6], [], [], [], [], [S], [7], [], [], [13],
  [13], [], [View Enrollments], [], [], [S], [5], [], [], [], [], [], [], [5],

  // 5. Materials
  [14], [Tài liệu học], [Upload Material], [A], [6], [], [], [], [], [A], [10], [], [], [16],
  [15], [], [View Materials], [], [], [S], [5], [], [], [], [], [], [], [5],

  // 6. Assignments
  [16], [Bài tập], [Create Assignment], [A], [6], [], [], [], [], [A], [10], [], [], [16],
  [17], [], [Update Assignment], [A], [6], [], [], [], [], [], [], [], [], [6],
  [18], [], [View Assignments], [], [], [A], [7], [], [], [], [], [], [], [7],

  // 7. Submissions
  [19], [Nộp bài], [Submit Assignment], [A], [6], [], [], [], [], [S], [7], [], [], [13],
  [20], [], [View Submissions], [], [], [A], [7], [], [], [], [], [], [], [7],

  // 8. Feedback
  [21], [Phản hồi], [Add Feedback], [A], [6], [], [], [], [], [S], [7], [], [], [13],
  [22], [], [View Feedback], [], [], [S], [5], [], [], [], [], [], [], [5],

  // 9. User Management
  [23], [Quản lý user], [Create Teacher], [A], [6], [], [], [], [], [], [], [], [], [6],
  [24], [], [View Users], [], [], [A], [7], [], [], [], [], [], [], [7],

  // Totals
  table.cell(colspan: 3)[*TỔNG CỘNG*], [*99*], [], [*0*], [], [*45*], [], [*48*], [], [*0*], [*192*],
)

= Bảng tính giá trị hiệu chỉnh (VAF - Value Adjustment Factor)

#table(
  columns: 4,
  align: (center, left, center, center),

  [*STT*], [*Đặc tính hệ thống (GSC)*], [*Mức độ*], [*Điểm*],

  [1], [Truyền thông dữ liệu (Data communications)], [4], [4],
  [2], [Xử lý phân tán (Distributed data processing)], [0], [0],
  [3], [Hiệu suất (Performance)], [3], [3],
  [4], [Cấu hình được sử dụng nhiều (Heavily used configuration)], [3], [3],
  [5], [Tốc độ giao dịch (Transaction rate)], [3], [3],
  [6], [Nhập dữ liệu trực tuyến (Online data entry)], [5], [5],
  [7], [Hiệu quả người dùng cuối (End-user efficiency)], [4], [4],
  [8], [Cập nhật trực tuyến (Online update)], [5], [5],
  [9], [Xử lý phức tạp (Complex processing)], [2], [2],
  [10], [Tái sử dụng (Reusability)], [3], [3],
  [11], [Dễ cài đặt (Installation ease)], [4], [4],
  [12], [Dễ vận hành (Operational ease)], [4], [4],
  [13], [Nhiều địa điểm (Multiple sites)], [2], [2],
  [14], [Dễ thay đổi (Facilitate change)], [3], [3],

  table.cell(colspan: 2)[*TỔNG ĐIỂM TDI (Total Degree of Influence)*], table.cell(colspan: 2)[*45*],
)

= Kết quả tính điểm chức năng

#table(
  columns: 3,
  align: (left, center, center),

  [*Thông số*], [*Ký hiệu*], [*Giá trị*],

  [Tổng điểm chức năng chưa hiệu chỉnh (Δ)], [UFP], [192],
  [Tổng điểm ảnh hưởng (∑Fᵢ)], [TDI], [45],
  [Hệ số hiệu chỉnh giá trị (0.65 + 0.01 × ∑Fᵢ)], [VAF], [1.10],
  [*Tổng điểm chức năng (FP = Δ × VAF)*], [*FP*], [*211.2*],
)

= Phân loại độ phức tạp

#table(
  columns: 3,
  align: (center, left, center),

  [*Ký hiệu*], [*Mức độ phức tạp*], [*Trọng số*],

  [S], [Đơn giản (Simple)], [3-4],
  [A], [Trung bình (Average)], [5-7],
  [C], [Phức tạp (Complex)], [6-7],
)

*Chú thích các loại chức năng:*
- *EI (External Input):* Nhập dữ liệu từ bên ngoài vào hệ thống
- *EO (External Output):* Xuất dữ liệu ra bên ngoài có xử lý logic
- *EQ (External Inquiry):* Truy vấn dữ liệu đơn giản
- *ILF (Internal Logical File):* File/bảng dữ liệu nội bộ
- *EIF (External Interface File):* File/bảng dữ liệu từ hệ thống khác

*Kết luận:* Hệ thống có tổng cộng *211.2 Function Points*, tương đương với một hệ thống quy mô nhỏ-trung bình với các chức năng cơ bản: quản lý khóa học, lớp học, bài tập, nộp bài và phản hồi.

#import "@preview/diatypst:0.8.0": *

#show: slides.with(
  title: "Xây dựng website quản lí trung tâm tiếng Anh",
  subtitle: "Kiến trúc Phần mềm - SE356.Q22",
  date: "2026",
  authors: "23521224 Trương Hoàng Phúc
23521140 Lê Minh Phát",

  ratio: 4 / 3,
  layout: "small",
  title-color: blue,
  toc: true,
  theme: "full",
  count: "number",
)

#pagebreak()

== Tổng quan dự án

*Hệ thống quản lí trung tâm tiếng Anh*

#align(left)[
  - Nền tảng web toàn diện quản lý hoạt động giáo dục
  - 3 vai trò chính: Admin, Teacher, Student
  - Quản lý: Khóa học, Tài liệu, Bài tập, Tiến độ học
  - 31 use cases chính từ BRD
  - Kiến trúc: React + Node.js + PostgreSQL + Redis
]

#pagebreak()

== BRD: 7 lĩnh vực chính

#grid(
  columns: (1fr, 1fr),
  gutter: 20pt,
  [
    *1. Xác thực & phân quyền*
    - Đăng ký / Đăng nhập
    - Quản lý vai trò

    *2. Quản lý khóa học*
    - Tạo/sửa khóa học
    - Đăng ký học viên

    *3. Tài liệu học tập*
    - Upload nội dung
    - Quản lý quyền truy cập
  ],
  [
    *4. Bài tập & nộp bài*
    - Tạo bài tập
    - Chấm điểm & Feedback

    *5. Thông báo*
    - Thông báo động
    - Nhắc nhở lịch học

    *6. Theo dõi tiến độ*
    - Xem lịch sử nộp bài
    - Thống kê học tập

    *7. Quản trị hệ thống*
    - Dashboard admin
    - Cấu hình nền tảng
  ],
)

#pagebreak()

== BRD: các vai trò chính

#grid(
  columns: (1fr, 1fr, 1fr),
  gutter: 15pt,
  [
    #align(center)[
      *Admin* 👨‍💼
    ]
    - Quản lý tài khoản
    - Phân công giáo viên
    - Xem thống kê
    - Cấu hình hệ thống
  ],
  [
    #align(center)[
      *Teacher* 👨‍🏫
    ]
    - Quản lý nội dung
    - Upload tài liệu
    - Tạo & chấm bài
    - Gửi feedback
  ],
  [
    #align(center)[
      *Student* 👨‍🎓
    ]
    - Đăng ký khóa học
    - Truy cập tài liệu
    - Nộp bài tập
    - Xem tiến độ
  ],
)

#pagebreak()

== ASR: Tổng quan

#align(left)[
  *Performance* (4)
  - ASR-PERF-01: 500 users đồng thời
  - ASR-PERF-02: Query 10,000+ records
  - ASR-PERF-03: Tăng trưởng dữ liệu
  - ASR-ENROLL-01: 500 enrollment đồng thời

  *Availability* (2)
  - ASR-AVAIL-01: Uptime 99.9%
  - ASR-AVAIL-02: Maintenance mode

  *Security* (15)
  - ASR-SEC-01 to 15: Authentication, RBAC, Encryption, Input Validation, Audit Logs, Rate limiting, Anti-brute force, Virus scanning

  *Other* (3)
  - ASR-NOTIF-01: Batch notifications
  - ASR-FILE-01: Concurrent downloads
  - ASR-AGGR-01: Dashboard aggregations
]

#pagebreak()

== ASR-PERF: Hiệu Suất

#align(left)[
  *ASR-PERF-01: Xử lý 500 users đồng thời*
  - Yêu cầu: Response time < 2 giây
  - Giải pháp: Load balancing + Caching

  *ASR-PERF-02: Query database lớn*
  - 10,000+ tài liệu
  - Response time < 2 giây
  - Giải pháp: Pagination + Database indexing

  *ASR-PERF-03: Tăng trưởng dữ liệu*
  - Dữ liệu tăng 20%/năm
  - Giải pháp: Kiến trúc scalable

  *ASR-ENROLL-01: 500 enrollment đồng thời*
  - Response < 2 giây
]

#pagebreak()

== ASR-AVAIL: khả dụng & ASR-FILE

#align(left)[
  *ASR-AVAIL-01: Uptime 99.9%*
  - Hoạt động 24/7
  - Hệ thống luôn sẵn sàng

  *ASR-AVAIL-02: Maintenance window*
  - Read-only mode: 2AM-4AM EST
  - Admin thực hiện bảo trì định kỳ

  *ASR-FILE-01: Download concurrent*
  - 500 download đồng thời
  - Phục vụ tài liệu học 24/7
]

#pagebreak()

== ASR-SEC: bảo mật (phần 1)

#align(left)[
  *ASR-SEC-01: Password security*
  - ≥8 ký tự, chữ hoa/thường/số
  - Bcrypt hash, salt rounds ≥10

  *ASR-SEC-02: JWT authentication*
  - Token expiry: 1 giờ
  - Login response < 2 giây

  *ASR-SEC-03: Anti brute-force*
  - Block IP sau 5 lần sai trong 15 phút

  *ASR-SEC-04: MFA cho admin*
  - Xác thực đa yếu tố bắt buộc

  *ASR-SEC-05: RBAC*
  - 100% request kiểm tra quyền trước xử lý
]

#pagebreak()

== ASR-SEC: bảo mật (phần 2)

#align(left)[
  *ASR-SEC-06: HTTPS/TLS*
  - 100% traffic mã hóa

  *ASR-SEC-07: Encryption at rest*
  - Dữ liệu nhạy cảm mã hóa trong DB

  *ASR-SEC-08: Input validation*
  - 100% input validate & sanitize

  *ASR-SEC-09: SQL injection prevention*
  - Parameterized queries (Prisma)

  *ASR-SEC-10: Audit logging*
  - Ghi log tất cả hành động quan trọng
]

#pagebreak()

== ASR-SEC: bảo mật (phần 3)

#align(left)[
  *ASR-SEC-11: Audit log retention*
  - Giữ logs ≥1 năm

  *ASR-SEC-12: Malware scanning*
  - Quét virus cho upload files
  - Whitelist file types

  *ASR-SEC-14: File size limit*
  - Materials: 50MB
  - Submissions: 20MB

  *ASR-SEC-15: Rate limiting*
  - Áp dụng cho login & API endpoints
]

#pagebreak()

== ASR-AGGR & ASR-NOTIF

#align(left)[
  *ASR-AGGR-01: Dashboard statistics*
  - Aggregate 10,000+ records
  - Response < 5 giây
  - Caching: 5 phút

  *ASR-NOTIF-01: Batch notifications*
  - Gửi thông báo hàng loạt
  - Deliver đến 500 recipients
  - Thời gian: < 1 phút
  - Teacher gửi notification cho course
]

#pagebreak()

== Kiến trúc kỹ thuật

#grid(
  columns: (1fr, 1fr, 1fr),
  gutter: 20pt,
  [
    *Frontend*
    - React SPA (TypeScript)
  ],
  [
    *Backend*
    - Node.js + Express
    - 2 instances (availability)
  ],
  [
    *Database*
    - PostgreSQL 16 (primary)
    - Redis 7 (caching)
  ],

  [
    *Proxy & Load Balancing*
    - Caddy 2 (TLS, load balancing)
  ],
  [
    *Deployment*
    - Docker Compose
    - File storage volume
  ],
)

#pagebreak()

== Tóm Tắt: BRD vs ASR

#table(
  columns: (1fr, 2fr),
  align: (left, left),

  [*BRD*], [*ASR Support*],
  [Xác thực & phân quyền], [SEC-01,02,03,04,05,10],
  [Quản lý khóa học], [PERF-01,02,ENROLL-01],
  [Tài liệu & bài tập], [FILE-01,NOTIF-01,SEC-12,14],
  [Theo dõi tiến độ], [AGGR-01],
  [Nền tảng], [AVAIL-01,02,PERF-03],
)

#pagebreak()

== Tổng kết

*Hệ thống quản lí trung tâm tiếng Anh*

- ✓ 7 lĩnh vực BRD rõ ràng
- ✓ 26 ASR bao trùm Performance, Availability, Security
- ✓ Kiến trúc hiện đại: React + Node.js + PostgreSQL
- ✓ Khả năng xử lý: 500 users đồng thời
- ✓ Bảo mật toàn diện: RBAC, JWT, Encryption, Audit
- ✓ Uptime 99.9% + Load balancing + Caching

#align(center + horizon)[
  #text(size: 20pt, weight: "bold")[
    Cảm ơn vì đã mua sự chú ý!
  ]
]

#import "@preview/basic-report:0.3.1": *

#show: it => basic-report(
  doc-category: "Quản lý dự án Phát triển Phần mềm - SE358.Q11

Đề tài 2: Ứng dụng quản lý lớp học trực tuyến cho trung tâm ngoại ngữ.",
  doc-title: "Business Requirement Document",
  author: "23521224 Trương Hoàng Phúc
23521736 Bùi Văn Tùng
23520657 Vũ Quốc Huy
23520466 Tạ Hoàng Hiệp
23520682 Đỗ Đình Khang",
  language: "vi",
  compact-mode: false,
  it
)

#set page(margin: 1.75in)
#set par(leading: 0.55em, spacing: 0.55em, first-line-indent: 1.8em, justify: true)
#show heading: set block(above: 1.4em, below: 1em)

= Actors

#include "actor.typ"

= Epics

#include "epic.typ"

= User stories & Use cases

#include "us.typ"

= Domain objects

= Components
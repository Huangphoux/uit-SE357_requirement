#import "@preview/basic-report:0.3.1": *

#show: it => basic-report(
  doc-category: "Kỹ thuật phân tích yêu cầu - SE357.Q12
  
Xây dựng website quản lí trung tâm tiếng Anh",
  doc-title: "Business Requirement Document",
  author: "23521224 Trương Hoàng Phúc
23520448 Nguyễn Văn Hào",
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

#include "domain.typ"

= Components

#include "component.typ"
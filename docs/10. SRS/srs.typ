#import "@preview/basic-report:0.3.1": *

#show: it => basic-report(
  doc-category: "Kỹ thuật phân tích yêu cầu - SE357.Q12
  
Xây dựng website quản lí trung tâm tiếng Anh",
  doc-title: "Software Requirements Specification",
  author: "23521224 Trương Hoàng Phúc
23520448 Nguyễn Văn Hào",
  language: "vi",
  compact-mode: false,
  it
)

#set page(margin: 1.75in)
#set par(leading: 0.55em, spacing: 0.55em, first-line-indent: 1.8em, justify: true)
#show heading: set block(above: 1.4em, below: 1em)

= Introduction

#include "intro.typ"

= Functional Requirements

== Use Case Description

#include "us_srs.typ"

== List Description
== View Description

= Non-Functional Requirements

== User Access and Security

== Performance Requirements

== Implementation Requirements


= Other Requirements

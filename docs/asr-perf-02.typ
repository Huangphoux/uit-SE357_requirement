#import "@preview/basic-report:0.3.1": *

#set page(margin: 1.75in)
#set par(leading: 0.55em, spacing: 0.55em, first-line-indent: 1.8em, justify: true)
#show heading: set block(above: 1.4em, below: 1em)

= ASR-PERF-02: Performance - Large Database List Queries

== Requirement Summary

The system shall return course, student, and assignment lists from a database with 10,000+ records using pagination and database indexing. Response time must remain under 2 seconds.

== Benchmark Methodology

*Test Environment:*
- Database: PostgreSQL via the server Prisma client
- Data source: synthetic benchmark rows seeded by the benchmark script
- Test target: paginated list queries for courses, students, and assignments
- Benchmark scale: 10,000 synthetic rows per entity
- Page size: 25 records
- Pages sampled: 1, 100, and 250
- Repeats per page: 3
- Raw data output: `docs/asr-perf-02-results.csv`

*Measurement Approach:*
1. Load the server environment from `server/.env` when present.
2. Seed 10,000 benchmark rows for courses, students, and assignments when they are not already present.
3. Connect to the database with Prisma.
4. Warm up each query shape with a row count check.
5. Run paginated `findMany` queries plus matching `count` queries.
6. Record latency in milliseconds for each sample.
7. Write every sample to the CSV file for traceability.

== Benchmark Results

Run the benchmark script to regenerate the raw results:

```
node benchmark-asr-perf-02.js
```

*Observed summary from the latest run:*
- Samples recorded: 27
- Average response time: 15.40 ms
- Maximum response time: 27.33 ms
- Threshold comparison: all samples were far below the 2-second target

#let data = csv("asr-perf-02-results.csv")

#table(
  columns: 9,
  [*Entity*],
  [*Scenario*],
  [*Page*],
  [*Page Size*],
  [*Total Rows*],
  [*Returned Rows*],
  [*Duration (ms)*],
  [*Benchmark At*],
  [*Note*],
  ..data.flatten(),
)

== Acceptance Criteria

*Requirement:* Response time < 2 seconds for list queries against 10,000 records

*Validation Target:*
- Pagination is applied to large list endpoints.
- Queries use database indexes on the accessed filter and join fields.
- Each sampled request remains below the 2-second target.

== Conclusion

This benchmark documents the paginated list-query performance path using raw CSV samples emitted by the benchmark script. The generated dataset reaches the 10,000-record target for each benchmarked entity, and the measured times remain well under the 2-second requirement. The report is reproducible by rerunning:

```
node benchmark-asr-perf-02.js
```

#!/usr/bin/env node

/**
 * ASR-PERF-02 Benchmark Script
 *
 * Benchmarks paginated list queries against the database and writes raw
 * timing samples to docs/asr-perf-02-results.csv.
 *
 * Usage:
 *   node benchmark-asr-perf-02.js
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

const dotenvPath = path.join(__dirname, 'server', 'node_modules', 'dotenv');
const prismaClientPath = path.join(__dirname, 'server', 'node_modules', '@prisma', 'client');
const serverEnvPath = path.join(__dirname, 'server', '.env');

if (fs.existsSync(serverEnvPath)) {
  require(dotenvPath).config({ path: serverEnvPath });
}

const { PrismaClient } = require(prismaClientPath);

const prisma = new PrismaClient();
const outputPath = path.join(__dirname, 'docs', 'asr-perf-02-results.csv');

const BENCHMARK_COURSE_COUNT = 10000;
const BENCHMARK_USER_COUNT = 10000;
const BENCHMARK_ASSIGNMENT_COUNT = 10000;
const BATCH_SIZE = 1000;
const PAGE_SIZE = 25;
const PAGES = [1, 100, 250];
const REPEATS = 3;
const COURSE_MARKER = 'ASR-PERF-02 Benchmark Course 00001';
const USER_MARKER_EMAIL = 'asr-perf-02-student-00001@example.com';
const ASSIGNMENT_MARKER = 'ASR-PERF-02 Benchmark Assignment 00001';

function csvEscape(value) {
  const text = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsvRow(row) {
  return [
    row.entity,
    row.scenario,
    row.page,
    row.pageSize,
    row.totalRows,
    row.returnedRows,
    row.durationMs,
    row.benchmarkAt,
    row.note,
  ].map(csvEscape).join(',');
}

function buildBatches(totalCount, factory) {
  const batches = [];

  for (let start = 0; start < totalCount; start += BATCH_SIZE) {
    const batch = [];

    for (let index = start; index < Math.min(start + BATCH_SIZE, totalCount); index += 1) {
      batch.push(factory(index));
    }

    batches.push(batch);
  }

  return batches;
}

async function seedBenchmarkData() {
  const existingCourse = await prisma.course.findFirst({
    where: { title: COURSE_MARKER },
    select: { id: true },
  });

  if (!existingCourse) {
    for (const batch of buildBatches(BENCHMARK_COURSE_COUNT, (index) => ({
      title: `ASR-PERF-02 Benchmark Course ${String(index + 1).padStart(5, '0')}`,
      description: `Benchmark course record ${index + 1}`,
    }))) {
      await prisma.course.createMany({ data: batch });
    }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: USER_MARKER_EMAIL },
    select: { id: true },
  });

  if (!existingUser) {
    for (const batch of buildBatches(BENCHMARK_USER_COUNT, (index) => ({
      name: `ASR-PERF-02 Student ${String(index + 1).padStart(5, '0')}`,
      email: `asr-perf-02-student-${String(index + 1).padStart(5, '0')}@example.com`,
      password: 'benchmark-password-hash',
      role: 'STUDENT',
    }))) {
      await prisma.user.createMany({ data: batch, skipDuplicates: true });
    }
  }

  const existingAssignment = await prisma.assignment.findFirst({
    where: { title: ASSIGNMENT_MARKER },
    select: { id: true },
  });

  if (!existingAssignment) {
    const benchmarkClass = await prisma.class.findFirst({
      orderBy: { createdAt: 'asc' },
      select: { id: true, teacherId: true },
    });

    if (!benchmarkClass || !benchmarkClass.teacherId) {
      throw new Error('Seed data must contain at least one class with a teacher before running ASR-PERF-02');
    }

    for (const batch of buildBatches(BENCHMARK_ASSIGNMENT_COUNT, (index) => ({
      title: `ASR-PERF-02 Benchmark Assignment ${String(index + 1).padStart(5, '0')}`,
      description: `Benchmark assignment record ${index + 1}`,
      classId: benchmarkClass.id,
      createdBy: benchmarkClass.teacherId,
      dueDate: new Date(Date.now() + index * 86400000),
      maxScore: 100,
    }))) {
      await prisma.assignment.createMany({ data: batch });
    }
  }
}

async function benchmarkCase(entity, scenario, buildQuery, note) {
  const rows = [];
  const totalRows = await buildQuery.count();

  for (const page of PAGES) {
    const skip = (page - 1) * PAGE_SIZE;

    for (let repeat = 1; repeat <= REPEATS; repeat += 1) {
      const started = performance.now();

      const [pageRows] = await Promise.all([
        buildQuery.list({ skip, take: PAGE_SIZE }),
        buildQuery.count(),
      ]);

      const durationMs = performance.now() - started;

      rows.push({
        entity,
        scenario,
        page,
        pageSize: PAGE_SIZE,
        totalRows,
        returnedRows: pageRows.length,
        durationMs: durationMs.toFixed(2),
        benchmarkAt: new Date().toISOString(),
        note: `${note}; repeat ${repeat}`,
      });
    }
  }

  return rows;
}

async function main() {
  await seedBenchmarkData();

  const cases = [
    {
      entity: 'courses',
      scenario: 'Paginated course list with classes include',
      note: 'findMany + count on 10k synthetic courses, ordered by id asc',
      buildQuery: {
        count: () => prisma.course.count({
          where: { title: { startsWith: 'ASR-PERF-02 Benchmark Course ' } },
        }),
        list: ({ skip, take }) => prisma.course.findMany({
          where: { title: { startsWith: 'ASR-PERF-02 Benchmark Course ' } },
          skip,
          take,
          orderBy: { id: 'asc' },
          include: { classes: true },
        }),
      },
    },
    {
      entity: 'students',
      scenario: 'Paginated student list with role filter',
      note: 'findMany + count on 10k synthetic students, select user fields only',
      buildQuery: {
        count: () => prisma.user.count({
          where: { email: { startsWith: 'asr-perf-02-student-' }, role: 'STUDENT' },
        }),
        list: ({ skip, take }) => prisma.user.findMany({
          where: { email: { startsWith: 'asr-perf-02-student-' }, role: 'STUDENT' },
          skip,
          take,
          orderBy: { id: 'asc' },
          select: { id: true, name: true, email: true, role: true },
        }),
      },
    },
    {
      entity: 'assignments',
      scenario: 'Paginated assignment list ordered by id',
      note: 'findMany + count on 10k synthetic assignments, include class/course/submissions',
      buildQuery: {
        count: () => prisma.assignment.count({
          where: { title: { startsWith: 'ASR-PERF-02 Benchmark Assignment ' } },
        }),
        list: ({ skip, take }) => prisma.assignment.findMany({
          where: { title: { startsWith: 'ASR-PERF-02 Benchmark Assignment ' } },
          skip,
          take,
          orderBy: { id: 'asc' },
          include: {
            class: {
              include: { course: true },
            },
            submissions: true,
          },
        }),
      },
    },
  ];

  const allRows = [];

  for (const benchmarkCaseConfig of cases) {
    const caseRows = await benchmarkCase(
      benchmarkCaseConfig.entity,
      benchmarkCaseConfig.scenario,
      benchmarkCaseConfig.buildQuery,
      benchmarkCaseConfig.note,
    );

    allRows.push(...caseRows);
  }

  const header = [
    'entity',
    'scenario',
    'page',
    'page_size',
    'total_rows',
    'returned_rows',
    'duration_ms',
    'benchmark_at',
    'note',
  ].join(',');

  const csvContent = [header, ...allRows.map(toCsvRow), ''].join('\n');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, csvContent, 'utf8');

  const durations = allRows.map((row) => Number(row.durationMs));
  const maxDuration = Math.max(...durations);
  const averageDuration = durations.reduce((sum, value) => sum + value, 0) / durations.length;

  console.log(JSON.stringify({
    outputPath,
    samples: allRows.length,
    pageSize: PAGE_SIZE,
    pages: PAGES,
    repeats: REPEATS,
    averageDurationMs: Number.isFinite(averageDuration) ? averageDuration.toFixed(2) : '0.00',
    maxDurationMs: Number.isFinite(maxDuration) ? maxDuration.toFixed(2) : '0.00',
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

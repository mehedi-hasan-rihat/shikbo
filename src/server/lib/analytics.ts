import "server-only";
import { db } from "@/lib/db";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type OverviewMetrics = {
  totalAssignments: number;
  totalSubmissions: number;
  acceptanceRate: number;       // 0–100
  needsImprovementRate: number; // 0–100
  pendingRate: number;          // 0–100
  avgReviewTimeHours: number | null;
};

export type StatusDistribution = {
  accepted: number;
  pending: number;
  needs_improvement: number;
  total: number;
};

export type AssignmentDifficultyRow = {
  assignmentId: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  totalSubmissions: number;
  needsImprovementCount: number;
  acceptedCount: number;
  pendingCount: number;
  acceptanceRate: number; // 0–100, based on latest submission per student
  uniqueStudents: number;
};

export type AtRiskStudent = {
  studentId: string;
  name: string;
  email: string;
  needsImprovementCount: number; // count of latest submissions with needs_improvement
  totalSubmissions: number;
  lastSubmittedAt: Date;
};

// ---------------------------------------------------------------------------
// Overview metrics (SHK-036)
// ---------------------------------------------------------------------------

export async function getOverviewMetrics(
  instructorId: string
): Promise<OverviewMetrics> {
  const [assignmentCount, submissions] = await Promise.all([
    db.assignment.count({
      where: { createdBy: instructorId, archivedAt: null },
    }),
    db.submission.findMany({
      where: { assignment: { createdBy: instructorId } },
      select: {
        studentId: true,
        assignmentId: true,
        status: true,
        submittedAt: true,
        reviewedAt: true,
      },
      orderBy: { submittedAt: "desc" },
    }),
  ]);

  // Deduplicate to latest submission per student per assignment
  const latestByKey = new Map<string, typeof submissions[number]>();
  for (const sub of submissions) {
    const key = `${sub.studentId}:${sub.assignmentId}`;
    if (!latestByKey.has(key)) {
      latestByKey.set(key, sub);
    }
  }
  const latest = [...latestByKey.values()];

  const total = latest.length;

  if (total === 0) {
    return {
      totalAssignments: assignmentCount,
      totalSubmissions: 0,
      acceptanceRate: 0,
      needsImprovementRate: 0,
      pendingRate: 0,
      avgReviewTimeHours: null,
    };
  }

  const accepted = latest.filter((s) => s.status === "accepted").length;
  const needsImprovement = latest.filter(
    (s) => s.status === "needs_improvement"
  ).length;
  const pending = latest.filter((s) => s.status === "pending").length;

  // Average review time — across all reviewed submissions (not just latest)
  type SubRow = typeof submissions[number];
  const reviewed = submissions.filter((s: SubRow) => s.reviewedAt !== null);
  let avgReviewTimeHours: number | null = null;
  if (reviewed.length > 0) {
    const totalMs = reviewed.reduce((sum: number, s: SubRow) => {
      return sum + (s.reviewedAt!.getTime() - s.submittedAt.getTime());
    }, 0);
    avgReviewTimeHours = totalMs / reviewed.length / (1000 * 60 * 60);
  }

  return {
    totalAssignments: assignmentCount,
    totalSubmissions: total,
    acceptanceRate: Math.round((accepted / total) * 100),
    needsImprovementRate: Math.round((needsImprovement / total) * 100),
    pendingRate: Math.round((pending / total) * 100),
    avgReviewTimeHours,
  };
}

// ---------------------------------------------------------------------------
// Status distribution (SHK-037)
// ---------------------------------------------------------------------------

export async function getStatusDistribution(
  instructorId: string
): Promise<StatusDistribution> {
  const submissions = await db.submission.findMany({
    where: { assignment: { createdBy: instructorId } },
    select: {
      studentId: true,
      assignmentId: true,
      status: true,
      submittedAt: true,
    },
    orderBy: { submittedAt: "desc" },
  });

  // Deduplicate to latest submission per student per assignment
  const latestByKey = new Map<string, typeof submissions[number]>();
  for (const sub of submissions) {
    const key = `${sub.studentId}:${sub.assignmentId}`;
    if (!latestByKey.has(key)) {
      latestByKey.set(key, sub);
    }
  }
  const latest = [...latestByKey.values()];

  let accepted = 0, pending = 0, needs_improvement = 0;
  for (const sub of latest) {
    if (sub.status === "accepted") accepted++;
    else if (sub.status === "pending") pending++;
    else if (sub.status === "needs_improvement") needs_improvement++;
  }

  return {
    accepted,
    pending,
    needs_improvement,
    total: accepted + pending + needs_improvement,
  };
}

// ---------------------------------------------------------------------------
// Per-assignment analysis (SHK-038 + SHK-039)
// ---------------------------------------------------------------------------

export async function getAssignmentAnalysis(
  instructorId: string
): Promise<AssignmentDifficultyRow[]> {
  const assignments = await db.assignment.findMany({
    where: { createdBy: instructorId, archivedAt: null },
    select: {
      id: true,
      title: true,
      difficulty: true,
      submissions: {
        select: {
          id: true,
          studentId: true,
          status: true,
          submittedAt: true,
        },
        orderBy: { submittedAt: "desc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return assignments.map((a: typeof assignments[number]) => {
    const allSubs = a.submissions;

    // Latest submission per student determines their "current" status
    const latestByStudent = new Map<string, (typeof allSubs)[number]>();
    for (const sub of allSubs) {
      if (!latestByStudent.has(sub.studentId)) {
        latestByStudent.set(sub.studentId, sub);
      }
    }
    const latestSubs = [...latestByStudent.values()];

    const uniqueStudents = latestSubs.length;
    const acceptedCount = latestSubs.filter((s) => s.status === "accepted").length;
    const needsImprovementCount = latestSubs.filter(
      (s) => s.status === "needs_improvement"
    ).length;
    const pendingCount = latestSubs.filter((s) => s.status === "pending").length;

    return {
      assignmentId: a.id,
      title: a.title,
      difficulty: a.difficulty,
      totalSubmissions: allSubs.length,
      uniqueStudents,
      acceptedCount,
      needsImprovementCount,
      pendingCount,
      acceptanceRate:
        uniqueStudents > 0
          ? Math.round((acceptedCount / uniqueStudents) * 100)
          : 0,
    };
  });
}

// ---------------------------------------------------------------------------
// Action items for instructor dashboard (SHK-045)
// ---------------------------------------------------------------------------

export type ActionItems = {
  pendingReviewCount: number;
  atRiskStudentCount: number;     // students with ≥2 needs_improvement (latest per assignment)
  lowAcceptanceAssignments: {     // acceptance rate < 50%, ≥3 students submitted
    assignmentId: string;
    title: string;
    acceptanceRate: number;
  }[];
  deadlinesThisWeek: {            // active assignments with deadline in next 7 days
    assignmentId: string;
    title: string;
    deadline: Date;
    pendingCount: number;         // students with pending submissions for this assignment
  }[];
};

export async function getActionItems(instructorId: string): Promise<ActionItems> {
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [pendingCount, assignments, atRisk] = await Promise.all([
    // Count all unreviewed submissions across instructor's assignments
    db.submission.count({
      where: {
        assignment: { createdBy: instructorId },
        status: "pending",
      },
    }),
    // All active assignments with their submissions for analysis
    db.assignment.findMany({
      where: { createdBy: instructorId, archivedAt: null },
      select: {
        id: true,
        title: true,
        deadline: true,
        submissions: {
          select: { studentId: true, status: true, submittedAt: true },
          orderBy: { submittedAt: "desc" },
        },
      },
    }),
    getAtRiskStudents(instructorId),
  ]);

  const lowAcceptanceAssignments: ActionItems["lowAcceptanceAssignments"] = [];
  const deadlinesThisWeek: ActionItems["deadlinesThisWeek"] = [];

  for (const a of assignments) {
    // Latest submission per student
    const latestByStudent = new Map<string, { status: string }>();
    for (const sub of a.submissions) {
      if (!latestByStudent.has(sub.studentId)) {
        latestByStudent.set(sub.studentId, { status: sub.status });
      }
    }
    const latest = [...latestByStudent.values()];
    const uniqueStudents = latest.length;

    // Low acceptance: < 50% rate AND at least 3 students have submitted
    if (uniqueStudents >= 3) {
      const accepted = latest.filter((s) => s.status === "accepted").length;
      const rate = Math.round((accepted / uniqueStudents) * 100);
      if (rate < 50) {
        lowAcceptanceAssignments.push({
          assignmentId: a.id,
          title: a.title,
          acceptanceRate: rate,
        });
      }
    }

    // Deadlines this week (only future deadlines)
    if (a.deadline > now && a.deadline <= weekFromNow) {
      const pendingForThis = latest.filter(
        (s) => s.status === "pending"
      ).length;
      deadlinesThisWeek.push({
        assignmentId: a.id,
        title: a.title,
        deadline: a.deadline,
        pendingCount: pendingForThis,
      });
    }
  }

  // Sort low acceptance by worst rate first
  lowAcceptanceAssignments.sort((a, b) => a.acceptanceRate - b.acceptanceRate);

  // Sort deadlines by soonest first
  deadlinesThisWeek.sort(
    (a, b) => a.deadline.getTime() - b.deadline.getTime()
  );

  return {
    pendingReviewCount: pendingCount,
    atRiskStudentCount: atRisk.length,
    lowAcceptanceAssignments,
    deadlinesThisWeek,
  };
}

// ---------------------------------------------------------------------------
// Student overview metrics (SHK-041)
// ---------------------------------------------------------------------------

export type StudentOverviewMetrics = {
  totalActiveAssignments: number; // all non-archived assignments
  submitted: number;              // assignments the student has submitted at least once
  accepted: number;               // latest submission is accepted
  needsImprovement: number;       // latest submission is needs_improvement
  pending: number;                // latest submission is pending
  notStarted: number;             // no submission at all
};

export async function getStudentOverviewMetrics(
  studentId: string
): Promise<StudentOverviewMetrics> {
  const [totalActiveAssignments, submissions] = await Promise.all([
    db.assignment.count({ where: { archivedAt: null } }),
    db.submission.findMany({
      where: { studentId },
      select: { assignmentId: true, status: true, submittedAt: true },
      orderBy: { submittedAt: "desc" },
    }),
  ]);

  // Latest submission per assignment
  const latestByAssignment = new Map<string, { status: string }>();
  for (const sub of submissions) {
    if (!latestByAssignment.has(sub.assignmentId)) {
      latestByAssignment.set(sub.assignmentId, { status: sub.status });
    }
  }

  const latest = [...latestByAssignment.values()];
  const submitted = latest.length;
  const accepted = latest.filter((s) => s.status === "accepted").length;
  const needsImprovement = latest.filter(
    (s) => s.status === "needs_improvement"
  ).length;
  const pending = latest.filter((s) => s.status === "pending").length;

  return {
    totalActiveAssignments,
    submitted,
    accepted,
    needsImprovement,
    pending,
    notStarted: Math.max(0, totalActiveAssignments - submitted),
  };
}

// ---------------------------------------------------------------------------
// Student progress distribution (SHK-042)
// ---------------------------------------------------------------------------

export type StudentProgressDistribution = {
  accepted: number;        // "completed"
  needs_improvement: number;
  pending: number;         // "in progress / awaiting review"
  not_started: number;
  total: number;           // totalActiveAssignments
};

export async function getStudentProgressDistribution(
  studentId: string
): Promise<StudentProgressDistribution> {
  const metrics = await getStudentOverviewMetrics(studentId);
  return {
    accepted: metrics.accepted,
    needs_improvement: metrics.needsImprovement,
    pending: metrics.pending,
    not_started: metrics.notStarted,
    total: metrics.totalActiveAssignments,
  };
}

// ---------------------------------------------------------------------------
// Recent feedback (SHK-042)
// ---------------------------------------------------------------------------

export type RecentFeedbackItem = {
  submissionId: string;
  assignmentId: string;
  assignmentTitle: string;
  status: "accepted" | "needs_improvement" | "pending";
  feedback: string;
  reviewedAt: Date;
};

export async function getStudentRecentFeedback(
  studentId: string,
  limit = 3
): Promise<RecentFeedbackItem[]> {
  const submissions = await db.submission.findMany({
    where: {
      studentId,
      feedback: { not: null },
      reviewedAt: { not: null },
    },
    orderBy: { reviewedAt: "desc" },
    take: limit,
    select: {
      id: true,
      assignmentId: true,
      status: true,
      feedback: true,
      reviewedAt: true,
      assignment: { select: { title: true } },
    },
  });

  return submissions.map((s: typeof submissions[number]) => ({
    submissionId: s.id,
    assignmentId: s.assignmentId,
    assignmentTitle: s.assignment.title,
    status: s.status,
    feedback: s.feedback!,
    reviewedAt: s.reviewedAt!,
  }));
}

// ---------------------------------------------------------------------------
// Upcoming deadlines (SHK-043)
// ---------------------------------------------------------------------------

export type UpcomingAssignment = {
  assignmentId: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  deadline: Date;
  isPast: boolean;
  submissionStatus: "accepted" | "needs_improvement" | "pending" | null;
  attemptCount: number;
};

export async function getStudentUpcomingAssignments(
  studentId: string
): Promise<UpcomingAssignment[]> {
  const assignments = await db.assignment.findMany({
    where: { archivedAt: null },
    orderBy: { deadline: "asc" },
    select: {
      id: true,
      title: true,
      difficulty: true,
      deadline: true,
      submissions: {
        where: { studentId },
        select: { status: true, submittedAt: true },
        orderBy: { submittedAt: "desc" },
      },
    },
  });

  const now = new Date();

  return assignments.map((a: typeof assignments[number]) => {
    const latestSub = a.submissions[0] ?? null;
    return {
      assignmentId: a.id,
      title: a.title,
      difficulty: a.difficulty,
      deadline: a.deadline,
      isPast: a.deadline < now,
      submissionStatus: latestSub ? latestSub.status : null,
      attemptCount: a.submissions.length,
    };
  });
}

// ---------------------------------------------------------------------------
// At-risk students: repeated needs_improvement on latest submissions (SHK-040)
// ---------------------------------------------------------------------------

export async function getAtRiskStudents(
  instructorId: string
): Promise<AtRiskStudent[]> {
  // Fetch all submissions for this instructor's assignments
  const submissions = await db.submission.findMany({
    where: { assignment: { createdBy: instructorId } },
    select: {
      id: true,
      studentId: true,
      assignmentId: true,
      status: true,
      submittedAt: true,
      student: { select: { id: true, name: true, email: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  // Group by student
  const byStudent = new Map<
    string,
    { student: { id: string; name: string; email: string }; subs: typeof submissions }
  >();

  for (const sub of submissions) {
    const existing = byStudent.get(sub.studentId);
    if (!existing) {
      byStudent.set(sub.studentId, { student: sub.student, subs: [sub] });
    } else {
      existing.subs.push(sub);
    }
  }

  const result: AtRiskStudent[] = [];

  for (const { student, subs } of byStudent.values()) {
    // Latest submission per assignment
    const latestByAssignment = new Map<string, (typeof subs)[number]>();
    for (const sub of subs) {
      if (!latestByAssignment.has(sub.assignmentId)) {
        latestByAssignment.set(sub.assignmentId, sub);
      }
    }

    const latestSubs = [...latestByAssignment.values()];
    const needsImprovementCount = latestSubs.filter(
      (s: typeof latestSubs[number]) => s.status === "needs_improvement"
    ).length;

    // Only include students who currently have at least 2 assignments at needs_improvement
    if (needsImprovementCount >= 2) {
      result.push({
        studentId: student.id,
        name: student.name,
        email: student.email,
        needsImprovementCount,
        totalSubmissions: subs.length,
        lastSubmittedAt: subs[0]!.submittedAt, // subs are desc-ordered
      });
    }
  }

  // Sort by most at-risk first
  result.sort((a, b) => b.needsImprovementCount - a.needsImprovementCount);

  return result;
}

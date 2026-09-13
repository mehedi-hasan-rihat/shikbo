// ---------------------------------------------------------------------------
// AI feature shared types
// ---------------------------------------------------------------------------

// --- Assignment Improvement ---

export type AssignmentImproveInput = {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
};

export type AssignmentImproveResult = {
  improvedTitle: string;
  improvedDescription: string;
  missingRequirements: string[];
  evaluationCriteria: string[];
};

// --- Feedback Assistant ---

export type FeedbackGenerateInput = {
  assignmentTitle: string;
  assignmentDescription: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  studentNote: string | null;
  instructorObservations: string;
  submissionStatus: "pending" | "accepted" | "needs_improvement";
};

export type FeedbackGenerateResult = {
  feedback: string;
  improvementSuggestions: string[];
};

// --- Shared AI error ---

export type AiError =
  | { code: "missing_api_key" }
  | { code: "no_credits" }
  | { code: "rate_limit" }
  | { code: "timeout" }
  | { code: "invalid_response" }
  | { code: "api_error"; message: string };

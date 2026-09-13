import "server-only";

// ---------------------------------------------------------------------------
// AI Debug Logger
//
// Logs AI request/response details to the server console.
// Active when:  NODE_ENV === "development"  OR  AI_DEBUG=true
//
// Never logs API keys or full prompt text in production.
// ---------------------------------------------------------------------------

const isDev = process.env.NODE_ENV === "development";
const forceDebug = process.env.AI_DEBUG === "true";
const enabled = isDev || forceDebug;

// ANSI colour helpers (work in Node terminal, ignored in plain log files)
const c = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  dim:    "\x1b[2m",
  cyan:   "\x1b[36m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  red:    "\x1b[31m",
  gray:   "\x1b[90m",
};

function tag(label: string, colour: string) {
  return `${colour}${c.bold}[AI:${label}]${c.reset}`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type AiLogContext = {
  /** Which feature produced this log entry */
  feature: "assignment-improve" | "feedback-generate";
  /** Model name used */
  model: string;
};

export type AiRequestLog = AiLogContext & {
  /** Truncated/summarised input — never the full text in production */
  inputSummary: Record<string, string>;
};

export type AiResponseLog = AiLogContext & {
  /** Duration in ms */
  durationMs: number;
  /** Token usage if available */
  usage?: { promptTokens?: number; completionTokens?: number; totalTokens?: number };
  /** Truncated preview of the structured output */
  outputPreview: Record<string, unknown>;
};

export type AiErrorLog = AiLogContext & {
  durationMs: number;
  errorCode: string;
  errorMessage?: string;
};

/** Log before the AI call is made */
export function logAiRequest(ctx: AiRequestLog): void {
  if (!enabled) return;

  console.log(
    `\n${tag("REQ", c.cyan)} ${c.bold}${ctx.feature}${c.reset} ${c.gray}model=${ctx.model}${c.reset}`
  );
  for (const [key, val] of Object.entries(ctx.inputSummary)) {
    console.log(`  ${c.dim}${key}:${c.reset} ${val}`);
  }
}

/** Log after a successful AI response */
export function logAiResponse(ctx: AiResponseLog): void {
  if (!enabled) return;

  const { durationMs, usage, outputPreview } = ctx;
  const tokens = usage
    ? `${c.gray}tokens: ${usage.promptTokens ?? "?"}→${usage.completionTokens ?? "?"}  total=${usage.totalTokens ?? "?"}${c.reset}`
    : "";

  console.log(
    `${tag("OK", c.green)} ${c.bold}${ctx.feature}${c.reset}  ${c.yellow}${durationMs}ms${c.reset}  ${tokens}`
  );

  for (const [key, val] of Object.entries(outputPreview)) {
    const preview = formatPreview(val);
    console.log(`  ${c.dim}${key}:${c.reset} ${preview}`);
  }
  console.log();
}

/** Log when the AI call fails */
export function logAiError(ctx: AiErrorLog): void {
  if (!enabled) return;

  console.log(
    `${tag("ERR", c.red)} ${c.bold}${ctx.feature}${c.reset}  ${c.yellow}${ctx.durationMs}ms${c.reset}  code=${c.red}${ctx.errorCode}${c.reset}${ctx.errorMessage ? `  msg=${ctx.errorMessage}` : ""}`
  );
  console.log();
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Truncate a value to a readable one-liner for log output */
function formatPreview(val: unknown): string {
  if (typeof val === "string") {
    const trimmed = val.replace(/\s+/g, " ").trim();
    return trimmed.length > 120 ? `"${trimmed.slice(0, 120)}…"` : `"${trimmed}"`;
  }
  if (Array.isArray(val)) {
    return `[${val.length} items] ${JSON.stringify(val.slice(0, 2)).slice(0, 100)}${val.length > 2 ? "…" : ""}`;
  }
  return JSON.stringify(val);
}

/** Summarise an input string for the request log (truncated, no secrets) */
export function summarise(text: string | null | undefined, maxLen = 80): string {
  if (!text) return "(empty)";
  const trimmed = text.replace(/\s+/g, " ").trim();
  return trimmed.length > maxLen ? `${trimmed.slice(0, maxLen)}…` : trimmed;
}

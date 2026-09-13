import "server-only";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// ---------------------------------------------------------------------------
// AI provider client — OpenRouter
// Uses the official @openrouter/ai-sdk-provider package.
// https://openrouter.ai/docs/guides/community/vercel-ai-sdk
// ---------------------------------------------------------------------------

let _client: ReturnType<typeof createOpenRouter> | null = null;

/**
 * Returns the OpenRouter provider instance.
 * Throws if OPENROUTER_API_KEY is not set — callers surface a `missing_api_key` error.
 */
export function getAiClient() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("missing_api_key");
  }
  if (!_client) {
    _client = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });
  }
  return _client;
}

/**
 * Free model via OpenRouter — no credits required.
 * https://openrouter.ai/models?q=free
 */
export const AI_MODEL = "dots-studio/dots-3-note-preview:free";

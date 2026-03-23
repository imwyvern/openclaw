/**
 * In lightweight cron mode the bootstrap files are already empty; extend
 * the same principle to the skills prompt so that simple cron scripts only
 * pay for the tools and system prompt they actually need.
 *
 * Heartbeat runs are excluded because heartbeat prompts commonly instruct
 * the agent to check skills or perform tasks that require skill awareness.
 *
 * @see https://github.com/openclaw/openclaw/issues/7957
 */
export function shouldSkipSkillsPrompt(params: {
  contextMode?: "full" | "lightweight";
  runKind?: "default" | "heartbeat" | "cron";
}): boolean {
  return params.contextMode === "lightweight" && params.runKind === "cron";
}

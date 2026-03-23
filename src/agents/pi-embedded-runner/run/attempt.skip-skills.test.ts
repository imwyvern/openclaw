import { describe, expect, it } from "vitest";
import { shouldSkipSkillsPrompt } from "./skip-skills.js";

describe("shouldSkipSkillsPrompt", () => {
  it("returns true for lightweight cron mode", () => {
    expect(shouldSkipSkillsPrompt({ contextMode: "lightweight", runKind: "cron" })).toBe(true);
  });

  it("returns false for full cron mode", () => {
    expect(shouldSkipSkillsPrompt({ contextMode: "full", runKind: "cron" })).toBe(false);
  });

  it("returns false for lightweight heartbeat mode (heartbeat may need skills)", () => {
    expect(shouldSkipSkillsPrompt({ contextMode: "lightweight", runKind: "heartbeat" })).toBe(
      false,
    );
  });

  it("returns false for lightweight default mode", () => {
    expect(shouldSkipSkillsPrompt({ contextMode: "lightweight", runKind: "default" })).toBe(false);
  });

  it("returns false when contextMode is undefined", () => {
    expect(shouldSkipSkillsPrompt({ runKind: "cron" })).toBe(false);
  });

  it("returns false when runKind is undefined", () => {
    expect(shouldSkipSkillsPrompt({ contextMode: "lightweight" })).toBe(false);
  });

  it("returns false when both are undefined", () => {
    expect(shouldSkipSkillsPrompt({})).toBe(false);
  });
});

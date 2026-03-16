import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_HANDSHAKE_TIMEOUT_MS, getHandshakeTimeoutMs } from "./server-constants.js";

const ORIGINAL_ENV = {
  VITEST: process.env.VITEST,
  OPENCLAW_HANDSHAKE_TIMEOUT_MS: process.env.OPENCLAW_HANDSHAKE_TIMEOUT_MS,
  OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS: process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS,
};

afterEach(() => {
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

describe("getHandshakeTimeoutMs", () => {
  it("defaults to 10 seconds when no overrides are set", () => {
    delete process.env.OPENCLAW_HANDSHAKE_TIMEOUT_MS;
    delete process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS;

    expect(DEFAULT_HANDSHAKE_TIMEOUT_MS).toBe(10_000);
    expect(getHandshakeTimeoutMs()).toBe(10_000);
  });

  it("honors the production handshake timeout override", () => {
    delete process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS;
    process.env.OPENCLAW_HANDSHAKE_TIMEOUT_MS = "15000";

    expect(getHandshakeTimeoutMs()).toBe(15_000);
  });

  it("falls back to the default when the production override is non-numeric", () => {
    delete process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS;
    process.env.OPENCLAW_HANDSHAKE_TIMEOUT_MS = "not-a-number";

    expect(getHandshakeTimeoutMs()).toBe(DEFAULT_HANDSHAKE_TIMEOUT_MS);
  });

  it("falls back to the default when the production override exceeds Node's timer limit", () => {
    delete process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS;
    process.env.OPENCLAW_HANDSHAKE_TIMEOUT_MS = "2147483648";

    expect(getHandshakeTimeoutMs()).toBe(DEFAULT_HANDSHAKE_TIMEOUT_MS);
  });

  it("prefers the production override when both overrides are set", () => {
    process.env.VITEST = "1";
    process.env.OPENCLAW_HANDSHAKE_TIMEOUT_MS = "15000";
    process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS = "25";

    expect(getHandshakeTimeoutMs()).toBe(15_000);
  });

  it("falls back to the vitest override when the production override is empty", () => {
    process.env.VITEST = "1";
    process.env.OPENCLAW_HANDSHAKE_TIMEOUT_MS = "";
    process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS = "25";

    expect(getHandshakeTimeoutMs()).toBe(25);
  });

  it("falls back to the default when the vitest override is non-numeric", () => {
    process.env.VITEST = "1";
    delete process.env.OPENCLAW_HANDSHAKE_TIMEOUT_MS;
    process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS = "NaN-ish";

    expect(getHandshakeTimeoutMs()).toBe(DEFAULT_HANDSHAKE_TIMEOUT_MS);
  });

  it("falls back to the default when the vitest override exceeds Node's timer limit", () => {
    process.env.VITEST = "1";
    delete process.env.OPENCLAW_HANDSHAKE_TIMEOUT_MS;
    process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS = "2147483648";

    expect(getHandshakeTimeoutMs()).toBe(DEFAULT_HANDSHAKE_TIMEOUT_MS);
  });
});

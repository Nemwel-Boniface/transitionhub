import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { createSessionToken, verifySessionToken } from "@/lib/auth";

describe("session tokens", () => {
  it("creates a token that verifies successfully", () => {
    const token = createSessionToken();
    const data = verifySessionToken(token);
    expect(data).not.toBeNull();
    expect(data?.role).toBe("admin");
  });

  it("rejects a tampered token", () => {
    const token = createSessionToken();
    const tampered = token.slice(0, -2) + "xx";
    expect(verifySessionToken(tampered)).toBeNull();
  });

  it("rejects garbage input", () => {
    expect(verifySessionToken("not-a-real-token")).toBeNull();
    expect(verifySessionToken(undefined)).toBeNull();
    expect(verifySessionToken(null)).toBeNull();
  });

  it("rejects an expired token", () => {
    // Build a token whose issuedAt is far in the past.
    const secret = process.env.SESSION_SECRET || "transitionhub-dev-secret-change-me";
    const payload = Buffer.from(
      JSON.stringify({ role: "admin", issuedAt: Date.now() - 999 * 60 * 60 * 1000 })
    ).toString("base64url");
    const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    const token = `${payload}.${signature}`;
    expect(verifySessionToken(token)).toBeNull();
  });
});

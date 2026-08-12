import crypto from "crypto";
import { NextRequest } from "next/server";

const COOKIE_NAME = "th_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function getSecret() {
  return process.env.SESSION_SECRET || "transitionhub-dev-secret-change-me";
}

function sign(payload: string) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export interface SessionData {
  role: "admin";
  issuedAt: number;
}

export function createSessionToken(): string {
  const data: SessionData = { role: "admin", issuedAt: Date.now() };
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): SessionData | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const data: SessionData = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (Date.now() - data.issuedAt > SESSION_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

export function isAdminRequest(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return verifySessionToken(token) !== null;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;

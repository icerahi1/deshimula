import { createHmac } from "crypto";
import { cookies } from "next/headers";
import { get } from "./db";

const SECRET = process.env.AUTH_SECRET || "deshimula-secret";
const COOKIE_NAME = "deshimula_session";

function signToken(value: string) {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

export function createSessionToken(userId: number, role: string) {
  const payload = `${userId}|${role}|${Date.now()}`;
  const signature = signToken(payload);
  return `${payload}|${signature}`;
}

export function verifySessionToken(token: string) {
  const parts = token.split("|");
  if (parts.length !== 4) return null;
  const [userId, role, timestamp, signature] = parts;
  const payload = `${userId}|${role}|${timestamp}`;
  if (signToken(payload) !== signature) return null;
  return { userId: Number(userId), role };
}

export async function getCurrentUser(): Promise<any | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME)?.value;
  if (!cookie) return null;
  const parsed = verifySessionToken(cookie);
  if (!parsed) return null;
  return get<any>("SELECT id, name, email, role FROM users WHERE id = ?", [
    parsed.userId,
  ]);
}

export async function setSessionCookie(value: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: "",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
  });
}

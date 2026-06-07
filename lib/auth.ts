import "server-only";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireEnv } from "@/lib/env";

const sessionCookieName = "love_admin_session";
const sessionMaxAge = 60 * 60 * 24 * 7;

function shouldUseSecureCookie() {
  if (process.env.AUTH_COOKIE_SECURE) {
    return process.env.AUTH_COOKIE_SECURE === "true";
  }

  return process.env.NODE_ENV === "production" && process.env.VERCEL === "1";
}

async function signSession(email: string, expiresAt: number) {
  const secret = requireEnv("SESSION_SECRET");
  const payload = `${email}.${expiresAt}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign"
  ]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));

  return Buffer.from(signature).toString("base64url");
}

async function createSessionToken(email: string) {
  const expiresAt = Date.now() + sessionMaxAge * 1000;
  const signature = await signSession(email, expiresAt);

  return `${email}.${expiresAt}.${signature}`;
}

async function verifySessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length < 3) {
    return null;
  }

  const signature = parts.pop();
  const expiresAtText = parts.pop();
  const email = parts.join(".");
  const expiresAt = Number(expiresAtText);

  if (!email || !signature || !Number.isFinite(expiresAt) || expiresAt < Date.now()) {
    return null;
  }

  const expected = await signSession(email, expiresAt);
  if (expected !== signature) {
    return null;
  }

  return email;
}

export async function ensureAdminSeeded() {
  const email = requireEnv("ADMIN_EMAIL").toLowerCase();
  const existing = await prisma.adminUser.findUnique({ where: { email } });

  if (existing) {
    return existing;
  }

  const password = requireEnv("ADMIN_INITIAL_PASSWORD");
  const passwordHash = await bcrypt.hash(password, 12);

  return prisma.adminUser.create({
    data: {
      email,
      passwordHash
    }
  });
}

export async function loginAdmin(email: string, password: string) {
  const allowedEmail = requireEnv("ADMIN_EMAIL").toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail !== allowedEmail) {
    return false;
  }

  const admin = await ensureAdminSeeded();
  const isValid = await bcrypt.compare(password, admin.passwordHash);

  if (!isValid) {
    return false;
  }

  const token = await createSessionToken(normalizedEmail);
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(),
    path: "/",
    maxAge: sessionMaxAge
  });

  return true;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function getCurrentAdminEmail() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(sessionCookieName)?.value);
}

export async function requireAdmin() {
  const email = await getCurrentAdminEmail();

  if (!email) {
    redirect("/login");
  }

  return email;
}

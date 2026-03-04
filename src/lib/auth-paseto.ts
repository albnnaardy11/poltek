import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Role } from "@/generated/client_v2";

// ── Key Setup ─────────────────────────────────────────────────────────────────
// jose needs a Uint8Array key of at least 256 bits (32 bytes) for HS256.
const SECRET_KEY = process.env.PASETO_SECRET_KEY || "dev_secret_key_must_be_32_chars_!!";
const encodedKey = new TextEncoder().encode(
  SECRET_KEY.padEnd(32, "_").slice(0, 32)
);

const SESSION_DURATION = 60 * 60 * 8; // 8 hours in seconds

if (!process.env.PASETO_SECRET_KEY && process.env.NODE_ENV === "production") {
  throw new Error("CRITICAL: PASETO_SECRET_KEY is not defined in production.");
}
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminPayload {
  userId: string;
  role: Role;
  email: string;
}

/**
 * Signs a JWT session token with HS256.
 * Replaces PASETO for maximum compatibility with Next.js App Router + Edge runtime.
 * jose is the industry standard and is actively maintained.
 */
export async function encryptPaseto(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(encodedKey);
}

/**
 * Verifies and decodes a JWT session token.
 * Returns null if expired, tampered, or malformed.
 */
export async function decryptPaseto(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return {
      userId: payload.userId as string,
      role: payload.role as Role,
      email: payload.email as string,
    };
  } catch (error) {
    console.error(
      "[SECURITY] JWT verification failed:",
      error instanceof Error ? error.message : "Invalid Token"
    );
    return null;
  }
}

/**
 * Reads and verifies the current session from the HTTP cookie.
 * Safe to call from any Server Component or Route Handler.
 */
export async function getSession(): Promise<AdminPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return null;
    return await decryptPaseto(token);
  } catch {
    return null;
  }
}

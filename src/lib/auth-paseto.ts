import { encrypt, decrypt } from "paseto-ts/v4";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

/**
 * STRICT REQUIREMENT: The secret key must be exactly 32 characters for AES-256-GCM (PASETO v4.local).
 * Failure to provide this in production will result in a system halt.
 */
const SECRET_KEY = process.env.PASETO_SECRET_KEY;

if (!SECRET_KEY && process.env.NODE_ENV === "production") {
  throw new Error("CRITICAL: PASETO_SECRET_KEY is not defined in production environment.");
}

// Development fallback with a clear warning.
const FINAL_KEY = (SECRET_KEY || "dev_secret_key_must_be_32_chars_!!").padEnd(32).slice(0, 32);

const encoder = new TextEncoder();
const encodedKey = encoder.encode(FINAL_KEY);

export interface AdminPayload {
  userId: string;
  role: Role;
  email: string;
  iat: string;
  exp: string;
}

/**
 * Encrypts a payload into a PASETO v4.local token.
 * Uses strict typing to ensure payload integrity.
 */
export async function encryptPaseto(payload: Omit<AdminPayload, "iat" | "exp">) {
  const now = Math.floor(Date.now() / 1000);
  return await encrypt(encodedKey, {
    ...payload,
    iat: now.toString(),
    exp: (now + 60 * 60 * 8).toString(), // 8 Hours
  });
}

/**
 * Decrypts and validates a PASETO token.
 * Returns null if the token is tampered with or expired.
 */
export async function decryptPaseto(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await decrypt(encodedKey, token);
    return payload as unknown as AdminPayload;
  } catch (error) {
    // Audit-ready logging: In a real system, this should trigger a security event.
    console.error("[SECURITY] PASETO Decryption failed:", error instanceof Error ? error.message : "Invalid Token");
    return null;
  }
}

/**
 * Helper to retrieve the current session in Server Components / Actions.
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

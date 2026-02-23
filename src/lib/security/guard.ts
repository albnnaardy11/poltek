import { createHmac, timingSafeEqual } from "crypto";
import { AdminPayload } from "../auth-paseto";
import { Role } from "@prisma/client";

const SECURITY_SECRET = process.env.SECURITY_SECRET || "military-grade-secret-fallback-32c";

/**
 * SIGNATURE ENGINE: Generates a HMAC-SHA256 signature for a request payload.
 * Prevents Replay Attacks & Payload Tampering.
 */
export function generateRequestSignature(payload: string, nonce: string, timestamp: number): string {
  const data = `${payload}:${nonce}:${timestamp}`;
  return createHmac("sha256", SECURITY_SECRET).update(data).digest("hex");
}

export function verifyRequestSignature(signature: string, payload: string, nonce: string, timestamp: number): boolean {
  const expected = generateRequestSignature(payload, nonce, timestamp);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  
  // Prevent Timing Attacks during comparison
  if (signatureBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(signatureBuffer, expectedBuffer);
}

/**
 * IDENTITY-AWARE RLS: Generates the Data Perimeter based on Admin Role & Scope.
 * This is used to inject automatic WHERE clauses into Prisma.
 */
export function getSecurityPerimeter(admin: AdminPayload) {
  if (admin.role === Role.SUPER_ADMIN) {
    return {}; // Unrestricted access
  }

  // Example Scoping Logic: NEWS_EDITOR can only see their own department's data
  // In a real system, you'd pull the scope from the admin's database record.
  return {
    OR: [
      { adminId: admin.userId },
      { department: (admin as any).department }
    ]
  };
}

/**
 * MFA STEP-UP TRIGGER: Logical condition for high-impact actions.
 */
export const CRITICAL_OPERATIONS = [
  "admin.DELETE",
  "program.DELETE",
  "settings.UPDATE_GLOBAL",
];

export function isActionCritical(entity: string, action: string): boolean {
  return CRITICAL_OPERATIONS.includes(`${entity.toLowerCase()}.${action.toUpperCase()}`);
}

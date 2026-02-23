import { getSession } from "./auth-paseto";
import { prisma } from "./prisma";

/**
 * Resolves the currently authenticated admin from the PASETO session token.
 * This is the SINGLE source of truth for admin identity. No fallback.
 * The Supabase auth surface has been eliminated to reduce attack vectors.
 */
export async function getCurrentAdmin() {
  const session = await getSession();
  if (!session) return null;

  // Always verify against DB to catch revoked/deleted admins.
  // The PASETO token is valid cryptographically, but the admin record might be gone.
  const admin = await prisma.admin.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    }
  });

  return admin;
}

/**
 * Role-Based Access Control guard for Server Actions.
 * Throws if the current session lacks the required role.
 * @throws {Error} Unauthorized
 */
export async function checkRole(allowedRoles: string[]) {
  const admin = await getCurrentAdmin();

  if (!admin || !allowedRoles.includes(admin.role)) {
    throw new Error(
      `UNAUTHORIZED: Required one of [${allowedRoles.join(", ")}], got ${admin?.role ?? "none"}`
    );
  }

  return admin;
}


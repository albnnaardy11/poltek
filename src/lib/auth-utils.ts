import { getSession } from "./auth-paseto";
import { prisma } from "./prisma";
import { Role } from "@prisma/client";

/**
 * Resolves the currently authenticated admin from the PASETO session token.
 * This is the SINGLE source of truth for admin identity. 
 * Performs a DB double-check to ensure the account hasn't been revoked.
 */
export async function getCurrentAdmin() {
  const session = await getSession();
  if (!session) return null;

  // Verify against DB to catch revoked/deleted admins or role changes.
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
 * Role-Based Access Control guard for Server Actions & Components.
 * Uses Prisma's Role enum to ensure type-safety at compile time.
 */
export async function checkRole(allowedRoles: Role[]) {
  const admin = await getCurrentAdmin();

  if (!admin || !allowedRoles.includes(admin.role)) {
    // In a production Web 4.0 app, this should be logged as a potential intrusion attempt.
    throw new Error(
      `UNAUTHORIZED: Required privileges [${allowedRoles.join(", ")}], but session has [${admin?.role ?? "NONE"}]`
    );
  }

  return admin;
}


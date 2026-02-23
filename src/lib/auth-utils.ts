import { getSession, AdminPayload } from "./auth-paseto";
import { prisma } from "./prisma";
import { Role } from "@prisma/client";
import { getRedis } from "./redis";
import { auditStorage } from "./audit-context";

/**
 * Resolves the currently authenticated admin with Hybrid Redis Caching.
 * PATTERN: Cryptographic First -> Cache Second -> Database Third.
 */
export async function getCurrentAdmin(): Promise<any | null> {
  const session = await getSession();
  if (!session) return null;

  const redis = getRedis();
  const cacheKey = `session:admin:${session.userId}`;

  // 1. Try Cache (Performance optimized)
  if (redis) {
    try {
      const cachedAdmin = await redis.get(cacheKey);
      if (cachedAdmin) return cachedAdmin;
    } catch (e) {
      console.warn("[CACHE_ERROR]: Failed to read from Redis", e);
    }
  }

  // 2. Database Double-Check (Consistency & Revocation)
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

  // 3. Update Cache (Post-DB Fetch)
  if (admin && redis) {
    await redis.set(cacheKey, admin, { ex: 60 * 30 }); // 30 min expiration
  }

  return admin;
}

/**
 * Higher-order function or wrapper to set Audit Context.
 * Used in Server Actions or API Routes.
 */
export async function withAuditContext<T>(
  ip: string,
  userAgent: string,
  fn: () => Promise<T>
): Promise<T> {
  const admin = await getCurrentAdmin();
  return auditStorage.run(
    { 
      adminId: admin?.id || "anonymous", 
      ipAddress: ip, 
      userAgent 
    }, 
    fn
  );
}

/**
 * Role-Based Access Control guard.
 */
export async function checkRole(allowedRoles: Role[]) {
  const admin = await getCurrentAdmin();

  if (!admin || !allowedRoles.includes(admin.role)) {
    throw new Error(
      `UNAUTHORIZED: Required privileges [${allowedRoles.join(", ")}], but session has [${admin?.role ?? "NONE"}]`
    );
  }

  return admin;
}

/**
 * ATOMIC PURGE: Must be called whenever an Admin record is updated.
 */
export async function invalidateAdminCache(adminId: string) {
  const redis = getRedis();
  if (redis) {
    await redis.del(`session:admin:${adminId}`);
  }
}


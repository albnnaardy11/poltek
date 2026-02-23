import { prisma } from "../prisma";
import { getRedis } from "../redis";
import { isActionCritical } from "../security/guard";

export interface AuditIntelligenceReport {
  id: string;
  adminName: string;
  action: string;
  entity: string;
  riskScore: number;
  timestamp: Date;
  diff: {
    before: any;
    after: any;
  };
}

/**
 * INTELLIGENCE SERVICE: Aggregates and Analyzes Audit Logs.
 */
export async function getAuditIntelligence(limit: number = 50): Promise<AuditIntelligenceReport[]> {
  const redis = getRedis();
  const CACHE_KEY = `intel:audit:recent:${limit}`;

  // Try cache first for speed
  if (redis) {
    const cached = await redis.get<AuditIntelligenceReport[]>(CACHE_KEY);
    if (cached) return cached;
  }

  const logs = await prisma.auditLog.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { admin: { select: { name: true, role: true } } },
  });

  const reports: AuditIntelligenceReport[] = logs.map(log => {
    let riskScore = 0;

    // HEURISTIC 1: Critical entity action
    if (isActionCritical(log.entity, log.action)) riskScore += 50;
    
    // HEURISTIC 2: Out of hours (22:00 - 05:00)
    const hour = new Date(log.createdAt).getHours();
    if (hour >= 22 || hour <= 5) riskScore += 30;

    // HEURISTIC 3: Multi-deletion detection (Logic can be expanded)
    if (log.action === "DELETE") riskScore += 10;

    return {
      id: log.id,
      adminName: log.admin.name || "Unknown Admin",
      action: log.action,
      entity: log.entity,
      riskScore: Math.min(riskScore, 100),
      timestamp: log.createdAt,
      diff: log.details as any,
    };
  });

  // Cache for 60 seconds to prevent DB hammering
  if (redis) {
    await redis.set(CACHE_KEY, reports, { ex: 60 });
  }

  return reports;
}

/**
 * RECONSTRUCT ENTITY PULSE: Get every state change for a specific record.
 */
export async function getEntityPulse(entity: string, entityId: string) {
  return await prisma.auditLog.findMany({
    where: { entity, entityId },
    orderBy: { createdAt: "asc" },
    include: { admin: { select: { name: true } } }
  });
}

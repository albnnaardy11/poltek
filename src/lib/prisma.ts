import { PrismaClient } from "@prisma/client";
import { getAuditContext } from "./audit-context";
import { semanticBus } from "./semantic/mediator";
import { SemanticEntity } from "./semantic/types";

const globalForPrisma = global as unknown as { prisma: PrismaClient; db: PrismaClient };

/**
 * RAW CLIENT: Used for pre-auth operations (e.g., login) that need full field
 * access and must NOT trigger the audit extension (no session context exists yet).
 * Import as `db` from this module.
 */
export const db: PrismaClient =
  globalForPrisma.db ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });

// basePrisma delegates to the same raw client
const basePrisma = db;

/**
 * Helper to map Prisma models to Semantic Entities
 */
const mapToSemanticEntity = (model: string): SemanticEntity => {
  const mapping: Record<string, SemanticEntity> = {
    Program: "ACADEMIC_PROGRAM",
    News: "NEWS_ARTICLE",
    Setting: "SYSTEM_SETTING",
    Admin: "ADMIN_IDENTITY",
  };
  return mapping[model] || "SYSTEM_SETTING";
};

/**
 * EXTENSION: Autonomous Audit & Semantic Dispatch
 */
export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const sensitiveOps = ["update", "create", "delete", "upsert"];
        
        if (!sensitiveOps.includes(operation)) {
          return query(args);
        }

        const context = getAuditContext();
        if (!context) return query(args);

        let beforeState = null;
        if (operation === "update" || operation === "delete") {
          beforeState = await (basePrisma as any)[model].findUnique({ where: (args as any).where });
        }

        const result = await query(args);

        // --- AUTONOMOUS INTEROPERABILITY: Semantic Dispatch ---
        const semanticEntity = mapToSemanticEntity(model);
        semanticBus.publish({
          topic: `domain.${semanticEntity.toLowerCase()}`,
          entity: semanticEntity,
          action: operation.toUpperCase() as any,
          payload: { before: beforeState, after: result },
          metadata: {
            origin: "PRISMA_ENGINE",
            adminId: context.adminId,
            version: "4.0.0",
          }
        });

        // --- AUDIT LOGGING ---
        (async () => {
          try {
            await basePrisma.auditLog.create({
              data: {
                adminId: context.adminId,
                action: operation.toUpperCase(),
                entity: model,
                entityId: (result as any)?.id || (args as any)?.where?.id || "unknown",
                details: {
                  before: beforeState,
                  after: operation === "delete" ? null : result,
                },
                ipAddress: context.ipAddress,
                userAgent: context.userAgent,
              },
            });
          } catch (e) {
            console.error("[AUDIT_FAILURE]:", e);
          }
        })();

        return result;
      },
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.db = db;
}

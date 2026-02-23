import { PrismaClient } from "@prisma/client";
import { getAuditContext } from "./audit-context";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

/**
 * Base Prisma Client with Singleton enforcement.
 */
const basePrisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
});

/**
 * EXTENSION: Autonomous Audit & Traceability
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
        // If no admin context (e.g., public signup or system seed), skip auditing or log as SYSTEM.
        if (!context) return query(args);

        let beforeState = null;
        if (operation === "update" || operation === "delete") {
          beforeState = await (basePrisma as any)[model].findUnique({ where: (args as any).where });
        }

        const result = await query(args);

        // Fire-and-forget logging to minimize latency on the main thread
        // In a high-traffic scenario, this should be pushed to a Message Queue (SQS/Redis).
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
            console.error("[AUDIT_FAILURE]: Could not persist audit log", e);
          }
        })();

        return result;
      },
    },
  },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = basePrisma;

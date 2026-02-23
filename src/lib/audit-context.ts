import { AsyncLocalStorage } from "async_hooks";

export interface AuditContext {
  adminId: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * AsyncLocalStorage provides a way to store data throughout the lifetime of a web request
 * without explicitly passing it through every function call.
 */
export const auditStorage = new AsyncLocalStorage<AuditContext>();

export function getAuditContext(): AuditContext | undefined {
  return auditStorage.getStore();
}

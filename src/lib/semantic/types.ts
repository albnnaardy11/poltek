import { Role } from "@/generated/client_v2";

/**
 * SEMANTIC ENTITIES: Standardized definitions for AI and cross-module discovery.
 */
export type SemanticEntity = "ACADEMIC_PROGRAM" | "NEWS_ARTICLE" | "SYSTEM_SETTING" | "ADMIN_IDENTITY";

/**
 * DOMAIN EVENTS: High-level business events that carry semantic weight.
 */
export interface DomainEvent<T = any> {
  id: string;
  topic: string;
  entity: SemanticEntity;
  action: "CREATED" | "UPDATED" | "DELETED" | "REVOKED";
  timestamp: string;
  payload: T;
  metadata: {
    origin: string;
    adminId?: string;
    version: string;
  };
}

/**
 * Type-safe Registry for Event Handlers.
 */
export type EventHandler<T = any> = (event: DomainEvent<T>) => Promise<void>;

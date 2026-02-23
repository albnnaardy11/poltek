import { DomainEvent, EventHandler } from "./types";
import { randomUUID } from "crypto";

class SemanticMediator {
  private handlers: Map<string, EventHandler[]> = new Map();

  /**
   * Subscribe a module to a specific semantic topic.
   */
  subscribe(topic: string, handler: EventHandler) {
    const topicHandlers = this.handlers.get(topic) || [];
    this.handlers.set(topic, [...topicHandlers, handler]);
    console.log(`[SEMANTIC_BUS]: Registered handler for topic: ${topic}`);
  }

  /**
   * Publish a semantic event to all interested modules.
   * Pattern: Fire-and-Forget for maximum throughput.
   */
  async publish(eventData: Omit<DomainEvent, "id" | "timestamp">) {
    const event: DomainEvent = {
      ...eventData,
      id: randomUUID(),
      timestamp: new Date().toISOString(),
    };

    const topicHandlers = this.handlers.get(event.topic) || [];
    const wildcardHandlers = this.handlers.get("*") || [];
    const allHandlers = [...topicHandlers, ...wildcardHandlers];

    console.log(`[SEMANTIC_BUS]: Dispatching ${event.action} on ${event.entity} to ${allHandlers.length} handlers`);

    // Execute handlers in parallel, but don't block the main thread.
    allHandlers.forEach(handler => {
      handler(event).catch(err => {
        console.error(`[SEMANTIC_ERROR]: Handler failed for topic ${event.topic}`, err);
      });
    });
  }
}

// Global Singleton for the Semantic Bus
export const semanticBus = new SemanticMediator();

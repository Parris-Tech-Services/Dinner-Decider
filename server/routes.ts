import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Local-first app. No API routes needed for data.
  // All data logic is in client/src/lib/db.ts and client/src/lib/decision.ts
  
  return httpServer;
}

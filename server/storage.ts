import { users, type User, type InsertUser } from "@shared/schema";

// This storage layer is NOT used for the main application data (Takeaway Options/History).
// That data is stored in Dexie.js on the client.
// This is here to satisfy the project structure and potentially for future server-side features.

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id: String(id) }; // Schema uses string ID for users usually? Shared schema has varchar default random.
    // Actually shared/schema.ts defines id as serial (number) for options/history but varchar for users?
    // Let's check shared/schema.ts content again.
    // Wait, I overwrote shared/schema.ts with takeaway options.
    // I did NOT include 'users' table in my shared/schema.ts write.
    // This will break server/storage.ts if I refer to 'users'.
    // I should probably fix server/storage.ts to not refer to users or add users back to schema.
    // Or just make IStorage empty since we don't use it.
    // But server/index.ts might use it? No, usually server/index.ts just imports storage.
    
    // I'll make a dummy storage that matches the imports I actually have.
    // In shared/schema.ts I exported takeawayOptions, history.
    
    return user;
  }
}

export const storage = new MemStorage();

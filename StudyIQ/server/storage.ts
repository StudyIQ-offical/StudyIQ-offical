import { users, messages, chatSessions, type User, type Message, type InsertMessage, type InsertUser, type ChatSession, type InsertChatSession } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gte } from "drizzle-orm";

export interface IStorage {
  // Users
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUser(id: number): Promise<User | undefined>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  
  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(mode: string): Promise<Message[]>;
  getMessagesByUser(userId: number, mode?: string): Promise<Message[]>;
  getUserMessageCount(userId: number): Promise<number>;
  resetDailyMessageCount(userId: number): Promise<void>;
  
  // Chat Sessions
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSessionsByUser(userId: number): Promise<ChatSession[]>;
  getChatSession(id: number): Promise<ChatSession | undefined>;
  deleteChatSession(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async getMessages(mode: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.mode, mode))
      .orderBy(messages.createdAt);
  }

  async getMessagesByUser(userId: number, mode?: string): Promise<Message[]> {
    let query = db.select().from(messages).where(eq(messages.userId, userId));
    if (mode) {
      query = db.select().from(messages).where(and(eq(messages.userId, userId), eq(messages.mode, mode)));
    }
    return query.orderBy(messages.createdAt);
  }

  async getUserMessageCount(userId: number): Promise<number> {
    const user = await this.getUser(userId);
    if (!user) return 0;
    
    // Check if reset date is today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const resetDate = new Date(user.messagesResetDate);
    resetDate.setHours(0, 0, 0, 0);
    
    if (resetDate.getTime() < today.getTime()) {
      // Reset counter
      await this.updateUser(userId, { messagesCount: 0, messagesResetDate: new Date() });
      return 0;
    }
    
    return user.messagesCount;
  }

  async resetDailyMessageCount(userId: number): Promise<void> {
    await this.updateUser(userId, { messagesCount: 0, messagesResetDate: new Date() });
  }

  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    const [chatSession] = await db.insert(chatSessions).values(session).returning();
    return chatSession;
  }

  async getChatSessionsByUser(userId: number): Promise<ChatSession[]> {
    return db.select().from(chatSessions).where(eq(chatSessions.userId, userId)).orderBy(desc(chatSessions.createdAt));
  }

  async getChatSession(id: number): Promise<ChatSession | undefined> {
    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, id));
    return session;
  }

  async deleteChatSession(id: number): Promise<void> {
    await db.delete(chatSessions).where(eq(chatSessions.id, id));
  }
}

export const storage = new DatabaseStorage();

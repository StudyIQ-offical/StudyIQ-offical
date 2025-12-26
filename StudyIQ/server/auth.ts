import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { RegisterRequest } from "@shared/schema";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function registerUser(email: string, password: string): Promise<{ id: number; email: string } | null> {
  const existingUser = await storage.getUserByEmail(email);
  if (existingUser) {
    return null;
  }

  const hashedPassword = await hashPassword(password);
  const user = await storage.createUser({
    email,
    password: hashedPassword,
  });

  return { id: user.id, email: user.email };
}

export async function loginUser(email: string, password: string): Promise<{ id: number; email: string; isPremium: boolean } | null> {
  const user = await storage.getUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return null;
  }

  return { id: user.id, email: user.email, isPremium: user.isPremium };
}

import { z } from 'zod';
import { insertMessageSchema, chatRequestSchema, messages } from './schema';

export const api = {
  chat: {
    send: {
      method: 'POST' as const,
      path: '/api/chat',
      input: chatRequestSchema,
      responses: {
        200: z.object({
          message: z.string(),
          role: z.literal("assistant"),
        }),
        500: z.object({ message: z.string() }),
      },
    },
    history: {
      method: 'GET' as const,
      path: '/api/chat/:mode',
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

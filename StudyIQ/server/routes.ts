import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

// Initialize OpenAI client with Replit AI Integrations
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "dummy",
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || "https://api.openai.com/v1",
});

const SYSTEM_PROMPTS = {
  assistant: `You are a friendly, supportive, and encouraging AI Life Coach. 
  Your goal is to help the user with ANY question or topic they ask about:
  - Daily planning and reminders
  - Confidence & mindset coaching
  - Life advice & general questions
  - Journaling / reflection prompts
  - Any other topic they want to discuss
  
  Answer with your best ability on any subject. Always maintain a warm, empathetic tone and provide helpful, detailed responses. Ask follow-up questions when appropriate.`,
  homework: `You are a patient, educational, and encouraging AI Homework Helper.
  Your goal is to help students learn effectively by answering ANY question they ask:
  - Providing step-by-step explanations for Math, Science, History, Essays, and any subject.
  - Helping create study plans and test prep guides.
  - Helping track homework assignments and deadlines.
  - Teaching the material and explaining concepts thoroughly.
  - Being patient and celebrating small wins to build confidence.
  
  Answer any academic question with your best ability and clear explanations.`,
  money: `You are a confident, motivational, and practical AI Money Coach.
  Your goal is to help the user with ANY finance-related question or other topics:
  - Helping create and track personal budgets.
  - Planning saving goals and strategies.
  - Suggesting side hustle and earning ideas.
  - Conducting daily or weekly money check-ins.
  - Teaching money mindset and financial literacy.
  - Answering any question they ask with your best ability.
  
  Provide detailed, helpful responses on any topic the user asks about.`,
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Get chat history
  app.get(api.chat.history.path, async (req, res) => {
    const mode = req.params.mode;
    if (!["assistant", "homework", "money"].includes(mode)) {
       return res.status(400).json({ message: "Invalid mode" });
    }
    const history = await storage.getMessages(mode);
    res.json(history);
  });

  // Send message
  app.post(api.chat.send.path, async (req, res) => {
    try {
      const { message, mode, imageBase64 } = api.chat.send.input.parse(req.body);

      // 1. Save User Message
      await storage.createMessage({
        role: "user",
        content: message,
        mode: mode,
      });

      // 2. Fetch recent history for context (last 4 messages for faster responses)
      const history = await storage.getMessages(mode);
      const recentHistory = history.slice(-4); // Smaller context window for speed

      // 3. Call OpenAI
      let systemPrompt = SYSTEM_PROMPTS[mode as keyof typeof SYSTEM_PROMPTS];
      
      // Add date context for planning
      if (mode === "assistant") {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        systemPrompt = `${systemPrompt}\nToday is ${today}. Help the user plan their day if asked.`;
      }

      // Build message content - support both text and images
      const userMessageContent: any = [];
      
      if (imageBase64) {
        userMessageContent.push({
          type: "image_url" as const,
          image_url: {
            url: `data:image/jpeg;base64,${imageBase64}`,
          },
        });
      }
      
      userMessageContent.push({
        type: "text" as const,
        text: message || "Please solve this problem step by step.",
      });
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          ...recentHistory.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
          { role: "user", content: userMessageContent }
        ],
        max_completion_tokens: 500,
      });

      const aiContent = response.choices[0].message.content || "I couldn't generate a response.";

      // 4. Save AI Message
      await storage.createMessage({
        role: "assistant",
        content: aiContent,
        mode: mode,
      });

      // 5. Respond
      res.json({ message: aiContent, role: "assistant" });

    } catch (err) {
      console.error("Chat Error:", err);
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  return httpServer;
}

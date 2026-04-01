import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { NextResponse } from "next/server";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const MAX_TEXT_LENGTH = 2000;
const MAX_FIELD_TYPE_LENGTH = 100;

// In-memory rate limiter: 10 requests per IP per minute.
// This is sufficient for a single-instance deployment. For multi-instance
// deployments, replace with a shared store (e.g. Upstash Redis).
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) return true;

  entry.count++;
  return false;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const text: unknown = body?.text;
    const fieldType: unknown = body?.fieldType;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ error: "Text is too long" }, { status: 400 });
    }

    const safeFieldType =
      typeof fieldType === "string" && fieldType.length <= MAX_FIELD_TYPE_LENGTH
        ? fieldType.replace(/[^\w\s\-]/g, "")
        : "Resume Detail";

    const prompt = `You are an expert resume writer. Improve the following text for a resume field: ${safeFieldType}.

Original Text:
"""
${text}
"""

Return ONLY the improved string. Do not include any introductory text, quotes around the string, or explanations. Keep it concise, action-oriented, and impactful.`;

    const { text: suggestion } = await generateText({
      model: openrouter("gpt-oss-120b"),
      prompt,
    });

    return NextResponse.json({ suggestion: suggestion.trim() });
  } catch (error) {
    console.error("Error generating field improvement:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestion" },
      { status: 500 }
    );
  }
}
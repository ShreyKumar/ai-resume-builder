import { generateText } from "ai";
import { gateway } from "@ai-sdk/gateway";
import type { ResumeData } from "@/lib/resume-types";

export async function POST(request: Request) {
  try {
    const resumeData: ResumeData = await request.json();

    const prompt = buildPrompt(resumeData);

    const { text } = await generateText({
      model: gateway("openai/gpt-4o-mini"),
      prompt,
    });

    return Response.json({ resume: text });
  } catch (error) {
    console.error("[v0] Error generating resume:", error);
    return Response.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}

function buildPrompt(data: ResumeData): string {
  return `Here are a few details of a job experience:
  ${JSON.stringify(data, null, 2)}

  Using the above details, create an optimized description for a resume. Use the star method (Situation, Task, Action, Result) to structure the descriptions. Focus on achievements and quantifiable results. Keep it concise and impactful.
  `;
}
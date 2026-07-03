import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { groq, GROQ_MODEL } from "@/lib/groq";
import { SYSTEM_PROMPT, JSON_FORMAT_INSTRUCTIONS } from "@/lib/prompt";
import { MatchResultSchema } from "@/lib/schema";

export const maxDuration = 30;

const MAX_CHARS = 15_000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const { resume, jobDescription } = (body ?? {}) as {
    resume?: unknown;
    jobDescription?: unknown;
  };

  if (typeof resume !== "string" || typeof jobDescription !== "string") {
    return NextResponse.json(
      { error: "Both 'resume' and 'jobDescription' are required." },
      { status: 400 }
    );
  }

  if (resume.trim().length === 0 || jobDescription.trim().length === 0) {
    return NextResponse.json(
      { error: "Resume and job description cannot be empty." },
      { status: 400 }
    );
  }

  if (resume.length > MAX_CHARS || jobDescription.length > MAX_CHARS) {
    return NextResponse.json(
      {
        error: `Resume and job description must each be under ${MAX_CHARS.toLocaleString()} characters.`,
      },
      { status: 400 }
    );
  }

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      max_tokens: 2048,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: `${SYSTEM_PROMPT}\n\n${JSON_FORMAT_INSTRUCTIONS}` },
        {
          role: "user",
          content: `RESUME:\n${resume}\n\nJOB DESCRIPTION:\n${jobDescription}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json(
        { error: "The AI service returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    // JSON mode guarantees valid JSON; the Zod schema guarantees the shape.
    const result = MatchResultSchema.parse(JSON.parse(raw));
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof Groq.RateLimitError) {
      return NextResponse.json(
        { error: "Rate limited. Please wait a moment and try again." },
        { status: 429 }
      );
    }
    if (err instanceof Groq.APIError) {
      return NextResponse.json(
        { error: "The AI service is temporarily unavailable. Please try again." },
        { status: 502 }
      );
    }
    if (err instanceof ZodError || err instanceof SyntaxError) {
      // Model returned malformed or off-schema output.
      return NextResponse.json(
        { error: "The AI service returned an unexpected response. Please try again." },
        { status: 502 }
      );
    }
    console.error("Unexpected error in /api/match:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

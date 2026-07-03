import Groq from "groq-sdk";

// Server-only singleton. This module must never be imported from a client
// component — it reads GROQ_API_KEY (no NEXT_PUBLIC_ prefix), so the key never
// reaches the browser bundle.
const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error(
    "GROQ_API_KEY is not set. Copy .env.example to .env.local and add your key."
  );
}

export const groq = new Groq({ apiKey });

// Fast, capable model on Groq's free tier. Good for text analysis/extraction.
export const GROQ_MODEL = "llama-3.3-70b-versatile";

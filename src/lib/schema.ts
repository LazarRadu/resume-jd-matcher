import { z } from "zod";

export const MatchResultSchema = z.object({
  score: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Overall match score from 0-100 reflecting alignment on required skills, qualifications, experience level, and keywords."
    ),
  summary: z
    .string()
    .describe("One or two sentence plain-language summary of the match."),
  gaps: z
    .array(
      z.object({
        category: z
          .enum(["skill", "qualification", "keyword", "experience"])
          .describe("The kind of gap."),
        item: z
          .string()
          .describe(
            "The specific missing or weak item, referencing actual terms from the job description."
          ),
        importance: z
          .enum(["high", "medium", "low"])
          .describe("How important this gap is to the role."),
      })
    )
    .describe(
      "Skills, qualifications, keywords, or experience present in the job description but missing or weak in the resume."
    ),
  suggestions: z
    .array(
      z.object({
        area: z
          .string()
          .describe("The resume area or section the suggestion applies to."),
        suggestion: z
          .string()
          .describe(
            "A concrete, actionable revision the candidate could make — without fabricating experience."
          ),
      })
    )
    .describe("Actionable suggestions to improve the match for this job."),
});

export type MatchResult = z.infer<typeof MatchResultSchema>;

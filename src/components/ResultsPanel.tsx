import type { MatchResult } from "@/lib/schema";
import ScoreBadge from "./ScoreBadge";

type ResultsPanelProps = {
  result: MatchResult;
};

const importanceClasses: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

export default function ResultsPanel({ result }: ResultsPanelProps) {
  return (
    <section className="space-y-8 rounded-2xl border border-black/10 bg-black/[.02] p-6 dark:border-white/15 dark:bg-white/[.03]">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <ScoreBadge score={result.score} />
        <p className="text-base leading-relaxed">{result.summary}</p>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Gaps</h2>
        {result.gaps.length === 0 ? (
          <p className="text-sm opacity-70">No significant gaps found.</p>
        ) : (
          <ul className="space-y-2">
            {result.gaps.map((gap, i) => (
              <li
                key={i}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black/20"
              >
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                    importanceClasses[gap.importance] ?? importanceClasses.low
                  }`}
                >
                  {gap.importance}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-600">
                  {gap.category}
                </span>
                <span className="flex-1">{gap.item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Suggestions</h2>
        {result.suggestions.length === 0 ? (
          <p className="text-sm opacity-70">No suggestions.</p>
        ) : (
          <ul className="space-y-3">
            {result.suggestions.map((s, i) => (
              <li key={i} className="text-sm">
                <span className="font-medium">{s.area}: </span>
                <span>{s.suggestion}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

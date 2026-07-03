type ScoreBadgeProps = {
  score: number;
};

function colorClasses(score: number): string {
  if (score >= 75) return "bg-green-100 text-green-800 ring-green-600/20";
  if (score >= 50) return "bg-amber-100 text-amber-800 ring-amber-600/20";
  return "bg-red-100 text-red-800 ring-red-600/20";
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  const rounded = Math.round(score);
  return (
    <div
      className={`inline-flex flex-col items-center justify-center rounded-2xl px-6 py-4 ring-1 ring-inset ${colorClasses(
        rounded
      )}`}
    >
      <span className="text-4xl font-bold tabular-nums">{rounded}</span>
      <span className="text-xs font-medium uppercase tracking-wide">/ 100 match</span>
    </div>
  );
}

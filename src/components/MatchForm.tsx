type MatchFormProps = {
  resume: string;
  jobDescription: string;
  loading: boolean;
  onResumeChange: (value: string) => void;
  onJobDescriptionChange: (value: string) => void;
  onSubmit: () => void;
};

export default function MatchForm({
  resume,
  jobDescription,
  loading,
  onResumeChange,
  onJobDescriptionChange,
  onSubmit,
}: MatchFormProps) {
  const canSubmit =
    resume.trim().length > 0 && jobDescription.trim().length > 0 && !loading;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Resume</span>
          <textarea
            value={resume}
            onChange={(e) => onResumeChange(e.target.value)}
            rows={16}
            placeholder="Paste your resume here…"
            className="resize-y rounded-lg border border-black/15 bg-white p-3 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:bg-black/30 dark:focus:border-white/50"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Job Description</span>
          <textarea
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            rows={16}
            placeholder="Paste the job posting here…"
            className="resize-y rounded-lg border border-black/15 bg-white p-3 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:bg-black/30 dark:focus:border-white/50"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading && (
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-background"
          />
        )}
        {loading ? "Analyzing…" : "Analyze Match"}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import MatchForm from "@/components/MatchForm";
import ResultsPanel from "@/components/ResultsPanel";
import ErrorBanner from "@/components/ErrorBanner";
import type { MatchResult } from "@/lib/schema";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setResult(data as MatchResult);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Resume / JD Matcher
        </h1>
        <p className="mt-2 text-sm opacity-70">
          Paste a resume and a job description to get an AI match score, gap
          analysis, and actionable suggestions.
        </p>
      </header>

      <div className="space-y-6">
        <MatchForm
          resume={resume}
          jobDescription={jobDescription}
          loading={loading}
          onResumeChange={setResume}
          onJobDescriptionChange={setJobDescription}
          onSubmit={handleSubmit}
        />

        {error && (
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        )}

        {result && <ResultsPanel result={result} />}
      </div>
    </main>
  );
}

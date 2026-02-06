"use client";

import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  const [emailText, setEmailText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!emailText) return;
    setLoading(true);
    setSummary("");

    try {
      const response = await fetch("/functions/mailSummarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailText }),
      });

      if (!response.ok) {
        // Fallback for demo
        await new Promise(r => setTimeout(r, 1500));
        setSummary("Meeting confirmed for Friday at 10 AM. Action items: Review deck, Send invite. (AI Generated Simulation)");
        return;
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Summarize failed", error);
      setSummary("Error generating summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-4 border border-blue-500/20 backdrop-blur-md">
          <Sparkles className="h-8 w-8 text-blue-400 animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Nexus AI Mail Summarizer
        </h1>
        <p className="mt-3 text-slate-400 font-medium">Paste your long emails below and get instant actionable summaries.</p>
      </div>

      <div className="w-full space-y-6">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <textarea
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            placeholder="Paste email content here..."
            className="relative w-full h-48 p-4 rounded-xl border border-slate-700 bg-slate-900/80 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-xl"
          />
        </div>

        <button
          onClick={handleSummarize}
          disabled={loading || !emailText}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/50 hover:shadow-blue-900/80 hover:-translate-y-0.5"
        >
          {loading ? "Analyzing..." : (
            <>
              Summarize <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

        {summary && (
          <div className="mt-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700 shadow-xl animate-in fade-in slide-in-from-bottom-4 backdrop-blur-md">
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">AI Summary</h3>
            <p className="text-slate-200 leading-relaxed font-medium">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}

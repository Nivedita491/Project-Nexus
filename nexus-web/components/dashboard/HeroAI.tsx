"use client";

import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/layout/GlassCard";

export function HeroAI() {
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
        <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 via-blue-950/20 to-slate-900 p-8 shadow-2xl">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl"></div>

            <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1 space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                        <Sparkles className="h-3 w-3 animate-pulse" />
                        <span>Nexus AI</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Mail Summarizer</h2>
                    <p className="text-slate-400 max-w-md">
                        Overwhelmed by emails? Paste them here and let Nexus AI extract the key action items and summary instantly.
                    </p>
                </div>

                <div className="w-full lg:w-3/5 space-y-4">
                    <div className="relative group">
                        <textarea
                            value={emailText}
                            onChange={(e) => setEmailText(e.target.value)}
                            placeholder="Paste email content here..."
                            className="w-full h-32 p-4 rounded-xl border border-slate-700 bg-slate-900/60 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-inner"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleSummarize}
                            disabled={loading || !emailText}
                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                        >
                            {loading ? "Analyzing..." : (
                                <>
                                    Summarize <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </div>

                    {summary && (
                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 animate-in fade-in slide-in-from-top-2">
                            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Result</h3>
                            <p className="text-sm text-slate-200 leading-relaxed font-medium">{summary}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

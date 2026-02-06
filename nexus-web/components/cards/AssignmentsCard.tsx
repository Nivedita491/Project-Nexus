"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BookOpen, AlertCircle } from "lucide-react";

async function fetchAssignments() {
    const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .order("due_date", { ascending: true })
        .limit(5);

    if (error) throw error;
    return data || [];
}

export function AssignmentsCard() {
    const { data: assignments, isLoading, error } = useQuery({
        queryKey: ["assignments"],
        queryFn: fetchAssignments,
    });

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-100">
                    <BookOpen className="h-5 w-5 text-orange-500" />
                    Pending Assignments
                </h2>
                <span className="rounded-full bg-orange-500/10 px-2 py-1 text-xs font-semibold text-orange-400 border border-orange-500/20">
                    {assignments?.length || 0} Due
                </span>
            </div>

            {isLoading ? (
                <div className="space-y-3 animate-pulse">
                    <div className="h-10 bg-slate-800/50 rounded"></div>
                    <div className="h-10 bg-slate-800/50 rounded"></div>
                </div>
            ) : error ? (
                <div className="text-red-400">Failed to load assignments</div>
            ) : assignments?.length === 0 ? (
                <p className="text-slate-500">No pending assignments</p>
            ) : (
                <div className="space-y-3">
                    {assignments?.map((assignment: any) => (
                        <div key={assignment.id} className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3 border border-slate-700/50">
                            <div>
                                <h3 className="font-medium text-slate-200">{assignment.title}</h3>
                                <p className="text-xs text-slate-500">Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                            </div>
                            <AlertCircle className="h-4 w-4 text-orange-400" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

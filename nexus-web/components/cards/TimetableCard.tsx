"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Calendar, Clock, MapPin } from "lucide-react";

async function fetchClasses() {
    const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("start_time", { ascending: true });

    if (error) throw error;
    return data || [];
}

export function TimetableCard() {
    const { data: classes, isLoading, error } = useQuery({
        queryKey: ["classes"],
        queryFn: fetchClasses,
    });

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-100">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Today's Schedule
                </h2>
            </div>

            {isLoading ? (
                <div className="space-y-3 animate-pulse">
                    <div className="h-12 bg-slate-800/50 rounded"></div>
                    <div className="h-12 bg-slate-800/50 rounded"></div>
                </div>
            ) : error ? (
                <div className="text-red-400">Failed to load schedule</div>
            ) : classes?.length === 0 ? (
                <p className="text-slate-500">No classes today</p>
            ) : (
                <div className="space-y-4">
                    {classes?.map((cls: any) => (
                        <div key={cls.id} className="flex items-start gap-3 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                            <div className="flex-1">
                                <h3 className="font-medium text-slate-200">{cls.subject}</h3>
                                <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {cls.start_time}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {cls.room}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

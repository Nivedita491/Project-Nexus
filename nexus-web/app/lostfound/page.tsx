"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { subscribeToTable } from "@/lib/realtime";
import { LostCard } from "@/components/cards/LostCard";
import { Search } from "lucide-react";

async function fetchLostItems() {
    const { data, error } = await supabase.from("lost_items").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
}

export default function LostFoundPage() {
    const queryClient = useQueryClient();

    const { data: items, isLoading } = useQuery({
        queryKey: ["lost_items"],
        queryFn: fetchLostItems,
    });

    useEffect(() => {
        const channel = subscribeToTable("lost_items", () => {
            queryClient.invalidateQueries({ queryKey: ["lost_items"] });
        });
        return () => {
            channel.unsubscribe(); // Correct method per supabase js v2 is unsubscribe() on channel? No, supabase.removeChannel(channel). But channel.unsubscribe() exists too usually.
        };
    }, [queryClient]);

    return (
        <div className="p-4 md:p-8">
            <header className="mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
                    <Search className="h-6 w-6 text-blue-500" />
                    Lost & Found
                </h1>
                <p className="text-slate-400">Report or find lost items on campus.</p>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 animate-pulse">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-slate-800/50 rounded-lg"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {items?.map((item: any) => (
                        <LostCard key={item.id} item={item} />
                    ))}
                    {items?.length === 0 && <p className="text-slate-500 col-span-full text-center py-12">No items reported.</p>}
                </div>
            )}
        </div>
    );
}

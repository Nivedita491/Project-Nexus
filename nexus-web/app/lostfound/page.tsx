"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { subscribeToTable } from "@/lib/realtime";
import { LostCard } from "@/components/cards/LostCard";
import { Search } from "lucide-react";
import { useLostItems } from "@/lib/hooks/useData";
import { SkeletonCard } from "@/components/layout/SkeletonCard";

export default function LostFoundPage() {
    const queryClient = useQueryClient();

    const { data: items, isLoading } = useLostItems();

    // Realtime subscription handled globally by RealtimeManager

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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {[1, 2, 3, 4].map(i => <SkeletonCard key={i} className="h-64" />)}
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

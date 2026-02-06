"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { subscribeToTable } from "@/lib/realtime";
import { TripCard } from "@/components/cards/TripCard";
import { Plane } from "lucide-react";

async function fetchTrips() {
    const { data, error } = await supabase.from("trips").select("*").order("date", { ascending: true });
    if (error) throw error;
    return data || [];
}

export default function TripsPage() {
    const queryClient = useQueryClient();

    const { data: trips, isLoading } = useQuery({
        queryKey: ["trips"],
        queryFn: fetchTrips,
    });

    useEffect(() => {
        const channel = subscribeToTable("trips", () => {
            queryClient.invalidateQueries({ queryKey: ["trips"] });
        });
        return () => {
            channel.unsubscribe();
        };
    }, [queryClient]);

    return (
        <div className="p-4 md:p-8">
            <header className="mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
                    <Plane className="h-6 w-6 text-purple-500" />
                    Trips & Carpool
                </h1>
                <p className="text-slate-400">Find travel buddies or plan weekend trips.</p>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-800/50 rounded-lg"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {trips?.map((trip: any) => (
                        <TripCard key={trip.id} trip={trip} />
                    ))}
                    {trips?.length === 0 && <p className="text-slate-500 col-span-full text-center py-12">No trips planned.</p>}
                </div>
            )}
        </div>
    );
}

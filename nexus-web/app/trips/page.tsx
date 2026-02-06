"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { subscribeToTable } from "@/lib/realtime";
import { TripCard } from "@/components/cards/TripCard";
import { Plane } from "lucide-react";
import { useTrips } from "@/lib/hooks/useData";

import { SkeletonCard } from "@/components/layout/SkeletonCard";

export default function TripsPage() {
    const queryClient = useQueryClient();

    const { data: trips, isLoading } = useTrips();


    // Realtime subscription handled globally by RealtimeManager


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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {[1, 2, 3].map(i => <SkeletonCard key={i} className="h-48" />)}
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

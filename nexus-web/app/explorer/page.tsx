"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { CampusMap } from "@/components/map/CampusMap";
import { X, MapPin } from "lucide-react";

async function fetchPlaces() {
    const { data, error } = await supabase.from("places").select("*");
    // Mock data if table empty or error during dev
    if (error || !data || data.length === 0) {
        return [
            { id: "1", name: "Academic Block 1", lat: 30.7675, lng: 76.5755, description: "Main Engineering Block" },
            { id: "2", name: "Student Center", lat: 30.7680, lng: 76.5760, description: "Food court and hangouts" },
            { id: "3", name: "Library", lat: 30.7665, lng: 76.5745, description: "24/7 Reading Room" },
        ];
    }
    return data;
}

export default function ExplorerPage() {
    const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

    const { data: places, isLoading } = useQuery({
        queryKey: ["places"],
        queryFn: fetchPlaces,
    });

    return (
        <div className="relative h-[calc(100vh-64px)] w-full bg-slate-950">

            {isLoading ? (
                <div className="flex h-full items-center justify-center bg-slate-950">
                    <p className="animate-pulse text-blue-400 font-medium">Loading Satellite Uplink...</p>
                </div>
            ) : (
                <CampusMap
                    places={places || []}
                    onMarkerClick={(place: any) => setSelectedPlace(place)}
                />
            )}

            {/* Side Card Overlay - Dark Glass */}
            {selectedPlace && (
                <div className="absolute bottom-4 left-4 right-4 md:bottom-auto md:left-4 md:top-4 md:right-auto md:w-80">
                    <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-5 shadow-2xl animate-in slide-in-from-bottom backdrop-blur-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                                    <MapPin className="h-5 w-5 text-blue-500" />
                                    {selectedPlace.name}
                                </h3>
                                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{selectedPlace.description}</p>
                                <div className="mt-4 flex gap-2">
                                    <button className="rounded-lg px-4 py-2 bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/50">
                                        Navigate
                                    </button>
                                    <button className="rounded-lg px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 border border-slate-700 transition-colors">
                                        Details
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedPlace(null)}
                                className="rounded-full p-1.5 hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

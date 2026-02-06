"use client";

import { useRealtimeSync } from "@/lib/realtime";

export function RealtimeManager() {
    useRealtimeSync();
    return null; // Invisible component
}

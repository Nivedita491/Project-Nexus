"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { RealtimeManager } from "@/components/system/RealtimeManager";
import { EventToast } from "@/components/layout/EventToast";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <RealtimeManager />
            <EventToast />
            {children}
        </QueryClientProvider>
    );
}

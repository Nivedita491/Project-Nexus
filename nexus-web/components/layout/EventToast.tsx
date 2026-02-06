"use client";

import { useEffect, useState } from "react";
import { subscribeToTable } from "@/lib/realtime";
import { Bell, X } from "lucide-react";

interface Toast {
    id: string;
    message: string;
    type: 'info' | 'success' | 'alert';
}

export function EventToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        // Subscribe to notifications INSERT events
        const channel = subscribeToTable("notifications", (payload: any) => {
            if (payload.eventType === 'INSERT') {
                const newToast = {
                    id: Math.random().toString(36).substring(7),
                    message: payload.new.message,
                    type: payload.new.type || 'info'
                };
                setToasts(prev => [...prev, newToast]);

                // Auto dismiss
                setTimeout(() => {
                    setToasts(prev => prev.filter(t => t.id !== newToast.id));
                }, 5000);
            }
        });

        // Also subscribe to other table inserts to show generic toasts
        // For demonstration, we'll assume the backend sends a notification record
        // but we could also listen to 'lost_items' INSERTs directly if we wanted

        return () => {
            channel.unsubscribe();
        };
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 md:bottom-8">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md animate-in slide-in-from-right fade-in"
                >
                    <div className="rounded-full bg-blue-500/20 p-2 text-blue-400">
                        <Bell className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">New Notification</p>
                        <p className="text-xs text-slate-300">{toast.message}</p>
                    </div>
                    <button
                        onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                        className="ml-2 text-slate-500 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}

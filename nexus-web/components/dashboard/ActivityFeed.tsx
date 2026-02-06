"use client";

import { useNotifications } from "@/lib/hooks/useData";
import { Bell, Info, AlertTriangle, CheckCircle } from "lucide-react";

import { GlassCard } from "@/components/layout/GlassCard";

export function ActivityFeed() {
    const { data: notifications, isLoading } = useNotifications();

    return (
        <GlassCard className="h-full">
            <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-500" />
                Activity Feed
            </h2>

            {isLoading ? (
                <div className="space-y-4 animate-pulse">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-slate-800/50 rounded"></div>)}
                </div>
            ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {notifications?.map((notif: any) => (
                        <div key={notif.id} className="flex gap-3 items-start p-3 rounded-lg bg-slate-800/30 border border-slate-800 hover:border-slate-700 transition-colors">
                            <div className="mt-1">
                                {notif.type === 'alert' ? <AlertTriangle className="h-4 w-4 text-red-400" /> :
                                    notif.type === 'success' ? <CheckCircle className="h-4 w-4 text-green-400" /> :
                                        <Info className="h-4 w-4 text-blue-400" />}
                            </div>
                            <div>
                                <p className="text-sm text-slate-200">{notif.message}</p>
                                <span className="text-[10px] text-slate-500">{new Date(notif.created_at).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    ))}
                    {notifications?.length === 0 && (
                        <p className="text-sm text-slate-500">No recent activity.</p>
                    )}
                </div>
            )}
        </GlassCard>
    );
}

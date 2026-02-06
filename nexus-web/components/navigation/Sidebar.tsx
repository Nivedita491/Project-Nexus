"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, ShoppingBag, Plane, Map as MapIcon, Bell } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { subscribeToTable } from "@/lib/realtime";
import { useEffect } from "react";

async function fetchUnreadCount() {
    const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("read", false);
    if (error) return 0;
    return count || 0;
}

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/lostfound", label: "Lost & Found", icon: Search },
    { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
    { href: "/trips", label: "Trips", icon: Plane },
    { href: "/explorer", label: "Explorer", icon: MapIcon },
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const queryClient = useQueryClient();

    const { data: unreadCount } = useQuery({
        queryKey: ["notifications_count"],
        queryFn: fetchUnreadCount,
    });

    useEffect(() => {
        const channel = subscribeToTable("notifications", () => {
            queryClient.invalidateQueries({ queryKey: ["notifications_count"] });
        });
        return () => {
            channel.unsubscribe();
        };
    }, [queryClient]);

    return (
        <aside className={`w-64 border-r border-slate-800 glass p-4 flex flex-col ${className}`}>
            <div className="mb-8 flex items-center gap-3 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
                    N
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">Nexus</h1>
            </div>

            <nav className="space-y-1 flex-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive
                                ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-8 border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between px-3 text-sm font-medium text-slate-400">
                    <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span>Notifications</span>
                    </div>
                    {unreadCount ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white shadow-lg shadow-blue-900/50">
                            {unreadCount}
                        </span>
                    ) : null}
                </div>
            </div>
        </aside>
    );
}

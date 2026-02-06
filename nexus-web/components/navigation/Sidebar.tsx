"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";
import { LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

async function fetchUnreadCount() {
    const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);

    if (error) throw error;
    return count || 0;
}

export function Sidebar({ className = "" }: { className?: string }) {
    const pathname = usePathname();

    const { data: unreadCount } = useQuery({
        queryKey: ["notifications_count"],
        queryFn: fetchUnreadCount,
    });

    return (
        <aside className={`w-64 border-r border-slate-800 glass p-4 flex flex-col ${className}`}>
            <div className="flex items-center gap-2 px-2 mb-8">
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">
                    N
                </div>
                <span className="text-xl font-bold text-white tracking-tight">Nexus</span>
            </div>

            <nav className="space-y-1 flex-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="font-medium">{item.label}</span>
                            {item.label === "Dashboard" && unreadCount && unreadCount > 0 ? (
                                <span className="ml-auto bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                    {unreadCount}
                                </span>
                            ) : null}
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-4 border-t border-slate-800">
                <button className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white transition-colors w-full">
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}

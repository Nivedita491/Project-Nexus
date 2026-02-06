"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";
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

export function BottomNav({ className = "" }: { className?: string }) {
    const pathname = usePathname();

    const { data: unreadCount } = useQuery({
        queryKey: ["notifications_count"],
        queryFn: fetchUnreadCount,
    });

    return (
        <nav className={`fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/90 backdrop-blur-lg pb-safe md:hidden ${className}`}>
            <div className="flex items-center justify-around p-3">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 relative ${isActive ? "text-blue-500" : "text-slate-500 hover:text-slate-300"
                                }`}
                        >
                            <item.icon className={`h-6 w-6 ${isActive ? "fill-current/10" : ""}`} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                            {item.label === "Dashboard" && unreadCount && unreadCount > 0 ? (
                                <span className="absolute -top-1 right-2 h-2 w-2 rounded-full bg-blue-500"></span>
                            ) : null}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, ShoppingBag, Plane, Map as MapIcon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { subscribeToTable } from "@/lib/realtime";
import { useEffect } from "react";

async function fetchUnreadCount() {
    const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("read", false);
    return count || 0;
}

const navItems = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/lostfound", label: "Lost", icon: Search },
    { href: "/marketplace", label: "Shop", icon: ShoppingBag },
    { href: "/trips", label: "Trips", icon: Plane },
    { href: "/explorer", label: "Explore", icon: MapIcon },
];

export function BottomNav({ className }: { className?: string }) {
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
        <nav className={`fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/90 backdrop-blur-lg pb-safe ${className}`}>
            <div className="flex justify-around p-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 rounded-lg p-2 text-[10px] font-medium transition-colors ${isActive
                                ? "text-blue-400"
                                : "text-slate-500 hover:text-slate-300"
                                }`}
                        >
                            <div className="relative">
                                <Icon className="h-6 w-6" />
                                {item.label === "Home" && unreadCount ? (
                                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-500 border border-slate-950"></span>
                                ) : null}
                            </div>
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

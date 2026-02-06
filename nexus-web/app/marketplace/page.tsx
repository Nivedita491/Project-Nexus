"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { subscribeToTable } from "@/lib/realtime";
import { ProductCard } from "@/components/cards/ProductCard";
import { ShoppingBag } from "lucide-react";

async function fetchListings() {
    const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
}

export default function MarketplacePage() {
    const queryClient = useQueryClient();

    const { data: listings, isLoading } = useQuery({
        queryKey: ["listings"],
        queryFn: fetchListings,
    });

    useEffect(() => {
        const channel = subscribeToTable("listings", () => {
            queryClient.invalidateQueries({ queryKey: ["listings"] });
        });
        return () => {
            channel.unsubscribe();
        };
    }, [queryClient]);

    return (
        <div className="p-4 md:p-8">
            <header className="mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
                    <ShoppingBag className="h-6 w-6 text-green-500" />
                    Marketplace
                </h1>
                <p className="text-slate-400">Buy and sell items within the campus.</p>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 animate-pulse">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-48 bg-slate-800/50 rounded-lg"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {listings?.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    {listings?.length === 0 && <p className="text-slate-500 col-span-full text-center py-12">No listings available.</p>}
                </div>
            )}
        </div>
    );
}

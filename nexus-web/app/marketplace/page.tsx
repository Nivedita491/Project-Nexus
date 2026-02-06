"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { subscribeToTable } from "@/lib/realtime";
import { ProductCard } from "@/components/cards/ProductCard";
import { ShoppingBag } from "lucide-react";
import { useListings } from "@/lib/hooks/useData";

import { SkeletonCard } from "@/components/layout/SkeletonCard";

export default function MarketplacePage() {
    const queryClient = useQueryClient();

    const { data: listings, isLoading } = useListings();


    // Realtime subscription handled globally by RealtimeManager


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
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} className="h-64" />)}
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

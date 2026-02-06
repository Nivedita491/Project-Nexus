import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { LostItem, Listing, Trip } from "@/types/schema";

export function useLostItems() {
    return useQuery({
        queryKey: ["lost_items"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("lost_items")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data as LostItem[];
        },
    });
}

export function useListings() {
    return useQuery({
        queryKey: ["listings"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("listings")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data as Listing[];
        },
    });
}

export function useTrips() {
    return useQuery({
        queryKey: ["trips"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("trips")
                .select("*")
                .order("date", { ascending: true });
            if (error) throw error;
            return data as Trip[];
        },
    });
}

export function useNotifications() {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("notifications")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(20);
            if (error) throw error;
            return data;
        },
    });
}

export function useUnreadNotificationsCount() {
    return useQuery({
        queryKey: ["notifications_count"],
        queryFn: async () => {
            const { count, error } = await supabase
                .from("notifications")
                .select("*", { count: "exact", head: true })
                .eq("read", false);
            if (error) return 0;
            return count || 0;
        }
    });
}

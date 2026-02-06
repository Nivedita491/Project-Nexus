import { supabase } from "./supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

/**
 * Subscribes to changes on a specific table.
 * @param tableName - The name of the table to listen to (e.g., "lost_items")
 * @param callback - Function to execute when a change occurs
 * @returns The Supabase RealtimeChannel, which can be used to unsubscribe.
 */
export function subscribeToTable(
    tableName: string,
    callback: (payload: any) => void
): RealtimeChannel {
    const channel = supabase
        .channel(`realtime:${tableName}`)
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: tableName },
            (payload) => {
                console.log(`[Realtime] Change in ${tableName}:`, payload);
                callback(payload);
            }
        )
        .subscribe((status) => {
            if (status === "SUBSCRIBED") {
                console.log(`[Realtime] Subscribed to ${tableName}`);
            }
        });

    return channel;
}

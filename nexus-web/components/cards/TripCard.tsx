import { Calendar, MapPin, Users } from "lucide-react";

export function TripCard({ trip }: { trip: any }) {
    return (
        <div className="flex flex-col rounded-lg border border-slate-800 bg-slate-900/50 p-4 shadow-sm hover:shadow-md transition-all hover:border-slate-700">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-400">
                    <MapPin className="h-4 w-4" />
                    {trip.destination}
                </div>
                <span className="text-xs text-slate-500">{new Date(trip.date).toLocaleDateString()}</span>
            </div>
            <p className="mb-4 text-sm text-slate-400 line-clamp-3">{trip.description}</p>
            <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Users className="h-3 w-3" />
                    <span>{trip.participants_count}/{trip.max_participants} joining</span>
                </div>
                <button className="rounded px-3 py-1 bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700">
                    Join
                </button>
            </div>
        </div>
    );
}

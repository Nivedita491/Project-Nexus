import { TimetableCard } from "@/components/cards/TimetableCard";
import { AssignmentsCard } from "@/components/cards/AssignmentsCard";
import { Bell } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="p-4 md:p-8 space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back, Student</h1>
                    <p className="text-slate-400 mt-1">Here's what's happening on campus today.</p>
                </div>
                <div className="md:hidden relative">
                    <Bell className="h-6 w-6 text-slate-400" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">3</span>
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <section className="space-y-4">
                    <TimetableCard />
                </section>

                <section className="space-y-4">
                    <AssignmentsCard />
                </section>

                <section className="space-y-4">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm backdrop-blur-sm">
                        <h2 className="text-lg font-semibold mb-4 text-white">Exam Alerts</h2>
                        <div className="p-4 bg-yellow-900/20 text-yellow-200 border border-yellow-700/30 rounded-lg text-sm">
                            Midterms starting next week. Check your schedule.
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

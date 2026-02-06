export function SkeletonCard({ className = "" }: { className?: string }) {
    return (
        <div className={`rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm backdrop-blur-sm animate-pulse ${className}`}>
            <div className="h-4 bg-slate-800/80 rounded w-1/3 mb-4"></div>
            <div className="h-20 bg-slate-800/50 rounded w-full mb-3"></div>
            <div className="flex items-center justify-between">
                <div className="h-3 bg-slate-800/50 rounded w-1/4"></div>
                <div className="h-5 bg-slate-800/80 rounded w-1/6"></div>
            </div>
        </div>
    );
}

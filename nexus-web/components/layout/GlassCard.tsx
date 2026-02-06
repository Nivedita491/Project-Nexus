export function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm backdrop-blur-sm ${className}`}>
            {children}
        </div>
    );
}

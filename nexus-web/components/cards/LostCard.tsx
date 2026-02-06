export function LostCard({ item }: { item: any }) {
    return (
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 shadow-sm hover:shadow-md transition-all hover:border-slate-700">
            <div className="aspect-video w-full rounded bg-slate-800 mb-3 flex items-center justify-center text-slate-500 text-sm overflow-hidden">
                {item.image_url ? <img src={item.image_url} alt={item.title} className="h-full w-full object-cover rounded hover:scale-105 transition-transform" /> : "No Image"}
            </div>
            <h3 className="font-semibold text-slate-200 line-clamp-1">{item.title}</h3>
            <p className="text-sm text-slate-400 line-clamp-2">{item.description}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">{item.status || 'lost'}</span>
            </div>
        </div>
    );
}

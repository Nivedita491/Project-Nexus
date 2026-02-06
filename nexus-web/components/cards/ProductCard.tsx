export function ProductCard({ product }: { product: any }) {
    return (
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 shadow-sm hover:shadow-md transition-all hover:border-slate-700">
            <div className="aspect-square w-full rounded bg-slate-800 mb-3 flex items-center justify-center text-slate-500 relative overflow-hidden group">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                    "No Image"
                )}
                <div className="absolute top-2 right-2 bg-slate-950/90 px-2 py-1 rounded text-xs font-bold text-white shadow-sm border border-slate-700">
                    ${product.price}
                </div>
            </div>
            <h3 className="font-semibold text-slate-200 line-clamp-1">{product.title}</h3>
            <p className="text-sm text-slate-400 line-clamp-1">{product.category}</p>
            <button className="mt-3 w-full rounded bg-blue-600/90 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition-colors">
                View Details
            </button>
        </div>
    );
}

export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
    );
}

export function GridSkeleton() {
    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex border-b border-[#e1e1e1]">
                {/* Header Skeleton */}
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-[35px] w-[150px] border-r border-[#e1e1e1] p-2">
                        <Skeleton className="h-4 w-24" />
                    </div>
                ))}
            </div>
            {/* Rows Skeleton */}
            {[...Array(15)].map((_, r) => (
                <div key={r} className="flex border-b border-[#e1e1e1]">
                    {[...Array(5)].map((_, c) => (
                        <div key={c} className="h-[35px] w-[150px] border-r border-[#e1e1e1] p-2">
                            <Skeleton className="h-3 w-full" />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

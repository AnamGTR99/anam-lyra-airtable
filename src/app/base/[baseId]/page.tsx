"use client";

import { api } from "~/trpc/react";
import { Sidebar } from "~/app/_components/Sidebar";
import { BaseHeader } from "~/app/_components/BaseHeader";
import { Toolbar } from "~/app/_components/Toolbar";
import { use, useState, useEffect } from "react";
import { GridSkeleton } from "~/app/_components/Skeleton";
import { GridContainer } from "~/app/_components/Grid";

export default function BasePage({ params }: { params: Promise<{ baseId: string }> }) {
    // Unwrap params (Next.js 15 requirement)
    const { baseId } = use(params);

    // Fetch Base Data
    const { data: base, isLoading, error } = api.base.getById.useQuery({ id: baseId });

    // Manage Active Table State (default to first table)
    const [activeTableId, setActiveTableId] = useState<string | undefined>();

    // Set active table when base loads
    useEffect(() => {
        if (base?.tables && base.tables.length > 0 && !activeTableId) {
            setActiveTableId(base.tables[0]?.id);
        }
    }, [base, activeTableId]);

    const handleBulkInsert = () => {
        // Invalidate queries or refresh logic if needed
        // For now the Toolbar mutation handles the job creation
    };

    if (isLoading) return (
        <div className="flex h-screen w-screen overflow-hidden bg-white">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0">
                <div className="h-[48px] bg-[#116df7] w-full" />
                <div className="h-[56px] border-b border-[#e1e1e1] bg-white w-full" />
                <div className="flex-1 p-4">
                    <GridSkeleton />
                </div>
            </div>
        </div>
    );
    if (error) return <div className="flex h-screen items-center justify-center text-red-500">Error loading base</div>;
    if (!base) return null;

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-white">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <BaseHeader
                    baseName={base.name}
                    tables={base.tables}
                    activeTableId={activeTableId}
                />

                <Toolbar
                    tableId={activeTableId}
                    onBulkInsert={handleBulkInsert}
                />

                {/* Grid Visualization */}
                <div className="flex-1 overflow-hidden relative">
                    {activeTableId ? (
                        <GridContainer count={base.tables.find((t) => t.id === activeTableId)?._count?.rows ?? 0} />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50/50">
                            Select a table
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

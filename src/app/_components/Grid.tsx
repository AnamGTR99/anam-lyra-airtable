"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { api } from "~/trpc/react";

interface GridProps {
    tableId: string;
    count: number;
    columns?: Array<{ id: string, name: string, order: number, type: string }>;
}

export function GridContainer({ tableId, count, columns }: GridProps) {
    const parentRef = useRef<HTMLDivElement>(null);

    // Task 3: The Infinite Data Pipe
    // Fetch rows in batches of 100
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        api.row.listInfinite.useInfiniteQuery(
            { tableId, limit: 100 },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
            }
        );

    // Flatten the pages into a single array of rows
    const rows = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

    const rowVirtualizer = useVirtualizer({
        count: count, // Total count from DB
        getScrollElement: () => parentRef.current,
        estimateSize: () => 35,
        overscan: 20,
    });

    // Infinite Scroll Trigger
    useEffect(() => {
        const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

        if (!lastItem) {
            return;
        }

        if (
            lastItem.index >= rows.length - 1 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage();
        }
    }, [
        hasNextPage,
        fetchNextPage,
        rows.length,
        isFetchingNextPage,
        rowVirtualizer.getVirtualItems(),
    ]);

    const HEADER_HEIGHT = 35;
    // Default columns if none provided (Task 4a mock)
    const renderColumns = columns && columns.length > 0
        ? columns
        : Array.from({ length: 26 }).map((_, i) => ({ id: `mock_${i}`, name: `Column ${String.fromCharCode(65 + i)}`, order: i, type: 'TEXT' }));

    return (
        <div
            ref={parentRef}
            className="h-full w-full overflow-auto relative bg-white"
        >
            {/* Sticky Header */}
            <div
                className="sticky top-0 z-10 flex h-[35px] bg-[#f5f5f5] border-b border-[#e1e1e1] min-w-max"
                style={{ width: '100%' }}
            >
                <div className="w-[60px] border-r border-[#e1e1e1] flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500 bg-[#f5f5f5]">
                    #
                </div>

                {renderColumns.map((col) => (
                    <div
                        key={col.id}
                        className="w-[180px] border-r border-[#e1e1e1] flex-shrink-0 px-2 flex items-center text-[13px] font-medium text-[#666666] bg-[#f5f5f5]"
                    >
                        {col.name}
                    </div>
                ))}
            </div>

            {/* Virtual Content */}
            <div
                className="min-w-max"
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = rows[virtualRow.index];
                    const isLoaderRow = virtualRow.index > rows.length - 1;

                    return (
                        <div
                            key={virtualRow.key}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                            className={`flex border-b border-[#e1e1e1] bg-white ${isLoaderRow ? 'opacity-50' : 'hover:bg-gray-50'}`}
                        >
                            {/* Row Index */}
                            <div className="w-[60px] border-r border-[#e1e1e1] flex-shrink-0 flex items-center justify-center text-xs text-gray-400 bg-white">
                                {virtualRow.index + 1}
                            </div>

                            {renderColumns.map((col) => {
                                let cellValue = "";
                                if (row && !isLoaderRow) {
                                    // Safe cast since row.data is Json
                                    const rowData = row.data as Record<string, any>;
                                    cellValue = rowData[col.id] ? String(rowData[col.id]) : "";
                                    // If mock column, maybe show something else?
                                    if (col.id.startsWith("mock_")) {
                                        cellValue = `Mock ${col.name}`;
                                    }
                                }

                                return (
                                    <div
                                        key={col.id}
                                        className="w-[180px] border-r border-[#e1e1e1] flex-shrink-0 px-2 flex items-center text-[13px] text-[#111111] truncate"
                                    >
                                        {isLoaderRow ? (
                                            <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                                        ) : (
                                            cellValue
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

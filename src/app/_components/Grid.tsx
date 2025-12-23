"use client";

import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface GridProps {
    // We'll expand this interface in Phase 4b/4c
    count: number;
}

export function GridContainer({ count }: GridProps) {
    const parentRef = useRef<HTMLDivElement>(null);

    // Task 1: useVirtualizer with fixed item size of 35px
    const rowVirtualizer = useVirtualizer({
        count: count,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 35, // Matches --row-height
        overscan: 20, // Keep scrolling smooth
    });

    const HEADER_HEIGHT = 35; // Header matches row height for consistency

    return (
        // Task 1: Overflow container
        <div
            ref={parentRef}
            className="h-full w-full overflow-auto relative bg-white"
        >
            {/* Task 3: Sticky Header */}
            {/* Using min-width to force horizontal scroll if needed */}
            <div
                className="sticky top-0 z-10 flex h-[35px] bg-[#f5f5f5] border-b border-[#e1e1e1] min-w-max"
                style={{ width: '100%' }}
            >
                {/* Row Header Helper */}
                <div className="w-[60px] border-r border-[#e1e1e1] flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500 bg-[#f5f5f5]">
                    #
                </div>

                {/* Mock Columns (A-Z) */}
                {Array.from({ length: 26 }).map((_, i) => (
                    <div
                        key={i}
                        className="w-[180px] border-r border-[#e1e1e1] flex-shrink-0 px-2 flex items-center text-[13px] font-medium text-[#666666] bg-[#f5f5f5]"
                    >
                        Column {String.fromCharCode(65 + i)}
                    </div>
                ))}
            </div>

            {/* Virtual Content Container */}
            <div
                className="min-w-max"
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                    // Task 2: Absolute Row Positioning
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
                        className="flex border-b border-[#e1e1e1] hover:bg-gray-50 bg-white"
                    >
                        {/* Row Index */}
                        <div className="w-[60px] border-r border-[#e1e1e1] flex-shrink-0 flex items-center justify-center text-xs text-gray-400 bg-white">
                            {virtualRow.index + 1}
                        </div>

                        {/* Mock Cells using same width as header */}
                        {Array.from({ length: 26 }).map((_, i) => (
                            <div
                                key={i}
                                className="w-[180px] border-r border-[#e1e1e1] flex-shrink-0 px-2 flex items-center text-[13px] text-[#111111] truncate"
                            >
                                {/* Visual debug for scrolling */}
                                <span className="opacity-50 mr-2">{virtualRow.index + 1}</span>
                                Cell {String.fromCharCode(65 + i)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

"use client";

import {
    Grid,
    List,
    EyeOff,
    Filter,
    ArrowUpDown,
    Palette,
    Database,
    Search,
    Share2,
    Settings,
    Bell
} from "lucide-react";
import { api } from "~/trpc/react";
import { useState } from "react";

export function Toolbar({ tableId, onBulkInsert }: { tableId?: string, onBulkInsert?: () => void }) {
    const [isIngesting, setIsIngesting] = useState(false);
    const startBulkInsert = api.row.startBulkInsert.useMutation({
        onSuccess: (data) => {
            console.log("Job started:", data.jobId);
            setIsIngesting(true);
            if (onBulkInsert) onBulkInsert();
        }
    });

    const handleBulkInsert = () => {
        if (!tableId) return;
        startBulkInsert.mutate({ tableId, totalRows: 100000 });
    };

    return (
        <div className="flex items-center justify-between h-[48px] px-4 border-b border-[#e1e1e1] bg-white">
            {/* Left: View Controls */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[#f5f5f5] hover:bg-gray-200 rounded cursor-pointer transition-colors">
                    <Grid className="w-4 h-4 text-[#116df7]" />
                    <span className="text-[13px] font-medium text-[#111111]">Grid view</span>
                </div>

                <div className="h-4 border-r border-gray-300 mx-1" />

                <div className="flex items-center gap-1 text-[#464646]">
                    <ToolButton icon={EyeOff} label="Hide fields" />
                    <ToolButton icon={Filter} label="Filter" />
                    <ToolButton icon={List} label="Group" />
                    <ToolButton icon={ArrowUpDown} label="Sort" />
                    <ToolButton icon={Palette} label="Color" />
                    <ToolButton icon={Settings} label="Row height" />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-2 top-1.5 text-gray-400" />
                    <input
                        className="h-7 pl-8 pr-3 text-[13px] border border-gray-200 rounded-[3px] focus:outline-none focus:border-[#116df7] w-48 placeholder:text-gray-400"
                        placeholder="Find in view"
                    />
                </div>

                {/* The 100k Button */}
                <button
                    onClick={handleBulkInsert}
                    disabled={startBulkInsert.isPending || isIngesting || !tableId}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent hover:bg-gray-50 text-gray-600 rounded border border-gray-300 transition-colors disabled:opacity-50"
                >
                    <Database className="w-3.5 h-3.5" />
                    <span className="text-[13px] font-medium">
                        {startBulkInsert.isPending ? "Starting..." : isIngesting ? "Ingesting..." : "+ Add 100k rows"}
                    </span>
                </button>
            </div>
        </div>
    );
}

function ToolButton({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <button className="flex items-center gap-1.5 px-2 py-1 hover:bg-[#f5f5f5] rounded text-[13px] font-medium text-[#464646] transition-colors">
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
        </button>
    );
}

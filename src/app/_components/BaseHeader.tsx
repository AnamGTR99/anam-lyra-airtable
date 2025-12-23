"use client";

import {
    Users,
    History,
    HelpCircle,
    Bell,
    ChevronDown,
    Plus
} from "lucide-react";
import Link from "next/link";

interface BaseHeaderProps {
    baseName: string;
    tables: Array<{ id: string, name: string }>;
    activeTableId?: string;
}

export function BaseHeader({ baseName, tables, activeTableId }: BaseHeaderProps) {
    return (
        <div className="flex flex-col bg-[#116df7] text-white border-b border-[#e1e1e1]">
            {/* Top Bar: Data / Auto / Interfaces */}
            <div className="flex items-center justify-between h-[56px] px-4">
                <div className="flex items-center gap-4">
                    {/* Base Icon & Name */}
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-2 py-1 rounded">
                        <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-xs font-bold">
                            {baseName.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-[18px] tracking-tight">{baseName}</span>
                        <ChevronDown className="w-4 h-4 opacity-70" />
                    </div>

                    <div className="h-6 border-r border-white/20 mx-1" />

                    {/* Main Nav */}
                    <div className="flex items-center gap-1">
                        <NavTab label="Data" active />
                        <NavTab label="Automations" />
                        <NavTab label="Interfaces" />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-white/80">
                        <ActionIcon icon={History} />
                        <ActionIcon icon={HelpCircle} />
                        <ActionIcon icon={Bell} />
                    </div>

                    <div className="flex -space-x-1.5 overflow-hidden">
                        <div className="w-7 h-7 bg-orange-400 rounded-full border-2 border-[#116df7]" />
                        <div className="w-7 h-7 bg-pink-400 rounded-full border-2 border-[#116df7]" />
                    </div>

                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#20883d] hover:bg-green-700 text-white rounded-full text-[13px] font-medium shadow-sm transition-colors">
                        <Users className="w-3.5 h-3.5" />
                        <span>Share</span>
                    </button>

                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white/20">
                        AD
                    </div>
                </div>
            </div>

            {/* Table Tabs Bar */}
            <div className="flex items-center h-[40px] px-2 bg-[#1b62cc] overflow-x-auto scrollbar-hide">
                {tables.map(table => (
                    <div
                        key={table.id}
                        className={`
                            group flex items-center gap-2 px-4 h-[34px] rounded-t-sm cursor-pointer min-w-max text-[13px] select-none
                            ${(activeTableId === table.id)
                                ? 'bg-white text-[#111111] font-medium'
                                : 'text-white/90 hover:bg-white/10'}
                        `}
                    >
                        <span>{table.name}</span>
                        {(activeTableId === table.id) && (
                            <ChevronDown className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                        )}
                    </div>
                ))}

                {/* Add Table Button */}
                <div className="flex items-center justify-center w-8 h-[34px] text-white/70 hover:bg-white/10 cursor-pointer rounded ml-1">
                    <Plus className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
}

function NavTab({ label, active }: { label: string, active?: boolean }) {
    return (
        <div className={`px-4 py-1.5 rounded-full text-[13px] font-medium cursor-pointer transition-colors ${active ? 'bg-black/10' : 'hover:bg-white/10'}`}>
            {label}
        </div>
    );
}

function ActionIcon({ icon: Icon }: { icon: any }) {
    return (
        <div className="p-2 hover:bg-white/10 rounded-full cursor-pointer">
            <Icon className="w-4 h-4" />
        </div>
    );
}

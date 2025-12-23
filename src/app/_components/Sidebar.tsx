"use client";

import { api } from "~/trpc/react";
import Link from "next/link";
import {
    Home,
    Star,
    Library,
    Plus,
    ChevronDown
} from "lucide-react";
import { Skeleton } from "~/app/_components/Skeleton";

export function Sidebar({ className }: { className?: string }) {
    const { data: bases, isLoading } = api.base.list.useQuery();

    return (
        <div className={`flex flex-col h-screen border-r border-[#e1e1e1] bg-[#f5f5f5] w-[240px] ${className}`}>
            {/* Top Navigation */}
            <div className="flex flex-col pt-4 px-2 space-y-1">
                <NavItem icon={Home} label="Home" active />
                {/* <NavItem icon={Star} label="Starred" /> */}
            </div>

            <div className="my-4 border-t border-gray-200" />

            {/* Workspaces */}
            <div className="flex-1 overflow-y-auto px-2">
                <div className="flex items-center justify-between px-3 py-2 text-[#666666] text-[13px] font-medium cursor-pointer hover:bg-black/5 rounded">
                    <span>Workspaces</span>
                    <ChevronDown className="w-4 h-4" />
                </div>

                {isLoading ? (
                    <div className="px-3 mt-2 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-5 w-2/3" />
                    </div>
                ) : (
                    <div className="mt-1 space-y-0.5">
                        {bases?.map((base) => (
                            <Link
                                key={base.id}
                                href={`/base/${base.id}`}
                                className="block px-3 py-1.5 text-[13px] text-[#111111] hover:bg-black/5 rounded truncate"
                            >
                                {base.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Button */}
            <div className="p-4 border-t border-[#e1e1e1]">
                <button className="flex items-center justify-center w-full gap-2 px-4 py-2 bg-[#116df7] hover:bg-[#0d5dd6] text-white text-[13px] font-medium rounded shadow-sm transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Create</span>
                </button>
            </div>
        </div>
    );
}

function NavItem({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer ${active ? 'bg-white shadow-sm text-[#116df7]' : 'text-[#111111] hover:bg-black/5'}`}>
            <Icon className={`w-4 h-4 ${active ? 'text-[#116df7]' : 'text-[#666666]'}`} />
            <span className="text-[13px] font-medium">{label}</span>
        </div>
    );
}

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
        <div className={`w-[260px] flex-shrink-0 h-full bg-[#f5f5f5] border-r border-[#e1e1e1] flex flex-col ${className}`}>
            {/* Top Navigation */}
            <div className="flex flex-col pt-4 px-2 space-y-1">
                <NavItem icon={Home} label="Home" active />
                <NavItem icon={Star} label="Starred" />
            </div>

            <div className="my-4 border-t border-[#e1e1e1]" />

            {/* Workspaces */}
            <div className="flex-1 overflow-y-auto px-2">
                <div className="flex items-center justify-between px-3 py-2 text-[#666666] text-[14px] font-medium cursor-pointer hover:bg-black/5 rounded">
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
                                className="block px-3 py-1.5 text-[14px] text-[#111111] hover:bg-black/5 rounded truncate"
                            >
                                {base.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Button */}
            <button className="mt-auto m-4 bg-[#116df7] hover:bg-[#0e59ca] text-white rounded-full py-2 px-6 flex items-center justify-center font-medium">
                <Plus className="w-4 h-4 mr-2" />
                <span>Create</span>
            </button>
        </div>
    );
}

function NavItem({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer ${active ? 'bg-white shadow-sm text-[#116df7]' : 'text-[#666666] hover:bg-black/5'}`}>
            <Icon className={`w-4 h-4 ${active ? 'text-[#116df7]' : 'text-[#666666]'}`} />
            <span className="text-[14px] font-medium">{label}</span>
        </div>
    );
}

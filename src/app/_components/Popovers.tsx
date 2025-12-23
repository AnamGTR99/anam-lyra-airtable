import { X, Plus, Trash2 } from "lucide-react";

export function FilterPopover() {
    return (
        <div className="w-[320px] bg-white rounded-[8px] border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-[13px] text-gray-500">
                <span>In this view, show records</span>
                <X className="w-4 h-4 cursor-pointer hover:bg-gray-100 rounded" />
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[13px]">
                    <span className="text-gray-500 w-12">Where</span>
                    <div className="flex-1 h-8 border border-gray-200 rounded px-2 flex items-center bg-gray-50">Name</div>
                    <div className="w-24 h-8 border border-gray-200 rounded px-2 flex items-center bg-gray-50">contains</div>
                </div>
                <div className="ml-[60px] h-8 border border-gray-200 rounded px-2 flex items-center shadow-sm">
                    <input className="w-full h-full outline-none text-[13px]" placeholder="Enter value" />
                </div>
            </div>

            <div className="flex items-center gap-2 pt-2 text-[#2d7ff9] text-[13px] font-medium cursor-pointer hover:underline">
                <Plus className="w-4 h-4" />
                <span>Add condition</span>
            </div>
        </div>
    );
}

export function SortPopover() {
    return (
        <div className="w-[320px] bg-white rounded-[8px] border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-[13px] text-gray-500">
                <span>In this view, sort by</span>
                <X className="w-4 h-4 cursor-pointer hover:bg-gray-100 rounded" />
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[13px]">
                    <div className="flex-1 h-8 border border-gray-200 rounded px-2 flex items-center bg-gray-50">Order</div>
                    <div className="w-24 h-8 border border-gray-200 rounded px-2 flex items-center bg-gray-50">1 → 9</div>
                    <Trash2 className="w-4 h-4 text-gray-400 cursor-pointer" />
                </div>
            </div>

            <div className="flex items-center gap-2 pt-2 text-[#2d7ff9] text-[13px] font-medium cursor-pointer hover:underline">
                <Plus className="w-4 h-4" />
                <span>Add sort</span>
            </div>
        </div>
    );
}

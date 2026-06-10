import React from "react";
import * as Icons from "lucide-react";

interface HistoryTrackingProps {
  skuId: string;
}

export function HistoryTracking({ skuId }: HistoryTrackingProps) {
  const mockHistory = [
    {
      date: "2023-11-20 14:15",
      user: "Admin User",
      action: "Created SKU Code",
    },
    {
      date: "2023-11-22 09:45",
      user: "Store Manager",
      action: "Updated Dimensions",
    },
    { date: "2023-11-25 10:30", user: "System", action: "Changed Base Unit" },
    {
      date: "2023-11-28 16:20",
      user: "Store Manager",
      action: "Auto-updated Weight",
    },
    {
      date: "2023-12-01 11:00",
      user: "Admin User",
      action: "Modified Product Details",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaeaec] space-y-4 col-span-1 md:col-span-2">
      <h4 className="text-[12px] font-black text-[#212c46] uppercase border-b border-[#eaeaec] pb-2 flex items-center gap-2">
        <Icons.History size={14} className="text-[#3f809e]" /> History Tracking
      </h4>
      <div className="space-y-4">
        {mockHistory.map((item, idx) => (
          <div
            key={idx}
            className="flex gap-3 text-sm border-b border-gray-100 last:border-0 pb-3 last:pb-0"
          >
            <div className="flex flex-col items-center mt-1">
              <div className="w-2 h-2 rounded-full bg-[#b7a159]"></div>
              {idx !== mockHistory.length - 1 && (
                <div className="w-[1px] h-full bg-gray-200 mt-1"></div>
              )}
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#212c46]">
                {item.action}
              </p>
              <p className="text-[10px] uppercase font-bold text-[#7a8b95]">
                {item.date} • {item.user}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

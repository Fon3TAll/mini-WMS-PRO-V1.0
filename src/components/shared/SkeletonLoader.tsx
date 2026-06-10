import React from "react";
import { Loader2 } from "lucide-react";

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col p-4 sm:p-6 lg:p-8 overflow-hidden bg-[#f3f3f1]">
      <div className="flex items-center justify-between mb-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-md w-1/4"></div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-between border border-white/60 animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 w-8 bg-gray-100 rounded-full"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
          </div>
        ))}
      </div>

      <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-white/60 animate-pulse flex flex-col">
        <div className="h-6 bg-gray-200 rounded w-1/5 mb-6"></div>
        <div className="space-y-4 flex-1">
          <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
          <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
          <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
          <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
          <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#922724] animate-spin opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;

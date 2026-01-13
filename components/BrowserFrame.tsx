import { ReactNode } from "react";

interface BrowserFrameProps {
  children: ReactNode;
  className?: string;
}

export function BrowserFrame({ children, className = "" }: BrowserFrameProps) {
  return (
    <div className={`rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden ${className}`}>
      {/* Browser Bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-50 border-b border-zinc-200">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
          <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
          <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
        </div>
      </div>
      {/* Content */}
      <div className="bg-white">
        {children}
      </div>
    </div>
  );
}


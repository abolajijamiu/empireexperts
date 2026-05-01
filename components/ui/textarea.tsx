import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={cn(
            "w-full min-h-[100px] px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 resize-y",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "transition-colors duration-150",
            error && "border-red-400 focus:ring-red-400",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };

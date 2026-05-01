import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "w-full h-11 px-4 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "transition-colors duration-150",
            "disabled:bg-slate-50 disabled:cursor-not-allowed",
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

Input.displayName = "Input";

export { Input };

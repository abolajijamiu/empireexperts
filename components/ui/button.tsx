"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500";

    const variants = {
      default:
        "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm",
      outline:
        "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300",
      ghost: "text-slate-700 hover:bg-slate-100",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      link: "text-blue-600 hover:underline p-0 h-auto font-medium",
    };

    const sizes = {
      default: "h-11 px-6 text-sm",
      sm: "h-9 px-4 text-sm",
      lg: "h-13 px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <Comp
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };

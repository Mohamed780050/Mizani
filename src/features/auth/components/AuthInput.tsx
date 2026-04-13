import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string[] | string;
}

export function AuthInput({ label, error, className, ...props }: AuthInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">
        {label}
      </label>
      <Input
        className={cn(
          "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 outline-none transition-all duration-200 focus:border-white/20 focus:bg-white/10 focus:ring-4 focus:ring-white/5 disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/5",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
}

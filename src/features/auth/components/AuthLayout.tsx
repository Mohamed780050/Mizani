import React from "react";
import { useLocale } from "next-intl";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className={`mb-8 ${isRtl ? "text-right" : "text-left"}`}>
            <h1 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
              {title}
            </h1>
            {description && (
              <p className="text-zinc-400 text-sm">
                {description}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

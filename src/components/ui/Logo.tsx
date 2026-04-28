import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 32, height = 32, className }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="Mizani Logo"
      width={width}
      height={height}
      className={cn("invert-0 dark:invert", className)}
    />
  );
}

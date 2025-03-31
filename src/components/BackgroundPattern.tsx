import { cn } from "@/lib/utils";

interface BackgroundPatternProps {
  className?: string;
  variant?: "light" | "dark";
}

export function BackgroundPattern({
  className,
  variant = "light",
}: BackgroundPatternProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 -z-10",
        variant === "light"
          ? "bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"
          : "bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem]",
        className
      )}
    />
  );
}

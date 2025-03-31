"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto py-4 flex justify-between items-center">
        <Link href="/" className="text-primary font-bold text-xl relative">
          <span className="relative z-10">Smart Library Assistant</span>
          <span className="absolute bottom-0 left-0 w-full h-2 bg-primary/10 -z-10 rounded-full"></span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors relative",
              isActive("/")
                ? "text-primary"
                : "text-foreground/80 hover:text-primary"
            )}
          >
            {isActive("/") && (
              <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
            Home
          </Link>
          <Link
            href="/about"
            className={cn(
              "text-sm font-medium transition-colors relative",
              isActive("/about")
                ? "text-primary"
                : "text-foreground/80 hover:text-primary"
            )}
          >
            {isActive("/about") && (
              <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
            About
          </Link>
          <Link
            href="/chat"
            className={cn(
              "text-sm font-medium transition-colors relative",
              isActive("/chat")
                ? "text-primary"
                : "text-foreground/80 hover:text-primary"
            )}
          >
            {isActive("/chat") && (
              <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
            Chat
          </Link>
          <Link
            href="/dataset"
            className={cn(
              "text-sm font-medium transition-colors relative",
              isActive("/dataset")
                ? "text-primary"
                : "text-foreground/80 hover:text-primary"
            )}
          >
            {isActive("/dataset") && (
              <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
            Dataset
          </Link>

          <ThemeToggle />

          <Button asChild variant="outline">
            <Link href="/login">Login</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { BackgroundPattern } from "@/components/BackgroundPattern";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center py-24 relative">
        {/* Background pattern */}
        <BackgroundPattern />

        <div className="container mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-9xl font-bold text-primary/20">404</h1>
            <h2 className="text-3xl font-bold text-primary">Page Not Found</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It
              might have been moved or doesn&apos;t exist.
            </p>
          </div>

          <Button asChild size="lg" className="shadow-md">
            <Link href="/" className="inline-flex items-center gap-2">
              <Home className="h-4 w-4" /> Return to Home
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

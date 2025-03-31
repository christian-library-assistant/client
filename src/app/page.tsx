import Link from "next/link";
import { ArrowRight, Book, Search, ArrowUpRight, Quote } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeatureCard } from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { BackgroundPattern } from "@/components/BackgroundPattern";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero section */}
      <section className="relative flex-1 flex flex-col items-center justify-center py-24 overflow-hidden">
        {/* Background pattern */}
        <BackgroundPattern />

        <div className="container mx-auto text-center space-y-8 relative">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-primary relative inline-block">
              <span className="relative z-10">Ask. Retrieve. Understand.</span>
              <span className="absolute bottom-2 left-0 w-full h-4 bg-primary/10 -z-10 transform -rotate-1"></span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Conversational access to Christian Classics
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Button size="lg" asChild className="shadow-md">
              <Link href="/chat" className="inline-flex items-center gap-2">
                Start Chatting <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="shadow-sm">
              <Link href="/learn-more">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-24 bg-secondary/5">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary mb-16 relative inline-block mx-auto">
            <span className="relative z-10">Key Features</span>
            <span className="absolute bottom-0 left-0 w-full h-2 bg-primary/10 -z-10"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Book className="h-6 w-6 text-primary" />}
              title="Theological Expertise"
              description="Access insights from centuries of Christian theological works with natural language queries."
            />
            <FeatureCard
              icon={<Search className="h-6 w-6 text-primary" />}
              title="CCEL Dataset Integration"
              description="Powered by the comprehensive Christian Classics Ethereal Library collection."
            />
            <FeatureCard
              icon={<ArrowUpRight className="h-6 w-6 text-primary" />}
              title="AI-Powered Smart Search"
              description="Semantic search capabilities that understand the context of your theological inquiries."
            />
            <FeatureCard
              icon={<Quote className="h-6 w-6 text-primary" />}
              title="Auto-Citation with Source"
              description="Every insight comes with proper attribution to its original source text."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

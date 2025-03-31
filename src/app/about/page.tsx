import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Code, GraduationCap } from "lucide-react";
import { BackgroundPattern } from "@/components/BackgroundPattern";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background pattern */}
        <BackgroundPattern />

        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-primary mb-6 relative inline-block">
              <span className="relative z-10">About Our Project</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/10 -z-10 transform -rotate-1"></span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Smart Library Assistant provides conversational access to
              centuries of Christian theological works, making historical wisdom
              accessible through modern AI technology.
            </p>
          </div>
        </div>
      </section>

      {/* Mission section */}
      <section className="py-16 bg-secondary/5">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Our Mission
            </h2>
            <p className="text-muted-foreground mb-6">
              The Smart Library Assistant project aims to bridge the gap between
              historical Christian texts and contemporary readers by leveraging
              artificial intelligence to provide intuitive, conversational
              access to theological wisdom spanning centuries.
            </p>
            <p className="text-muted-foreground mb-6">
              We believe that the insights contained in classic Christian
              literature remain profoundly relevant today, but recognize that
              archaic language, complex theological concepts, and the sheer
              volume of available texts can create barriers to engagement.
            </p>
            <p className="text-muted-foreground">
              By combining the comprehensive Christian Classics Ethereal Library
              with state-of-the-art natural language processing, we&apos;re
              creating a tool that allows users to explore, understand, and
              apply theological insights through natural conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-primary mb-10 text-center">
            Key Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FeatureBlock
              icon={<BookOpen className="h-6 w-6 text-primary" />}
              title="Faithful Representation"
              description="We prioritize accurate representation of source texts, ensuring theological integrity in all interactions."
            />
            <FeatureBlock
              icon={<Users className="h-6 w-6 text-primary" />}
              title="Accessibility"
              description="Making theological wisdom accessible to everyone, regardless of their background or expertise."
            />
            <FeatureBlock
              icon={<Code className="h-6 w-6 text-primary" />}
              title="Technological Innovation"
              description="Leveraging cutting-edge AI to create intuitive, natural interactions with historical texts."
            />
            <FeatureBlock
              icon={<GraduationCap className="h-6 w-6 text-primary" />}
              title="Educational Focus"
              description="Designed as a learning tool to deepen understanding of Christian theology and history."
            />
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="py-16 bg-secondary/5">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-primary mb-10 text-center">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <TeamMember name="David Kim" role="Developer" bio="TBD" />
            <TeamMember name="Jeton Cesaj" role="Developer" bio="TBD" />
            <TeamMember name="Zhonglin (Loya) Niu" role="Developer" bio="TBD" />
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-primary mb-6 text-center">
              Project Advisor
            </h3>
            <div className="max-w-md mx-auto">
              <TeamMember
                name="Harry Plantinga"
                role="Project Advisor"
                bio="Director of the Christian Classics Ethereal Library (CCEL) and Professor of Computer Science at Calvin University."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Ready to Explore?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start a conversation with Smart Library Assistant and discover the
            depth and richness of Christian theological tradition.
          </p>
          <Button asChild size="lg" className="shadow-md">
            <Link href="/chat" className="inline-flex items-center gap-2">
              Start Chatting <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureBlock({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 p-3 bg-primary/10 rounded-full h-fit">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function TeamMember({
  name,
  role,
  bio,
}: {
  name: string;
  role: string;
  bio: string;
}) {
  return (
    <div className="bg-card border border-secondary/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <h3 className="font-semibold text-lg mb-1">{name}</h3>
      <p className="text-primary/80 text-sm mb-3">{role}</p>
      <p className="text-muted-foreground text-sm">{bio}</p>
    </div>
  );
}

import Link from "next/link";
import { SiGithub } from "@icons-pack/react-simple-icons";

export function Footer() {
  return (
    <footer className="bg-primary dark:bg-slate-800 text-primary-foreground dark:text-white py-16 relative overflow-hidden">
      <div className="container mx-auto text-center relative z-10">
        <h2 className="text-2xl font-semibold mb-2">Smart Library Assistant</h2>
        <p className="text-primary-foreground/70 dark:text-gray-200 mb-8 max-w-md mx-auto">
          Conversational access to Christian Classics
        </p>
        <div className="flex items-center justify-center gap-6 mb-8">
          <Link
            href="https://github.com/christian-library-assistant/"
            className="text-primary-foreground/70 dark:text-gray-300 hover:text-primary-foreground dark:hover:text-white flex items-center gap-2 transition-colors"
          >
            <SiGithub className="h-6 w-6" />
            GitHub
          </Link>
          <Link
            href="https://calvin.edu"
            className="text-primary-foreground/70 dark:text-gray-300 hover:text-primary-foreground dark:hover:text-white transition-colors"
          >
            Calvin University
          </Link>
        </div>
        <p className="text-sm text-primary-foreground/60 dark:text-gray-400">
          © 2025 Smart Library Assistant. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

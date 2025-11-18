import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User, Bot, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { marked } from "marked";

interface Source {
  record_id: string;
  link: string;
  citation_text: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: Source[];
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  // Function to highlight sources in the message content
  const highlightSources = (text: string, sources: Source[] = []) => {
    if (!sources || sources.length === 0) return text;

    let processedText = text;

    // Handle superscript-style citations: [[N]](#source-N)
    // This creates academic-style numbered citations
    const superscriptPattern = /\[\[(\d+)\]\]\(#source-(\d+)\)/g;
    processedText = processedText.replace(superscriptPattern, (match, displayNum, sourceNum) => {
      const sourceIndex = parseInt(sourceNum) - 1;
      if (sourceIndex >= 0 && sourceIndex < sources.length) {
        const source = sources[sourceIndex];
        return `<sup><a href="${source.link}" target="_blank" rel="noopener noreferrer" class="inline-citation">[${displayNum}]</a></sup>`;
      }
      return `<sup>[${displayNum}]</sup>`; // Fallback if source not found
    });

    // Handle markdown-style anchor links: [citation text](#source-N)
    // Convert to external links to the actual CCEL website
    const markdownLinkPattern = /\[([^\]]+)\]\(#source-(\d+)\)/g;
    processedText = processedText.replace(markdownLinkPattern, (match, linkText, sourceNum) => {
      const sourceIndex = parseInt(sourceNum) - 1;
      if (sourceIndex >= 0 && sourceIndex < sources.length) {
        const source = sources[sourceIndex];
        return `<a href="${source.link}" target="_blank" rel="noopener noreferrer" class="inline-citation">${linkText}</a>`;
      }
      return linkText; // Fallback if source not found
    });

    // Also handle bare anchor references: #source-N (without brackets)
    // This is a fallback for when the agent doesn't use proper markdown format
    const bareAnchorPattern = /#source-(\d+)/g;
    processedText = processedText.replace(bareAnchorPattern, (match, sourceNum) => {
      const sourceIndex = parseInt(sourceNum) - 1;
      if (sourceIndex >= 0 && sourceIndex < sources.length) {
        const source = sources[sourceIndex];
        return `<a href="${source.link}" target="_blank" rel="noopener noreferrer" class="inline-citation">[Source ${sourceNum}]</a>`;
      }
      return `[Source ${sourceNum}]`; // Fallback if source not found
    });

    // Then, handle plain text citations: (Author, Work)
    sources.forEach((source, index) => {
      const citation = source.citation_text;
      // Escape special regex characters
      const escapedCitation = citation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`\\(${escapedCitation}\\)`, 'g');

      processedText = processedText.replace(pattern,
        `(<a href="${source.link}" target="_blank" rel="noopener noreferrer" class="inline-citation">${citation}</a>)`
      );
    });

    return processedText;
  };

  // Process content: first highlight sources, then convert markdown to HTML
  const processedContent = !isUser
    ? highlightSources(message.content, message.sources)
    : message.content;

  // Convert markdown to HTML for assistant messages
  const htmlContent = !isUser
    ? marked.parse(processedContent, { async: false }) as string
    : processedContent;

  return (
    <div className="flex flex-col space-y-3">
      <div
        className={cn(
          "flex items-start gap-3",
          isUser ? "flex-row-reverse justify-start ml-auto" : ""
        )}
      >
        <Avatar className={cn("h-8 w-8 flex-shrink-0")}>
          <AvatarFallback
            className={isUser ? "bg-primary/10" : "bg-secondary/10"}
          >
            {isUser ? (
              <User className="h-4 w-4 text-primary" />
            ) : (
              <Bot className="h-4 w-4 text-primary" />
            )}
          </AvatarFallback>
        </Avatar>

        <div
          className={cn(
            "rounded-lg px-4 py-2.5 text-sm max-w-[100%]",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          {!isUser ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none break-words [&_.inline-citation]:text-blue-600 [&_.inline-citation]:no-underline [&_.inline-citation]:font-medium hover:[&_.inline-citation]:underline dark:[&_.inline-citation]:text-blue-400 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_p]:my-2"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}
          <div
            className={cn(
              "text-xs mt-1 opacity-70",
              isUser ? "text-primary-foreground" : "text-muted-foreground"
            )}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

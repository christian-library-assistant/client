import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User, Bot, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const processedContent = !isUser ? highlightSources(message.content, message.sources) : message.content;

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
          {!isUser && message.sources && message.sources.length > 0 ? (
            <div
              className="whitespace-pre-wrap break-words [&_.inline-citation]:text-blue-600 [&_.inline-citation]:no-underline [&_.inline-citation]:font-medium hover:[&_.inline-citation]:underline dark:[&_.inline-citation]:text-blue-400"
              dangerouslySetInnerHTML={{ __html: processedContent }}
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

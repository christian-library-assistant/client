import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User, Bot, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Reference {
  id: number;
  knn_distance: number;
  title: string;
  text: string;
  refs: string[];
  author: string;
  rights: string;
  published: string;
  record_id: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  references?: Reference[];
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

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
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
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

      {/* References Section */}
      {!isUser && message.references && message.references.length > 0 && (
        <div className="pl-11 space-y-3">
          {message.references.map((reference) => (
            <div
              key={reference.id}
              className="border rounded-lg p-3 bg-background shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">
                    {reference.title || "Untitled Reference"}
                  </h4>
                </div>
                {reference.record_id && (
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">Source</span>
                  </Button>
                )}
              </div>

              {reference.author && (
                <p className="text-xs text-muted-foreground mt-1">
                  By {reference.author}{" "}
                  {reference.published && `(${reference.published})`}
                </p>
              )}

              <blockquote className="mt-2 pl-3 border-l-2 border-muted italic text-sm">
                {reference.text || "No content available"}
              </blockquote>

              {reference.rights && (
                <p className="text-xs text-muted-foreground mt-2">
                  Rights: {reference.rights}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

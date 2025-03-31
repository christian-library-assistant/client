import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({
  onSendMessage,
  isLoading,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus the input field when loading state changes to false
  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate new height (scrollHeight includes padding)
    const lineHeight = 24; // Approximate line height in pixels
    const minHeight = lineHeight * 2; // Minimum 2 lines
    const maxHeight = lineHeight * 7; // Maximum 7 lines

    const newHeight = Math.min(
      Math.max(textarea.scrollHeight, minHeight),
      maxHeight
    );

    textarea.style.height = `${newHeight}px`;
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        onSendMessage(message);
        setMessage("");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-4xl mx-auto">
      <div className="relative rounded-xl border bg-background shadow-sm">
        <div className="flex items-center px-2 border-b">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            <Plus className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div className="h-6 mx-2 border-l border-muted"></div>
          {/* Additional format buttons could be added here */}
        </div>

        <div className="flex items-end">
          <textarea
            ref={textareaRef}
            className="flex-1 min-h-[64px] max-h-[168px] resize-none px-3 py-3 border-0 bg-transparent focus:outline-none"
            placeholder="Ask about literature or search for references..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={2}
            style={{
              scrollbarWidth: "thin",
              overflowY: message.split("\n").length > 7 ? "auto" : "hidden",
            }}
          />
          <div className="p-2">
            <Button
              type="submit"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full transition-colors",
                !message.trim() ? "bg-muted text-muted-foreground" : ""
              )}
              disabled={isLoading || !message.trim()}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

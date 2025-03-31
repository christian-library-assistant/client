"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import { Header } from "@/components/Header";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  references?: Reference[];
}

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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      role: "assistant",
      content:
        "Hello! I'm your Smart Library Assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [lastUserMessageId, setLastUserMessageId] = useState<string | null>(
    null
  );

  // Scroll to position the latest user message at the top when messages change
  useEffect(() => {
    if (messagesContainerRef.current && lastUserMessageId) {
      const userMessageElement = document.getElementById(lastUserMessageId);
      if (userMessageElement) {
        // Get the positions
        const containerTop =
          messagesContainerRef.current.getBoundingClientRect().top;
        const messageTop = userMessageElement.getBoundingClientRect().top;
        const scrollOffset = messageTop - containerTop;

        // Use smooth scrolling
        messagesContainerRef.current.scrollBy({
          top: scrollOffset,
          behavior: "smooth",
        });
      }
    }
  }, [messages, lastUserMessageId]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Generate unique ID
    const id = Date.now().toString();
    setLastUserMessageId(id);

    // Add user message
    const userMessage: Message = {
      id,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Make API call to the provided endpoint
      const apiUrl = `/api/classify.php?text=${encodeURIComponent(content)}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const references = (await response.json()) as Reference[];

      // Create response message with references
      let responseContent = "Here are some relevant references I found:";

      if (references.length === 0) {
        responseContent =
          "I couldn't find any relevant references for your query.";
      }

      // Add assistant reply
      const assistantMessage: Message = {
        id: `response-${id}`,
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        references: references.slice(0, 5), // Limit to first 5 references
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message
      const errorMessage: Message = {
        id: `error-${id}`,
        role: "assistant",
        content:
          "Sorry, I encountered an error while processing your request. Please try again later.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] overflow-hidden">
      <Header />

      <div className="mt-4 flex-1 flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-4xl flex flex-col flex-1 overflow-hidden">
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
          >
            {messages.map((message) => (
              <div key={message.id} id={message.id}>
                <ChatMessage message={message} />
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 opacity-70">
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                <span className="text-sm text-muted-foreground">
                  Thinking...
                </span>
              </div>
            )}
          </div>

          <div className="px-4 py-4 pb-6 border-t">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

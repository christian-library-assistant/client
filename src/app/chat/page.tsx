"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import { Header } from "@/components/Header";
import SourcesAccordion from "@/components/chat/SourcesAccordion";
import { generateMockResponse } from "@/lib/mockData";
import { queryChatApi, ApiResponse } from "@/lib/apiService";

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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      role: "assistant",
      content: "Hello! I'm your Smart Library Assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [lastUserMessageId, setLastUserMessageId] = useState<string | null>(null);

  // Scroll to position the latest user message at the top when messages change
  useEffect(() => {
    if (messagesContainerRef.current && lastUserMessageId) {
      const userMessageElement = document.getElementById(lastUserMessageId);
      if (userMessageElement) {
        // Get the positions
        const containerTop = messagesContainerRef.current.getBoundingClientRect().top;
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

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let responseData: ApiResponse;

      if (useMockData) {
        // Use mock data from the generateMockResponse function
        responseData = generateMockResponse(content, conversationHistory);
      } else {
        // Make API call using the apiService
        responseData = await queryChatApi(content, conversationHistory);
      }

      const rspContent = responseData.answer;
      setConversationHistory(responseData.conversation_history);

      // Add assistant reply with sources
      const assistantMessage: Message = {
        id: `response-${id}`,
        role: "assistant",
        content: rspContent,
        timestamp: new Date(),
        sources: responseData.sources,
      };

      setMessages(prev => [...prev, assistantMessage]);
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

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMockData = () => {
    setUseMockData(!useMockData);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] overflow-hidden">
      <Header />

      <div className="mt-4 flex-1 flex flex-col items-center overflow-hidden">
        {/* Mock data toggle */}
        <div className="w-full max-w-4xl mb-2 px-4 flex justify-end">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Use mock data:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useMockData}
                onChange={toggleMockData}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="w-full max-w-4xl flex flex-col flex-1 overflow-hidden">
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map(message => (
              <div key={message.id} id={message.id} className="w-full">
                <ChatMessage message={message} />
                {message.sources && message.sources.length > 0 && (
                  <div className={message.role === "user" ? "pl-0 pr-14" : "pl-14 pr-0"}>
                    <SourcesAccordion sources={message.sources} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 opacity-70">
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            )}
          </div>

          <div className="px-4 py-4 pb-6 border-t">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput, { ChatInputRef } from "@/components/chat/ChatInput";
import { Header } from "@/components/Header";
import SourcesAccordion from "@/components/chat/SourcesAccordion";
import FilterPanel from "@/components/chat/FilterPanel";
import { generateMockResponse } from "@/lib/mockData";
import {
  queryAgentApi,
  ApiResponse,
  generateSessionId,
  resetSession,
  deleteSession,
  getSessionStatus,
  SessionStatusResponse
} from "@/lib/apiService";
import { Button } from "@/components/ui/button";
import { RotateCcw, Plus, Users } from "lucide-react";

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
      content: "Hello! I'm your Christian Library Assistant. How can I help you with theological research today?",
      timestamp: new Date(),
    },
  ]);
  const [sessionId, setSessionId] = useState<string>(() => {
    // Try to get existing session from localStorage, or generate new one
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cla-session-id');
      if (saved) return saved;
    }
    return generateSessionId();
  });
  const [sessionStatus, setSessionStatus] = useState<SessionStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedWorks, setSelectedWorks] = useState<string[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<ChatInputRef>(null);
  const [lastUserMessageId, setLastUserMessageId] = useState<string | null>(null);

  // Save session ID to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cla-session-id', sessionId);
    }
  }, [sessionId]);

  // Fetch session status on component mount and when session changes
  useEffect(() => {
    if (!useMockData && sessionId) {
      getSessionStatus(sessionId)
        .then((status) => {
          // Check if session exists
          if (status.exists === false) {
            // Session expired or doesn't exist
            console.log('Session not found or expired, will create new one on next query');
            setSessionStatus(null);
          } else {
            setSessionStatus(status);
          }
        })
        .catch(() => {
          // Session might not exist yet, which is fine
          setSessionStatus(null);
        });
    }
  }, [sessionId, useMockData]);

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
        responseData = generateMockResponse(content, [], sessionId);
      } else {
        // Make API call using the new agent API with session management and filters
        responseData = await queryAgentApi(
          content,
          sessionId,
          selectedAuthors.length > 0 ? selectedAuthors : undefined,
          selectedWorks.length > 0 ? selectedWorks : undefined
        );

        // Update session ID if server returned a new one (e.g., after session expiry)
        if (responseData.session_id && responseData.session_id !== sessionId) {
          console.log(`Session updated from ${sessionId} to ${responseData.session_id}`);
          setSessionId(responseData.session_id);
        }
      }

      const rspContent = responseData.answer;

      // Update session status after successful response
      if (!useMockData) {
        const currentSessionId = responseData.session_id || sessionId;
        getSessionStatus(currentSessionId)
          .then(setSessionStatus)
          .catch(console.error);
      }

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

      // Add error message with more specific error handling
      const errorMessage: Message = {
        id: `error-${id}`,
        role: "assistant",
        content: error instanceof Error ?
          error.message :
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

  const handleResetSession = async () => {
    if (useMockData) {
      // For mock data, just clear messages and UI state
      setMessages([
        {
          id: "welcome-message",
          role: "assistant",
          content: "Hello! I'm your Christian Library Assistant. How can I help you with theological research today?",
          timestamp: new Date(),
        },
      ]);

      // Clear input field and reset UI state
      chatInputRef.current?.clear();
      setLastUserMessageId(null);

      // Scroll to top
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }

      // Focus input field
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 100);

      return;
    }

    try {
      setIsLoading(true);
      await resetSession(sessionId);

      // Clear messages and reset to welcome message
      setMessages([
        {
          id: "welcome-message",
          role: "assistant",
          content: "Hello! I'm your Christian Library Assistant. How can I help you with theological research today?",
          timestamp: new Date(),
        },
      ]);

      // Clear input field and reset UI state
      chatInputRef.current?.clear();
      setLastUserMessageId(null);

      // Scroll to top
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }

      // Refresh session status
      const status = await getSessionStatus(sessionId);
      setSessionStatus(status);

      // Focus input field
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error("Error resetting session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSession = async () => {
    try {
      setIsLoading(true);

      // Delete old session if not using mock data
      if (!useMockData) {
        await deleteSession(sessionId);
      }

      // Generate new session ID
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);

      // Clear messages and reset to welcome message
      setMessages([
        {
          id: "welcome-message",
          role: "assistant",
          content: "Hello! I'm your Christian Library Assistant. How can I help you with theological research today?",
          timestamp: new Date(),
        },
      ]);

      // Clear input field and reset UI state
      chatInputRef.current?.clear();
      setLastUserMessageId(null);

      // Scroll to top
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }

      setSessionStatus(null);

      // Focus input field
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error("Error creating new session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] overflow-hidden">
      <Header />

      <div className="mt-4 flex-1 flex flex-col items-center overflow-hidden">
        {/* Controls panel */}
        <div className="w-full max-w-4xl mb-2 px-4 flex justify-between items-center">
          {/* Session info and controls */}
          <div className="flex items-center space-x-4">
            {!useMockData && sessionStatus && sessionStatus.message_count !== undefined && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{sessionStatus.message_count} messages</span>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetSession}
                disabled={isLoading}
                className="h-8"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNewSession}
                disabled={isLoading}
                className="h-8"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                New Session
              </Button>
            </div>
          </div>

          {/* Mock data toggle */}
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

          <div className="px-4 py-4 pb-6 border-t space-y-3">
            <FilterPanel
              selectedAuthors={selectedAuthors}
              selectedWorks={selectedWorks}
              onAuthorsChange={setSelectedAuthors}
              onWorksChange={setSelectedWorks}
            />
            <ChatInput ref={chatInputRef} onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

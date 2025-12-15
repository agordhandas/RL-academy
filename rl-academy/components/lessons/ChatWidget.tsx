"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  lessonTitle: string;
  lessonContent?: string;
  moduleTitle?: string;
}

export default function ChatWidget({ lessonTitle, lessonContent, moduleTitle }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hi! I'm your AI tutor for "${lessonTitle}".

I'm here to help you understand the concepts better. You can:
• Ask questions about any part of the lesson
• Request examples or clarifications
• Have a back-and-forth conversation - I remember our chat context!

What would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen for text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        setSelectedText(selection.toString().trim());
      }
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("touchend", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      // Generate contextual responses based on the conversation
      const isFollowUp = messages.length > 1;
      let responseContent = "";

      // Get previous user question for context
      const previousUserMessages = messages.filter(m => m.role === "user");
      const hasPreviousContext = previousUserMessages.length > 0;

      // Check for common follow-up patterns
      const lowerInput = inputValue.toLowerCase();
      if (lowerInput.includes("why") && lowerInput.includes("25 states")) {
        responseContent = `Great question! There are 25 states because we have a 5×5 grid:
- 5 rows × 5 columns = 25 total positions
- Each position on the grid represents a different state
- The robot can be in any one of these 25 positions
- This is a fundamental concept in RL: the state space size

Would you like me to explain more about how state spaces affect learning complexity?`;
      } else if (lowerInput.includes("more") || lowerInput.includes("explain") || lowerInput.includes("detail")) {
        responseContent = `Let me elaborate further on that concept:

${isFollowUp ? "Building on what we discussed earlier, " : ""}the key insight here is that each state represents a unique situation the agent might encounter. In our grid world:

• State (0,0) = top-left corner
• State (4,4) = bottom-right goal
• States with pits = dangerous positions to avoid

The agent needs to learn the value or best action for EACH state independently.

Do you have any specific aspect you'd like me to clarify?`;
      } else if (lowerInput.includes("example")) {
        responseContent = `Here's a concrete example:

Imagine the robot is at position (2,2) - the center of the grid. From this state, it has 4 possible actions:
- UP → moves to state (1,2)
- DOWN → moves to state (3,2)
- LEFT → moves to state (2,1)
- RIGHT → moves to state (2,3)

The policy tells the robot which of these actions is best based on what it has learned about avoiding pits and reaching the goal.

What other aspects of the grid world would you like to explore?`;
      } else {
        responseContent = `${isFollowUp ? "Following up on your question: " : ""}I understand you're asking about "${inputValue}".

Based on the lesson content about ${lessonTitle}, here's my explanation...

[This is a simulated response. In production, this would connect to an AI API with full lesson context and conversation history.]

Feel free to ask follow-up questions or request clarification on any part!`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleAskAboutSelection = () => {
    if (selectedText) {
      setInputValue(`Can you explain this part: "${selectedText.substring(0, 100)}${selectedText.length > 100 ? '...' : ''}"`);
      setSelectedText("");
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="relative">
              <MessageCircle className="h-6 w-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[24rem] max-w-[calc(100vw-3rem)] h-[600px] max-h-[80vh] flex flex-col"
          >
            <Card className="w-full h-full flex flex-col shadow-2xl overflow-hidden">
              {/* Header */}
              <CardHeader className="pb-3 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium">
                        AI Tutor {messages.length > 2 && <span className="text-xs font-normal text-muted-foreground ml-1">(Conversation)</span>}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">{lessonTitle}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Actions */}
                {selectedText && (
                  <div className="mt-3 p-2 bg-muted/50 rounded-md">
                    <p className="text-xs text-muted-foreground mb-2">You selected text:</p>
                    <p className="text-xs line-clamp-2 mb-2">"{selectedText}"</p>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-7 text-xs w-full"
                      onClick={handleAskAboutSelection}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Ask about this
                    </Button>
                  </div>
                )}
              </CardHeader>

              {/* Messages */}
              <div className="flex-1 overflow-hidden min-h-0">
                <ScrollArea className="h-full">
                  <div className="space-y-4 p-4">
                    {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3 max-w-full",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.role === "assistant" && (
                        <div className="p-1.5 rounded-lg bg-muted h-fit flex-shrink-0">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-3 py-2 overflow-hidden",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {message.role === "user" && (
                        <div className="p-1.5 rounded-lg bg-primary text-primary-foreground h-fit flex-shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="p-1.5 rounded-lg bg-muted h-fit flex-shrink-0">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>

              {/* Quick Questions */}
              <div className="px-4 py-2 border-t flex-shrink-0">
                <p className="text-xs text-muted-foreground mb-2">
                  {messages.length > 2 ? "Continue asking:" : "Quick questions:"}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {messages.length <= 2 ? (
                    <>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-muted text-xs"
                        onClick={() => handleQuickQuestion("What are the key concepts in this lesson?")}
                      >
                        Key concepts?
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-muted text-xs"
                        onClick={() => handleQuickQuestion("Can you give me a real-world example?")}
                      >
                        Real example?
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-muted text-xs"
                        onClick={() => handleQuickQuestion("Why are there 25 states?")}
                      >
                        Why 25 states?
                      </Badge>
                    </>
                  ) : (
                    <>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-muted text-xs"
                        onClick={() => handleQuickQuestion("Tell me more about that")}
                      >
                        Tell me more
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-muted text-xs"
                        onClick={() => handleQuickQuestion("Can you give an example?")}
                      >
                        Example?
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-muted text-xs"
                        onClick={() => handleQuickQuestion("How does this relate to the main concept?")}
                      >
                        How relates?
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Input */}
              <CardContent className="pb-4 pt-3 border-t flex-shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex gap-2"
                >
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={messages.length > 2 ? "Ask a follow-up question..." : "Ask a question... (Shift+Enter for new line)"}
                    disabled={isLoading}
                    className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                    rows={1}
                    autoFocus
                  />
                  <Button type="submit" size="icon" disabled={!inputValue.trim() || isLoading} className="self-end">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
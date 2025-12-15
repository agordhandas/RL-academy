"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, Send, Lightbulb, RefreshCw, Brain, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { InteractiveQuestion as IQuestion } from "@/types/curriculum";

interface InteractiveQuestionProps {
  question: IQuestion;
  onAnswer?: (questionId: string, answer: string, feedback: string) => void;
}

export default function InteractiveQuestion({ question, onAnswer }: InteractiveQuestionProps) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded by default

  const handleSubmit = async () => {
    if (!answer.trim()) return;

    setIsLoading(true);
    setFeedback(""); // Clear any previous feedback
    setIsExpanded(true); // Keep expanded to show feedback

    try {
      const response = await fetch("/api/evaluate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.question,
          answer: answer,
          context: question.context,
          expectedConcepts: question.expectedConcepts,
          sampleAnswers: question.sampleAnswers,
          followUpPrompt: question.followUpPrompt,
        }),
      });

      const data = await response.json();

      if (data.feedback) {
        setFeedback(data.feedback);
        setHasAnswered(true);

        if (onAnswer) {
          onAnswer(question.id, answer, data.feedback);
        }
      } else {
        setFeedback("No feedback received. Please try again.");
        setHasAnswered(true);
      }
    } catch (error) {
      console.error("Error evaluating answer:", error);
      setFeedback("Sorry, there was an error evaluating your answer. Please try again.");
      setHasAnswered(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnswer("");
    setFeedback("");
    setHasAnswered(false);
    setShowHint(false);
  };

  const getHintText = () => {
    if (question.question.toLowerCase().includes("epsilon")) {
      return "Think about what epsilon controls in the exploration-exploitation trade-off. What would happen at the extreme values?";
    }
    return "Consider the fundamental behavior being controlled by this parameter.";
  };

  return (
    <Card className="my-6 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <span>Thought Exercise</span>
            {hasAnswered && <CheckCircle2 className="h-4 w-4 text-green-600" />}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 pt-2">
          <div className="space-y-2">
            <p className="font-medium">{question.question}</p>
            {question.context && (
              <p className="text-sm text-muted-foreground italic">{question.context}</p>
            )}
          </div>

          {!hasAnswered ? (
            <div className="space-y-4">
              <Textarea
                placeholder="Share your thoughts here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[120px] resize-none"
                disabled={isLoading}
              />

              {showHint && (
                <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-300">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <AlertDescription>{getHintText()}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {showHint ? "Hide Hint" : "Need a Hint?"}
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={!answer.trim() || isLoading}
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-semibold text-muted-foreground mb-1">Your Answer:</p>
                <p className="text-sm">{answer}</p>
              </div>

              {feedback && (
                <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-500">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <p className="font-semibold mb-2">AI Feedback</p>
                    <div className="text-sm whitespace-pre-wrap">{feedback}</div>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Another Answer
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
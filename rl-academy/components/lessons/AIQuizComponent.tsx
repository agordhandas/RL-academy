"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProgress } from "@/hooks/use-progress";
import { AIQuestion, QuizResponse } from "@/types/curriculum";
import {
  Brain,
  Send,
  Lightbulb,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  BookOpen,
  Code
} from "lucide-react";

interface AIQuizComponentProps {
  questions: AIQuestion[];
  lessonId: string;
  onComplete: () => void;
  isCompleted: boolean;
}

export default function AIQuizComponent({
  questions,
  lessonId,
  onComplete,
  isCompleted
}: AIQuizComponentProps) {
  const { updateQuizScore, saveQuizResponse } = useProgress();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    message: string;
    suggestions?: string[];
    followUp?: string;
  } | null>(null);
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const evaluateAnswer = async () => {
    if (!userAnswer.trim()) return;

    setIsEvaluating(true);

    try {
      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.question,
          context: currentQuestion.context,
          userAnswer: userAnswer,
          concepts: currentQuestion.concepts,
          rubric: currentQuestion.rubric
        })
      });

      const result = await response.json();

      setFeedback(result);

      // Save response
      const quizResponse: QuizResponse = {
        questionId: currentQuestion.id,
        userAnswer: userAnswer,
        feedback: result.message,
        score: result.score,
        timestamp: new Date()
      };

      setResponses([...responses, quizResponse]);
      saveQuizResponse(lessonId, quizResponse);

    } catch (error) {
      // Fallback for demo - simulate AI response
      const simulatedFeedback = simulateAIFeedback(userAnswer, currentQuestion);
      setFeedback(simulatedFeedback);

      const quizResponse: QuizResponse = {
        questionId: currentQuestion.id,
        userAnswer: userAnswer,
        feedback: simulatedFeedback.message,
        score: simulatedFeedback.score,
        timestamp: new Date()
      };

      setResponses([...responses, quizResponse]);
    } finally {
      setIsEvaluating(false);
    }
  };

  const simulateAIFeedback = (answer: string, question: AIQuestion) => {
    // Sophisticated simulation for demo
    const answerLower = answer.toLowerCase();
    const hasKeyConcepts = question.concepts.some(concept =>
      answerLower.includes(concept.toLowerCase())
    );

    if (answer.length < 30) {
      return {
        score: 40,
        message: "Your answer is too brief. Try to elaborate more on the key concepts.",
        suggestions: [
          "Explain the 'why' behind your answer",
          "Include specific examples or scenarios",
          `Consider discussing: ${question.concepts.join(', ')}`
        ]
      };
    }

    if (hasKeyConcepts && answer.length > 100) {
      return {
        score: 85,
        message: "Great answer! You've demonstrated a solid understanding of the concept.",
        suggestions: [
          "Your explanation is clear and well-reasoned",
          "You correctly identified the key relationships"
        ],
        followUp: question.followUp
      };
    }

    return {
      score: 65,
      message: "Good start! Your answer shows understanding but could be more comprehensive.",
      suggestions: [
        "Try to connect your answer to the broader context",
        `Make sure to address: ${question.concepts[0]}`,
        "Consider what happens in edge cases"
      ]
    };
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setFeedback(null);
      setShowHint(false);
      setCurrentHintIndex(0);
    } else {
      // Calculate overall score
      const avgScore = responses.reduce((sum, r) => sum + r.score, 0) / responses.length;
      updateQuizScore(lessonId, Math.round(avgScore));
      setQuizComplete(true);
    }
  };

  const handleShowHint = () => {
    if (currentQuestion.hints && currentQuestion.hints.length > 0) {
      setShowHint(true);
      if (currentHintIndex < currentQuestion.hints.length - 1) {
        setCurrentHintIndex(currentHintIndex + 1);
      }
    }
  };

  if (quizComplete) {
    const avgScore = Math.round(
      responses.reduce((sum, r) => sum + r.score, 0) / responses.length
    );

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Thoughtful Discussion Complete! 🎓
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
                <Brain className="h-12 w-12 text-primary" />
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">{avgScore}%</p>
                <p className="text-lg text-muted-foreground">
                  Average understanding score across {responses.length} questions
                </p>
              </div>
            </div>

            {/* Response Review */}
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-semibold mb-3">Your Learning Journey</h3>
              <ScrollArea className="h-[300px] pr-4">
                {responses.map((response, idx) => (
                  <Card key={idx} className="mb-3">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">
                          Question {idx + 1}: {questions[idx].question}
                        </h4>
                        <Badge variant={
                          response.score >= 80 ? "default" :
                          response.score >= 60 ? "secondary" : "outline"
                        }>
                          {response.score}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Your answer: {response.userAnswer.substring(0, 100)}...
                      </p>
                      <p className="text-sm italic">{response.feedback}</p>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </div>

            <div className="flex gap-3 justify-center pt-4">
              <Button onClick={() => window.location.reload()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Different Questions
              </Button>
              <Button onClick={onComplete}>
                Continue Learning
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="font-medium">Conceptual Understanding</span>
            </div>
            <Badge variant="outline">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
          </div>
          <Progress
            value={((currentQuestionIndex + (feedback ? 1 : 0)) / questions.length) * 100}
            className="h-2 mt-3"
          />
        </CardHeader>
      </Card>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="space-y-4">
                {currentQuestion.context && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{currentQuestion.context}</p>
                  </div>
                )}
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion.question}
                </CardTitle>
                {currentQuestion.relatedCode && (
                  <div className="mt-3 p-3 bg-slate-900 dark:bg-slate-950 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-4 w-4 text-slate-400" />
                      <span className="text-xs text-slate-400">Reference Code</span>
                    </div>
                    <pre className="text-sm text-slate-300 overflow-x-auto">
                      <code>{currentQuestion.relatedCode}</code>
                    </pre>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Answer Input */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Your Answer</label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your thoughtful answer here... Explain your reasoning and consider edge cases."
                  className="w-full min-h-[150px] p-4 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={!!feedback}
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{userAnswer.length} characters</span>
                  <span>Aim for 100-300 characters for a complete answer</span>
                </div>
              </div>

              {/* Hint Section */}
              {currentQuestion.hints && currentQuestion.hints.length > 0 && !feedback && (
                <div>
                  {!showHint ? (
                    <Button
                      onClick={handleShowHint}
                      variant="outline"
                      size="sm"
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Need a hint?
                    </Button>
                  ) : (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div className="space-y-2">
                          {currentQuestion.hints.slice(0, currentHintIndex + 1).map((hint, idx) => (
                            <p key={idx} className="text-sm">{hint}</p>
                          ))}
                        </div>
                      </div>
                      {currentHintIndex < currentQuestion.hints.length - 1 && (
                        <Button
                          onClick={handleShowHint}
                          variant="link"
                          size="sm"
                          className="mt-2 p-0 h-auto text-yellow-700 dark:text-yellow-400"
                        >
                          Need another hint?
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Section */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className={`
                    p-4 rounded-lg border
                    ${feedback.score >= 80
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-500'
                      : feedback.score >= 60
                      ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-500'
                      : 'bg-orange-50 dark:bg-orange-950/20 border-orange-500'
                    }
                  `}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {feedback.score >= 80 ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            Understanding Score: {feedback.score}%
                          </span>
                          <Badge variant="outline" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI Evaluated
                          </Badge>
                        </div>
                        <p className="text-sm">{feedback.message}</p>

                        {feedback.suggestions && feedback.suggestions.length > 0 && (
                          <div className="mt-3 space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Key Points:</p>
                            <ul className="space-y-1">
                              {feedback.suggestions.map((suggestion, idx) => (
                                <li key={idx} className="text-sm flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{suggestion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {feedback.followUp && (
                          <div className="mt-3 p-3 bg-background rounded border">
                            <div className="flex items-center gap-2 mb-1">
                              <MessageSquare className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">Follow-up Question</span>
                            </div>
                            <p className="text-sm italic">{feedback.followUp}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reference to Theory */}
                  {feedback.score < 80 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>Consider reviewing the theory section for a deeper understanding</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between">
                <div>
                  {currentQuestionIndex > 0 && !feedback && (
                    <Button
                      onClick={() => {
                        setCurrentQuestionIndex(currentQuestionIndex - 1);
                        setUserAnswer("");
                        setFeedback(null);
                        setShowHint(false);
                        setCurrentHintIndex(0);
                      }}
                      variant="outline"
                    >
                      Previous
                    </Button>
                  )}
                </div>
                <div>
                  {!feedback ? (
                    <Button
                      onClick={evaluateAnswer}
                      disabled={!userAnswer.trim() || isEvaluating}
                    >
                      {isEvaluating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Evaluating...
                        </>
                      ) : (
                        <>
                          Submit Answer
                          <Send className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button onClick={handleNextQuestion}>
                      {currentQuestionIndex < questions.length - 1
                        ? "Next Question"
                        : "Complete Discussion"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
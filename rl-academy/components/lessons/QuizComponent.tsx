"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useProgress } from "@/hooks/use-progress";
import { QuizQuestion } from "@/types/curriculum";
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronRight,
  RefreshCw,
  Brain,
  Lightbulb,
  Trophy
} from "lucide-react";
import confetti from "canvas-confetti";

interface QuizComponentProps {
  questions: QuizQuestion[];
  lessonId: string;
  onComplete: () => void;
  isCompleted: boolean;
}

export default function QuizComponent({
  questions,
  lessonId,
  onComplete,
  isCompleted
}: QuizComponentProps) {
  const { updateQuizScore, getLessonScore } = useProgress();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const previousScore = getLessonScore(lessonId);

  useEffect(() => {
    if (isCompleted && previousScore) {
      const correctCount = Math.round((previousScore / 100) * questions.length);
      const filledAnswers = questions.map((q, i) => {
        if (i < correctCount) return Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : Number(q.correctAnswer);
        return null;
      });
      setAnswers(filledAnswers);
      setQuizComplete(true);
    }
  }, [isCompleted, previousScore, questions]);

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(Number(value));
    setShowHint(false);
    setCurrentHintIndex(0);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);
    setShowFeedback(true);

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      const duration = 2000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1]);
      setShowFeedback(false);
      setShowHint(false);
      setCurrentHintIndex(0);
    } else {
      // Quiz complete
      const correctCount = answers.filter((ans, idx) =>
        ans === questions[idx].correctAnswer
      ).length;
      const score = Math.round((correctCount / questions.length) * 100);
      updateQuizScore(lessonId, score);
      setQuizComplete(true);
    }
  };

  const handleRetryQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnswers(new Array(questions.length).fill(null));
    setShowHint(false);
    setCurrentHintIndex(0);
    setQuizComplete(false);
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
    const correctCount = answers.filter((ans, idx) =>
      ans === questions[idx].correctAnswer
    ).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 70;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {passed ? "Quiz Complete! 🎉" : "Quiz Complete"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
                <Trophy className={`h-12 w-12 ${passed ? 'text-green-600' : 'text-orange-600'}`} />
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">{score}%</p>
                <p className="text-lg text-muted-foreground">
                  You got {correctCount} out of {questions.length} questions correct
                </p>
              </div>
              {passed ? (
                <Badge className="bg-green-600 text-white px-4 py-1">
                  Passed (≥70%)
                </Badge>
              ) : (
                <Badge className="bg-orange-600 text-white px-4 py-1">
                  Try Again (Need ≥70%)
                </Badge>
              )}
            </div>

            {/* Question Review */}
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-semibold mb-3">Question Review</h3>
              {questions.map((question, idx) => {
                const userAnswer = answers[idx];
                const isCorrect = userAnswer === question.correctAnswer;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isCorrect
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-medium">Question {idx + 1}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 justify-center pt-4">
              {!passed && (
                <Button onClick={handleRetryQuiz} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retake Quiz
                </Button>
              )}
              <Button
                onClick={onComplete}
                className={passed ? "" : "bg-muted text-muted-foreground"}
              >
                {passed ? "Continue to Next Lesson" : "Continue Anyway"}
                <ChevronRight className="h-4 w-4 ml-2" />
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
              <span className="font-medium">Quiz</span>
            </div>
            <Badge variant="outline">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
          </div>
          <Progress
            value={((currentQuestionIndex + (showFeedback ? 1 : 0)) / questions.length) * 100}
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
              <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Answer Options */}
              {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
                <RadioGroup
                  value={selectedAnswer?.toString()}
                  onValueChange={handleAnswerSelect}
                  disabled={showFeedback}
                >
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedAnswer === idx;
                      const isCorrect = idx === currentQuestion.correctAnswer;
                      const showStatus = showFeedback && (isSelected || isCorrect);

                      return (
                        <Label
                          key={idx}
                          htmlFor={`option-${idx}`}
                          className={`
                            flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all
                            ${showFeedback
                              ? showStatus
                                ? isCorrect
                                  ? 'bg-green-50 dark:bg-green-950/20 border-green-500'
                                  : 'bg-red-50 dark:bg-red-950/20 border-red-500'
                                : 'opacity-50'
                              : isSelected
                              ? 'bg-primary/5 border-primary'
                              : 'hover:bg-accent'
                            }
                          `}
                        >
                          <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                          <span className="flex-1">{option}</span>
                          {showFeedback && showStatus && (
                            <div>
                              {isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : isSelected ? (
                                <XCircle className="h-5 w-5 text-red-600" />
                              ) : null}
                            </div>
                          )}
                        </Label>
                      );
                    })}
                  </div>
                </RadioGroup>
              )}

              {/* Hint Section */}
              {currentQuestion.hints && currentQuestion.hints.length > 0 && !showFeedback && (
                <div>
                  {!showHint ? (
                    <Button
                      onClick={handleShowHint}
                      variant="outline"
                      size="sm"
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Show Hint
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
                          Show another hint
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Section */}
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`
                    p-4 rounded-lg border
                    ${selectedAnswer === currentQuestion.correctAnswer
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-500'
                      : 'bg-red-50 dark:bg-red-950/20 border-red-500'
                    }
                  `}
                >
                  <div className="flex items-start gap-2">
                    {selectedAnswer === currentQuestion.correctAnswer ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold mb-1">
                        {selectedAnswer === currentQuestion.correctAnswer
                          ? "Correct!"
                          : "Not quite right"}
                      </p>
                      <p className="text-sm">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between">
                <div>
                  {currentQuestionIndex > 0 && !showFeedback && (
                    <Button
                      onClick={() => {
                        setCurrentQuestionIndex(currentQuestionIndex - 1);
                        setSelectedAnswer(answers[currentQuestionIndex - 1]);
                        setShowFeedback(false);
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
                  {!showFeedback ? (
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null}
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button onClick={handleNextQuestion}>
                      {currentQuestionIndex < questions.length - 1
                        ? "Next Question"
                        : "Finish Quiz"}
                      <ChevronRight className="h-4 w-4 ml-2" />
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
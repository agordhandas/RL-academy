"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, BookOpen, ArrowDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import "katex/dist/katex.min.css";
import { InteractiveQuestion } from "@/types/curriculum";
import InteractiveQuestionComponent from "./InteractiveQuestion";

interface TheoryViewerProps {
  content: string;
  interactiveQuestions?: InteractiveQuestion[];
  onComplete: () => void;
  isCompleted: boolean;
}

export default function TheoryViewer({ content, interactiveQuestions, onComplete, isCompleted }: TheoryViewerProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const contentElement = document.getElementById('theory-content');
      if (!contentElement) return;

      const contentRect = contentElement.getBoundingClientRect();
      const contentTop = contentRect.top + window.scrollY;
      const contentHeight = contentRect.height;
      const viewportHeight = window.innerHeight;
      const scrollFromTop = window.scrollY - contentTop;
      const scrollableDistance = contentHeight - viewportHeight;

      if (scrollableDistance > 0) {
        const progress = (scrollFromTop / scrollableDistance) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));

        if (progress >= 85) {
          setHasScrolledToBottom(true);
        }
      } else {
        // Content is shorter than viewport, mark as read immediately
        setScrollProgress(100);
        setHasScrolledToBottom(true);
      }

      setShowScrollTop(window.scrollY > 500);
    };

    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuestionAnswer = (questionId: string, answer: string, feedback: string) => {
    setAnsweredQuestions(prev => new Set(prev).add(questionId));
  };

  // Function to determine where to insert questions based on content sections
  const insertQuestionsInContent = () => {
    if (!interactiveQuestions || interactiveQuestions.length === 0) {
      console.log("No interactive questions found");
      return content;
    }

    console.log("Processing interactive questions:", interactiveQuestions.length);
    let modifiedContent = content;

    // Insert questions at specific points in the content
    interactiveQuestions.forEach((question, index) => {
      let insertionPoint = -1;

      if (index === 0) {
        // First epsilon question - right after explaining epsilon parameter
        const epsilonMatch = modifiedContent.indexOf("**Parameters to tune:**");
        console.log(`Question ${index}: Looking for "**Parameters to tune:**" at position:`, epsilonMatch);
        if (epsilonMatch !== -1) {
          // Find the end of the epsilon parameter explanation - after the alpha line
          const afterAlpha = modifiedContent.indexOf("- $\\alpha$", epsilonMatch);
          if (afterAlpha !== -1) {
            // Insert after the entire parameters section
            insertionPoint = modifiedContent.indexOf("\n", afterAlpha) + 1;
            console.log(`Question ${index}: Will insert at position:`, insertionPoint);
          }
        }
      } else if (index === 1) {
        // Second epsilon question - after the first question
        const firstQuestionPos = modifiedContent.indexOf("{{INTERACTIVE_QUESTION_0}}");
        console.log(`Question ${index}: Looking for first question at position:`, firstQuestionPos);
        if (firstQuestionPos !== -1) {
          // Place it right after the first question
          insertionPoint = firstQuestionPos + "{{INTERACTIVE_QUESTION_0}}".length;
        }
      } else if (index === 2) {
        // Q-values question - right after explaining Q(a) formula
        const qValueText = "$$Q(a) = \\text{\"What's the expected reward from pulling arm } a\\text{?\"}$$";
        const qValueMatch = modifiedContent.indexOf(qValueText);
        console.log(`Question ${index}: Looking for Q-value formula at position:`, qValueMatch);
        if (qValueMatch !== -1) {
          // Find the next paragraph break after the Q-value explanation
          const afterQValue = modifiedContent.indexOf("\n\n", qValueMatch + qValueText.length);
          if (afterQValue !== -1) {
            insertionPoint = afterQValue + 2;
            console.log(`Question ${index}: Will insert at position:`, insertionPoint);
          }
        }
      }

      if (insertionPoint !== -1) {
        modifiedContent =
          modifiedContent.slice(0, insertionPoint) +
          `\n\n{{INTERACTIVE_QUESTION_${index}}}\n\n` +
          modifiedContent.slice(insertionPoint);
        console.log(`Question ${index}: Inserted successfully`);
      } else {
        console.log(`Question ${index}: Could not find insertion point`);
      }
    });

    // Check if any questions were inserted
    const questionsInserted = modifiedContent.includes("{{INTERACTIVE_QUESTION");
    console.log("Questions inserted in content:", questionsInserted);

    return modifiedContent;
  };

  const processedContent = insertQuestionsInContent();

  return (
    <div className="space-y-6">
      {/* Content */}
      <Card className="relative">
        <div id="theory-content" className="px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose prose-slate dark:prose-invert max-w-none"
          >
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                p: ({ children }) => {
                  // Check if this paragraph contains an interactive question placeholder
                  const text = String(children);
                  const questionMatch = text.match(/\{\{INTERACTIVE_QUESTION_(\d+)\}\}/);

                  if (questionMatch && interactiveQuestions) {
                    const questionIndex = parseInt(questionMatch[1]);
                    const question = interactiveQuestions[questionIndex];

                    console.log("Found question placeholder:", questionIndex, question);

                    if (question) {
                      return (
                        <InteractiveQuestionComponent
                          question={question}
                          onAnswer={handleQuestionAnswer}
                        />
                      );
                    }
                  }

                  // Default paragraph rendering
                  return <p className="mb-4 leading-7 text-foreground/90">{children}</p>;
                },
                h1: ({ children }) => {
                  const text = String(children);
                  const id = text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/\s+/g, "-");
                  return (
                    <h1 id={id} className="text-3xl font-bold mb-6 mt-8 text-foreground">
                      {children}
                    </h1>
                  );
                },
                h2: ({ children }) => {
                  const text = String(children);
                  const id = text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/\s+/g, "-");
                  return (
                    <h2 id={id} className="text-2xl font-semibold mb-4 mt-6 text-foreground">
                      {children}
                    </h2>
                  );
                },
                h3: ({ children }) => {
                  const text = String(children);
                  const id = text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/\s+/g, "-");
                  return (
                    <h3 id={id} className="text-xl font-semibold mb-3 mt-4 text-foreground">
                      {children}
                    </h3>
                  );
                },
                ul: ({ children }) => (
                  <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-foreground/90">{children}</li>
                ),
                code: ({ inline, children, className }) => {
                  const codeContent = String(children);

                  // Check if this is a grid representation
                  if (!inline && codeContent.includes('[S]') && codeContent.includes('[G]')) {
                    // Parse the grid
                    const lines = codeContent.split('\n').filter(line => line.trim());
                    const gridLines = lines.filter(line => line.includes('['));
                    const legend = lines.filter(line => !line.includes('['));

                    if (gridLines.length > 0) {
                      return (
                        <div className="my-6 space-y-4">
                          <div className="overflow-x-auto">
                            <table className="mx-auto border-collapse">
                              <tbody>
                                {gridLines.map((line, rowIndex) => {
                                  const cells = line.match(/\[([^\]]*)\]/g) || [];
                                  return (
                                    <tr key={rowIndex}>
                                      {cells.map((cell, colIndex) => {
                                        const content = cell.replace(/[\[\]]/g, '').trim();
                                        let cellClass = "w-12 h-12 border-2 border-gray-300 text-center font-bold text-sm";
                                        let cellContent = "";

                                        if (content === 'S') {
                                          cellClass += " bg-green-500 text-white";
                                          cellContent = "S";
                                        } else if (content === 'G') {
                                          cellClass += " bg-blue-500 text-white";
                                          cellContent = "G";
                                        } else if (content === 'X') {
                                          cellClass += " bg-red-500 text-white";
                                          cellContent = "⚠";
                                        } else {
                                          cellClass += " bg-gray-50 hover:bg-gray-100";
                                        }

                                        return (
                                          <td key={colIndex} className={cellClass}>
                                            {cellContent}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                          {legend.length > 0 && (
                            <div className="text-sm text-muted-foreground text-center space-y-1">
                              {legend.map((line, i) => (
                                <div key={i}>{line}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                  }

                  // Default code rendering
                  if (inline) {
                    return (
                      <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-sm">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block p-4 rounded-lg bg-muted font-mono text-sm overflow-x-auto">
                      {children}
                    </code>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full border-collapse">{children}</table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-muted">{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="border border-border px-4 py-2 text-left font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border px-4 py-2">{children}</td>
                ),
                img: ({ src, alt }) => {
                  // Return a span wrapper (inline element) to avoid div-in-p issues
                  // The span will be styled as block for layout purposes
                  if (src?.endsWith('.svg')) {
                    return (
                      <span className="block my-8 text-center">
                        <img
                          src={src}
                          alt={alt || 'Illustration'}
                          className="inline-block max-w-full h-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 bg-white p-4"
                          style={{ maxHeight: '500px', width: 'auto' }}
                        />
                      </span>
                    );
                  }
                  // For regular images (PNG, JPG, etc)
                  return (
                    <span className="block my-8 text-center">
                      <img
                        src={src}
                        alt={alt || 'Illustration'}
                        className="inline-block max-w-full h-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                        style={{ maxHeight: '600px', width: 'auto' }}
                      />
                    </span>
                  );
                },
              }}
            >
              {processedContent}
            </ReactMarkdown>
          </motion.div>

          {/* Scroll Indicator */}
          {scrollProgress < 95 && (
            <div className="flex justify-center mt-8 animate-bounce">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ArrowDown className="h-4 w-4" />
                <span className="text-sm">Scroll to continue reading</span>
              </div>
            </div>
          )}
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="absolute bottom-4 right-4 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </Card>

      {/* Complete Button */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">
                {isCompleted ? "You've completed this lesson!" : "Ready to continue?"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isCompleted
                  ? "Feel free to review the content or move on to the next lesson."
                  : hasScrolledToBottom
                  ? "Great job reading through the material! Mark this lesson as complete."
                  : "Read through all the content to unlock completion."}
              </p>
            </div>
            <Button
              size="lg"
              onClick={onComplete}
              disabled={!hasScrolledToBottom && !isCompleted}
              className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed
                </>
              ) : (
                "Mark as Complete"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
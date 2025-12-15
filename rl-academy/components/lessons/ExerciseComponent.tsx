"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Lesson } from "@/types/curriculum";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Lightbulb, Play, RotateCcw, CheckCircle, XCircle, Info, Eye, EyeOff, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/use-progress";

// Dynamic import to avoid SSR issues with Monaco
const Editor = dynamic(
  () => import("@monaco-editor/react"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }
);

interface ExerciseComponentProps {
  lesson: Lesson;
  onComplete: () => void;
  isCompleted: boolean;
}

export default function ExerciseComponent({
  lesson,
  onComplete,
  isCompleted
}: ExerciseComponentProps) {
  const { saveUserCode, getUserCode } = useProgress();
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{
    passed: boolean;
    message: string;
    details?: string[];
  } | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  // Load saved code or starter code on mount
  useEffect(() => {
    const savedCode = getUserCode(lesson.id);
    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(lesson.starterCode || getDefaultStarterCode());
    }
    setTestResults(null);
    setShowHints(false);
    setShowSolution(false);
    setHintIndex(0);
    setOutput("");
  }, [lesson, getUserCode]);

  const getDefaultStarterCode = () => {
    return `import numpy as np

class RLAgent:
    def __init__(self, learning_rate=0.1):
        self.learning_rate = learning_rate
        # TODO: Initialize your agent here
        pass

    def choose_action(self, state):
        # TODO: Implement action selection
        pass

    def learn(self, state, action, reward, next_state):
        # TODO: Implement learning update
        pass

# Test your implementation
agent = RLAgent()
print("Agent initialized successfully!")
`;
  };

  const simulatePythonExecution = (code: string): { output: string; passed: boolean; details: string[] } => {
    let output = "";
    let details: string[] = [];
    let passed = false;

    try {
      // Check for basic syntax patterns
      const hasClass = code.includes("class");
      const hasAgent = code.includes("Agent");
      const hasInit = code.includes("def __init__");
      const hasChooseAction = code.includes("def choose_action");
      const hasLearn = code.includes("def learn");

      // Simulate output
      if (code.includes("print(")) {
        const printMatches = code.match(/print\((.*?)\)/g);
        if (printMatches) {
          printMatches.forEach(match => {
            const content = match.replace(/print\(["']?|["']?\)/g, "");
            output += content + "\n";
          });
        }
      }

      // Check implementation quality
      if (hasClass && hasAgent) {
        details.push("✓ Agent class defined");
      } else {
        details.push("✗ Agent class not found");
      }

      if (hasInit) {
        details.push("✓ Initialization method implemented");
      } else {
        details.push("✗ Initialization method missing");
      }

      if (hasChooseAction) {
        details.push("✓ Action selection method implemented");
        if (code.includes("epsilon") && code.includes("random")) {
          details.push("✓ Epsilon-greedy exploration detected");
        }
      } else {
        details.push("✗ Action selection method missing");
      }

      if (hasLearn) {
        details.push("✓ Learning method implemented");
        if (code.includes("Q[") || code.includes("q_table") || code.includes("self.Q")) {
          details.push("✓ Q-learning implementation detected");
        }
      } else {
        details.push("✗ Learning method missing");
      }

      // Check if tests pass
      passed = hasClass && hasAgent && hasInit && hasChooseAction && hasLearn;

      if (!output && code.length > 100) {
        output = "Code executed successfully\n";
      } else if (!output) {
        output = "No output generated. Add print statements to see results.\n";
      }

      // Add execution summary
      if (passed) {
        output += "\n✅ All requirements met!";
      } else {
        output += "\n⚠️ Some requirements not met. Check the test results.";
      }

    } catch (error) {
      output = `Error: ${error}\n`;
      details = ["✗ Code execution failed"];
      passed = false;
    }

    return { output, passed, details };
  };

  const runTests = async () => {
    setIsRunning(true);
    setOutput("Running code...\n");

    // Save the current code
    saveUserCode(lesson.id, code);

    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { output: execOutput, passed, details } = simulatePythonExecution(code);
    setOutput(execOutput);

    setTestResults({
      passed,
      message: passed ? "All tests passed!" : "Some requirements not met",
      details
    });

    // Auto-complete if all tests pass
    if (passed && !isCompleted) {
      setTimeout(() => {
        onComplete();
      }, 1500);
    }

    setIsRunning(false);
  };

  const resetCode = () => {
    setCode(lesson.starterCode || getDefaultStarterCode());
    setTestResults(null);
    setShowSolution(false);
    setOutput("");
  };

  const showNextHint = () => {
    if (lesson.hints && hintIndex < lesson.hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
  };

  const handleShowSolution = () => {
    if (lesson.solution) {
      setCode(lesson.solution);
      setShowSolution(true);
      saveUserCode(lesson.id, lesson.solution);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Exercise Instructions
          </CardTitle>
          <CardDescription>
            {lesson.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="task" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="task">Task</TabsTrigger>
              <TabsTrigger value="hints">Hints ({hintIndex + 1}/{lesson.hints?.length || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="task" className="space-y-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground">
                  Complete the code below to solve the exercise. Use the hints if you get stuck,
                  and run the tests to verify your solution.
                </p>
                {lesson.requirements && (
                  <div>
                    <h4>Requirements:</h4>
                    <ul>
                      {lesson.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="hints" className="space-y-3">
              {lesson.hints && lesson.hints.length > 0 ? (
                <>
                  {lesson.hints.slice(0, hintIndex + 1).map((hint, i) => (
                    <Alert key={i} className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        <span className="font-medium">Hint {i + 1}:</span> {hint}
                      </AlertDescription>
                    </Alert>
                  ))}
                  {hintIndex < lesson.hints.length - 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={showNextHint}
                      className="w-full"
                    >
                      Show Next Hint
                    </Button>
                  )}
                </>
              ) : (
                <Alert>
                  <AlertDescription>
                    No hints available for this exercise. Try working through it on your own!
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Code Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Python Code Editor
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetCode}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              {lesson.solution && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShowSolution}
                >
                  {showSolution ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Hide Solution
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Show Solution
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {showSolution && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Solution Revealed</AlertTitle>
                <AlertDescription>
                  This is the reference solution. Study how it works before moving on.
                </AlertDescription>
              </Alert>
            )}

            <div className="rounded-lg overflow-hidden border">
              <Editor
                height="400px"
                defaultLanguage="python"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  automaticLayout: true,
                  formatOnPaste: true,
                  formatOnType: true,
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  glyphMargin: false,
                  folding: true,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 3,
                }}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={runTests}
                disabled={isRunning || !code.trim()}
                size="lg"
              >
                {isRunning ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Code
                  </>
                )}
              </Button>

              {testResults?.passed && !isCompleted && (
                <Button onClick={onComplete} variant="default" size="lg">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete & Continue
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Output Section */}
      {output && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap">
              {output}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {testResults && (
        <Card className={cn(
          "border-2",
          testResults.passed ? "border-green-500" : "border-orange-500"
        )}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {testResults.passed ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Tests Passed!
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-orange-500" />
                  Requirements Check
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{testResults.message}</p>
              {testResults.details && (
                <div className="space-y-1">
                  {testResults.details.map((detail, i) => (
                    <div
                      key={i}
                      className={cn(
                        "text-sm font-mono",
                        detail.startsWith("✓") ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
                      )}
                    >
                      {detail}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Status */}
      {isCompleted && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Exercise Completed!</AlertTitle>
          <AlertDescription>
            You've successfully completed this exercise. Feel free to experiment more or move on to the next lesson.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
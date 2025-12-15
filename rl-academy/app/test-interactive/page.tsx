"use client";

import InteractiveQuestion from "@/components/lessons/InteractiveQuestion";
import { InteractiveQuestion as IQuestion } from "@/types/curriculum";

export default function TestPage() {
  const testQuestion: IQuestion = {
    id: "test-1",
    question: "What do you think would happen if we set epsilon to 0 in the epsilon-greedy strategy? How would the agent behave?",
    context: "Remember that epsilon controls the probability of exploration (choosing a random action) versus exploitation (choosing the best known action).",
    expectedConcepts: ["greedy", "exploitation", "no exploration", "stuck", "suboptimal"],
  };

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Interactive Question Test</h1>
      <p className="mb-4">This is a test page to verify the interactive questions work correctly.</p>

      <InteractiveQuestion
        question={testQuestion}
        onAnswer={(id, answer, feedback) => {
          console.log("Answer received:", { id, answer, feedback });
        }}
      />

      <div className="mt-8 p-4 border rounded bg-muted">
        <p className="text-sm">Open the browser console to see logs when you submit an answer.</p>
      </div>
    </div>
  );
}
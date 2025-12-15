import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { question, context, userAnswer, concepts, rubric } = await request.json();

    // For production, you would call OpenAI or Anthropic API here
    // Example with OpenAI:
    /*
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert RL teacher evaluating student answers.
            Evaluate based on understanding, not just correctness.
            Score 0-100 based on comprehension depth.
            Provide constructive feedback and suggestions.`
        },
        {
          role: "user",
          content: `
            Question: ${question}
            Context: ${context || 'None'}
            Key Concepts: ${concepts.join(', ')}
            Student Answer: ${userAnswer}

            Evaluate this answer and provide:
            1. Score (0-100)
            2. Feedback message
            3. Specific suggestions for improvement
            4. Optional follow-up question if score > 70
          `
        }
      ],
    });

    const result = parseAIResponse(completion.choices[0].message.content);
    return NextResponse.json(result);
    */

    // For demo, use intelligent rule-based evaluation
    const evaluation = evaluateAnswerLocally(
      question,
      userAnswer,
      concepts,
      rubric
    );

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate answer' },
      { status: 500 }
    );
  }
}

function evaluateAnswerLocally(
  question: string,
  answer: string,
  concepts: string[],
  rubric?: any
) {
  const answerLower = answer.toLowerCase();
  const answerLength = answer.length;

  // Check for key concepts
  const mentionedConcepts = concepts.filter(concept =>
    answerLower.includes(concept.toLowerCase())
  );
  const conceptCoverage = mentionedConcepts.length / concepts.length;

  // Analyze answer quality
  let score = 0;
  let feedback = "";
  let suggestions = [];

  // Length check
  if (answerLength < 50) {
    score = 30;
    feedback = "Your answer is too brief. RL concepts require detailed explanation.";
    suggestions = [
      "Expand on your reasoning",
      "Include examples or scenarios",
      "Explain the 'why' behind your answer"
    ];
  } else if (answerLength < 100) {
    score = 50 + (conceptCoverage * 20);
    feedback = "You're on the right track but could elaborate more.";
    suggestions = [
      "Provide more detail on the implications",
      "Consider edge cases or variations"
    ];
  } else {
    // Good length, evaluate based on concepts
    score = 60 + (conceptCoverage * 40);

    if (conceptCoverage === 1) {
      feedback = "Excellent! You've covered all the key concepts thoroughly.";
      suggestions = [
        "Great understanding of the core concepts",
        "Well-reasoned explanation"
      ];
    } else if (conceptCoverage >= 0.5) {
      feedback = "Good answer! You've grasped the main ideas.";
      suggestions = [
        "You correctly identified key aspects",
        `Consider also discussing: ${concepts.filter(c => !mentionedConcepts.includes(c))[0]}`
      ];
    } else {
      feedback = "Your answer shows some understanding but misses key points.";
      suggestions = [
        `Important concept to consider: ${concepts[0]}`,
        "Think about how this relates to the broader RL framework"
      ];
    }
  }

  // Check for specific RL keywords that indicate understanding
  const rlKeywords = ['policy', 'value', 'reward', 'state', 'action', 'exploration', 'exploitation', 'convergence', 'optimal', 'bellman', 'discount', 'episode'];
  const usedKeywords = rlKeywords.filter(keyword => answerLower.includes(keyword));

  if (usedKeywords.length >= 3) {
    score = Math.min(100, score + 10);
    suggestions.push("Good use of RL terminology");
  }

  // Add follow-up for high scores
  let followUp = undefined;
  if (score >= 70) {
    followUp = generateFollowUp(question, mentionedConcepts);
  }

  return {
    score: Math.round(score),
    message: feedback,
    suggestions: suggestions.slice(0, 3),
    followUp
  };
}

function generateFollowUp(originalQuestion: string, mentionedConcepts: string[]) {
  const followUps = [
    "How would this change if we considered a continuous action space instead?",
    "What would happen in a non-stationary environment?",
    "How does this relate to the exploration-exploitation tradeoff?",
    "Can you think of a real-world scenario where this would apply?",
    "What are the computational implications of this approach?",
    "How would you modify this for a multi-agent setting?"
  ];

  // Select a relevant follow-up based on concepts
  if (mentionedConcepts.includes('exploration') || mentionedConcepts.includes('exploitation')) {
    return "How would you balance this tradeoff in practice?";
  }
  if (mentionedConcepts.includes('convergence')) {
    return "What conditions need to be met for convergence?";
  }
  if (mentionedConcepts.includes('policy')) {
    return "How would this policy perform in a stochastic environment?";
  }

  // Return a random follow-up
  return followUps[Math.floor(Math.random() * followUps.length)];
}
import { NextRequest, NextResponse } from 'next/server';

// Function to call OpenAI API if configured
async function callOpenAI(
  question: string,
  answer: string,
  context?: string,
  expectedConcepts?: string[],
  followUpPrompt?: string
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const systemPrompt = `You are an AI tutor helping students learn reinforcement learning concepts.
Provide constructive, encouraging feedback on their answers.
Be specific about what they got right and gently correct any misconceptions.
Keep responses concise but informative (2-3 paragraphs).
Use examples when helpful.`;

    const userPrompt = `Question: ${question}
${context ? `Context: ${context}` : ''}
${expectedConcepts ? `Key concepts to address: ${expectedConcepts.join(', ')}` : ''}

Student's Answer: ${answer}

${followUpPrompt || 'Please provide feedback on this answer, highlighting strengths and areas for improvement.'}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return null;
  }
}

// This is a mock evaluation function used as fallback when no API key is configured
async function evaluateWithLLM(
  question: string,
  answer: string,
  context?: string,
  expectedConcepts?: string[],
  sampleAnswers?: any,
  followUpPrompt?: string
): Promise<string> {
  // For now, we'll provide intelligent mock responses based on common patterns
  // In production, replace this with actual LLM API calls

  const lowerAnswer = answer.toLowerCase();
  const lowerQuestion = question.toLowerCase();

  console.log('Evaluating question:', question);
  console.log('User answer:', answer);

  // Check if this is an epsilon-related question
  if (lowerQuestion.includes('epsilon')) {
    if (lowerQuestion.includes('set epsilon to 0') || lowerQuestion.includes('epsilon to 0') || lowerQuestion.includes('epsilon is 0') || lowerQuestion.includes('epsilon=0') || lowerQuestion.includes('ε=0')) {
      if (lowerAnswer.includes('exploit') || lowerAnswer.includes('greedy') || lowerAnswer.includes('no explor')) {
        return `Great thinking! You're absolutely right.

When epsilon = 0, the agent becomes **purely greedy** (100% exploitation, 0% exploration). It will always choose the action with the highest estimated value based on its current knowledge.

**The consequence:** The agent might get stuck with a suboptimal strategy early on. If the first arm it tries happens to give a decent reward, it will never explore other arms that might be better. This is like only eating at the first restaurant you tried and never discovering there's an amazing place next door!

This highlights why some exploration is usually necessary for good long-term performance.`;
      } else if (lowerAnswer.includes('explor')) {
        return `Interesting thought, but not quite!

Actually, when epsilon = 0, there's **no exploration at all**. The agent becomes purely greedy, always choosing what it currently thinks is best.

Think of it this way: epsilon is the probability of exploring. So epsilon = 0 means 0% chance of exploration, which means 100% exploitation. The agent will stick with whatever seems best based on its limited initial experience, potentially missing out on better options.`;
      }
    } else if (lowerQuestion.includes('epsilon is 1') || lowerQuestion.includes('epsilon=1') || lowerQuestion.includes('ε=1') || (lowerQuestion.includes('opposite') && lowerQuestion.includes('1'))) {
      if (lowerAnswer.includes('random') || lowerAnswer.includes('explor') || lowerAnswer.includes('no exploit')) {
        return `Excellent! You've got it!

When epsilon = 1, the agent becomes **purely random** (100% exploration, 0% exploitation). It will always choose a random action, completely ignoring what it has learned about which actions are good or bad.

**The consequence:** The agent never benefits from its learning! Even after 900 pulls, when it might know that arm #7 is clearly the best, it still picks randomly. This is like flipping a coin to choose a restaurant even after eating at all of them 100 times!

This shows why pure exploration is just as problematic as pure exploitation. We need a balance - typically epsilon values between 0.1 and 0.3 work well.`;
      } else if (lowerAnswer.includes('exploit') || lowerAnswer.includes('greedy')) {
        return `Good attempt, but that's backwards!

When epsilon = 1, we get **maximum exploration**, not exploitation. Remember: epsilon represents the probability of choosing a random exploratory action.

So epsilon = 1 means 100% chance of exploration - the agent always picks randomly and never uses what it has learned. It's like having all this knowledge about which slot machines pay best, but ignoring it completely and picking randomly every time!`;
      }
    }

    // Generic epsilon question
    if (lowerAnswer.includes('trade') || lowerAnswer.includes('balance') || lowerAnswer.includes('explor')) {
      return `Good thinking about the exploration-exploitation trade-off!

Epsilon controls how often the agent explores (tries random actions) versus exploits (chooses the best known action).

- **Low epsilon** (like 0.1): Mostly exploitation with occasional exploration
- **High epsilon** (like 0.9): Mostly exploration with occasional exploitation
- **epsilon = 0**: Pure exploitation (greedy)
- **epsilon = 1**: Pure exploration (random)

The key insight is that we usually want something in between - enough exploration to discover good options, but enough exploitation to benefit from what we learn!`;
    }
  }

  // Check for Q-value related questions
  if (question.toLowerCase().includes('q-value') || question.toLowerCase().includes('q value')) {
    if (lowerAnswer.includes('expect') || lowerAnswer.includes('average') || lowerAnswer.includes('reward')) {
      return `Excellent understanding!

You're right that Q-values represent the **expected reward** for taking an action. In the multi-armed bandit case, Q(a) tells us what we expect to get from pulling arm 'a' based on our past experience.

The key is that these are **estimates** that improve over time. Initially, we might think arm #3 has Q=5, but after more pulls, we learn it's actually closer to Q=7. This learning process is at the heart of reinforcement learning!`;
    }
  }

  // Generic encouraging response for any reasonable attempt
  if (answer.length > 20) {
    return `Thank you for your thoughtful response!

Your thinking shows you're engaging with the material. ${
      expectedConcepts && expectedConcepts.length > 0
        ? `Key concepts to consider here include: ${expectedConcepts.join(', ')}. `
        : ''
    }

The important thing is that you're thinking through these problems actively. Each question is designed to help you build intuition about how these algorithms behave in different scenarios.

Keep exploring these ideas - asking "what if?" questions is exactly how you develop deep understanding of reinforcement learning!`;
  }

  // Short answer response
  return `Thanks for your answer! Try to elaborate a bit more on your thinking.

What specific consequences or behaviors would you expect? Walking through your reasoning step-by-step will help solidify your understanding.

Remember, there's no "wrong" answer here - the goal is to think through the implications and build your intuition!`;
}

export async function POST(request: NextRequest) {
  try {
    console.log('API: Received evaluate-answer request');
    const body = await request.json();
    const { question, answer, context, expectedConcepts, sampleAnswers, followUpPrompt } = body;

    console.log('API: Question:', question);
    console.log('API: Answer:', answer);

    if (!question || !answer) {
      console.error('API: Missing required fields');
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    // Try to get real LLM feedback first, fall back to mock if not available
    let feedback = await callOpenAI(
      question,
      answer,
      context,
      expectedConcepts,
      followUpPrompt
    );

    // Fall back to mock evaluation if OpenAI is not configured or fails
    if (!feedback) {
      console.log('Using mock evaluation (no API key or API call failed)');
      feedback = await evaluateWithLLM(
        question,
        answer,
        context,
        expectedConcepts,
        sampleAnswers,
        followUpPrompt
      );
    }

    console.log('API: Generated feedback:', feedback ? feedback.substring(0, 100) + '...' : 'No feedback');

    const response = {
      feedback,
      score: 100, // In a real implementation, you might calculate a score
    };

    console.log('API: Sending response with feedback length:', feedback?.length || 0);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate answer' },
      { status: 500 }
    );
  }
}
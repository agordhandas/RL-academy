import { Module, Lesson, LessonType } from "@/types/curriculum";

// Simplified curriculum data structure
// In production, this would be loaded from a database or external files

const module1: Module = {
  id: "module-1",
  number: 1,
  title: "Foundations of Reinforcement Learning",
  description: "Core RL concepts, MDPs, value functions, policies",
  prerequisites: [],
  estimatedHours: 8,
  lessons: [
    {
      id: "lesson-1-1",
      type: "theory" as LessonType,
      title: "What is Reinforcement Learning?",
      description: "Introduction to the RL paradigm and core concepts",
      estimatedMinutes: 30,
      content: `# What is Reinforcement Learning?

Reinforcement Learning (RL) is a type of machine learning where an agent learns to make decisions by interacting with an environment...`
    },
    {
      id: "lesson-1-2",
      type: "quiz" as LessonType,
      title: "RL Basics Quiz",
      description: "Test your understanding of basic RL concepts",
      estimatedMinutes: 15,
      questions: [
        {
          id: "q1",
          type: "multiple-choice",
          question: "What is the main goal of an RL agent?",
          options: [
            "To minimize the loss function",
            "To maximize the cumulative reward",
            "To classify data correctly",
            "To predict future values"
          ],
          correctAnswer: 1,
          explanation: "The primary goal of an RL agent is to maximize the cumulative reward over time.",
          hints: ["Think about what the agent is trying to optimize"]
        }
      ]
    },
    {
      id: "lesson-1-3",
      type: "exercise" as LessonType,
      title: "Build a Simple Grid World",
      description: "Create your first RL environment",
      estimatedMinutes: 45,
      starterCode: `class GridWorld:
    def __init__(self, size=5):
        self.size = size
        self.reset()

    def reset(self):
        # TODO: Initialize agent position to (0, 0)
        # TODO: Set goal position to (size-1, size-1)
        pass

    def step(self, action):
        # TODO: Implement movement logic
        # Actions: 0=up, 1=right, 2=down, 3=left
        pass`,
      solution: `class GridWorld:
    def __init__(self, size=5):
        self.size = size
        self.reset()

    def reset(self):
        self.agent_pos = [0, 0]
        self.goal_pos = [self.size-1, self.size-1]
        return self.agent_pos

    def step(self, action):
        # Movement logic
        if action == 0 and self.agent_pos[0] > 0:  # Up
            self.agent_pos[0] -= 1
        elif action == 1 and self.agent_pos[1] < self.size - 1:  # Right
            self.agent_pos[1] += 1
        elif action == 2 and self.agent_pos[0] < self.size - 1:  # Down
            self.agent_pos[0] += 1
        elif action == 3 and self.agent_pos[1] > 0:  # Left
            self.agent_pos[1] -= 1

        # Check if goal reached
        done = self.agent_pos == self.goal_pos
        reward = 1.0 if done else -0.01

        return self.agent_pos, reward, done`,
      tests: [
        {
          name: "Test initialization",
          description: "Check if environment initializes correctly",
          testCode: `env = GridWorld(5)
assert env.agent_pos == [0, 0]
assert env.goal_pos == [4, 4]`
        }
      ],
      hints: [
        "Remember to handle boundary conditions when moving",
        "The reward should be positive for reaching the goal"
      ]
    },
    {
      id: "lesson-1-4",
      type: "theory" as LessonType,
      title: "Markov Decision Processes",
      description: "Understanding MDPs - the foundation of RL",
      estimatedMinutes: 40,
      content: `# Markov Decision Processes (MDPs)

An MDP is a mathematical framework for modeling decision-making in situations where outcomes are partly random and partly under the control of a decision maker...`
    }
  ]
};

const module2: Module = {
  id: "module-2",
  number: 2,
  title: "Tabular Solution Methods",
  description: "Dynamic programming, Monte Carlo, TD learning",
  prerequisites: ["module-1"],
  estimatedHours: 12,
  lessons: [
    {
      id: "lesson-2-1",
      type: "theory" as LessonType,
      title: "Dynamic Programming - Policy Evaluation",
      description: "Learn to evaluate policies using dynamic programming",
      estimatedMinutes: 35,
      content: `# Dynamic Programming - Policy Evaluation

Policy evaluation is the process of determining the value function for a given policy...`
    },
    {
      id: "lesson-2-2",
      type: "exercise" as LessonType,
      title: "Implement Policy Evaluation",
      description: "Code the policy evaluation algorithm",
      estimatedMinutes: 60,
      starterCode: `def policy_evaluation(env, policy, gamma=0.9, theta=1e-6):
    """
    Evaluate a policy given an environment and a policy.

    Args:
        env: Environment with env.P (transition probabilities)
        policy: [S, A] shaped matrix representing the policy
        gamma: Discount factor
        theta: Convergence threshold

    Returns:
        V: Value function for the given policy
    """
    # TODO: Implement policy evaluation
    pass`,
      hints: ["Use the Bellman expectation equation", "Iterate until convergence"]
    },
    {
      id: "lesson-2-3",
      type: "theory" as LessonType,
      title: "Q-Learning",
      description: "Master the most popular model-free RL algorithm",
      estimatedMinutes: 45,
      content: `# Q-Learning: Off-Policy TD Control

Q-learning is one of the most important breakthroughs in reinforcement learning...`
    }
  ]
};

const module3: Module = {
  id: "module-3",
  number: 3,
  title: "Function Approximation",
  description: "Scale RL beyond tabular methods using function approximation",
  prerequisites: ["module-2"],
  estimatedHours: 14,
  lessons: [
    {
      id: "lesson-3-1",
      type: "theory" as LessonType,
      title: "Why Function Approximation?",
      description: "Understanding the need for generalization in large state spaces",
      estimatedMinutes: 30,
      content: `# Why Function Approximation?

When state spaces become large or continuous, tabular methods become impractical...`
    }
  ]
};

const module4: Module = {
  id: "module-4",
  number: 4,
  title: "Deep Q-Networks (DQN)",
  description: "Deep RL breakthroughs for high-dimensional inputs",
  prerequisites: ["module-3"],
  estimatedHours: 16,
  lessons: [
    {
      id: "lesson-4-1",
      type: "theory" as LessonType,
      title: "The DQN Algorithm",
      description: "Learn the breakthrough algorithm that started deep RL",
      estimatedMinutes: 40,
      content: `# Deep Q-Networks (DQN)

DQN combines Q-learning with deep neural networks to handle high-dimensional state spaces...`
    }
  ]
};

const module5: Module = {
  id: "module-5",
  number: 5,
  title: "Policy Gradient Methods",
  description: "Directly optimize policy instead of value function",
  prerequisites: ["module-4"],
  estimatedHours: 14,
  lessons: [
    {
      id: "lesson-5-1",
      type: "theory" as LessonType,
      title: "Introduction to Policy Gradients",
      description: "Understanding direct policy optimization",
      estimatedMinutes: 35,
      content: `# Policy Gradient Methods

Instead of learning a value function and deriving a policy, we can directly optimize the policy...`
    }
  ]
};

const module6: Module = {
  id: "module-6",
  number: 6,
  title: "Advanced Policy Optimization",
  description: "State-of-the-art policy gradient methods (PPO, TRPO)",
  prerequisites: ["module-5"],
  estimatedHours: 16,
  lessons: [
    {
      id: "lesson-6-1",
      type: "theory" as LessonType,
      title: "Trust Region Policy Optimization",
      description: "Learn TRPO for stable policy updates",
      estimatedMinutes: 45,
      content: `# Trust Region Policy Optimization (TRPO)

TRPO ensures monotonic improvement by constraining policy updates...`
    }
  ]
};

const module7: Module = {
  id: "module-7",
  number: 7,
  title: "Model-Based RL",
  description: "Learn dynamics model, use it for planning and learning",
  prerequisites: ["module-6"],
  estimatedHours: 12,
  lessons: [
    {
      id: "lesson-7-1",
      type: "theory" as LessonType,
      title: "Introduction to Model-Based RL",
      description: "When and how to learn environment models",
      estimatedMinutes: 35,
      content: `# Model-Based Reinforcement Learning

Model-based RL learns a model of the environment and uses it for planning...`
    }
  ]
};

const module8: Module = {
  id: "module-8",
  number: 8,
  title: "Multi-Agent RL & Advanced Topics",
  description: "Multi-agent systems, RLHF basics, and cutting-edge topics",
  prerequisites: ["module-7"],
  estimatedHours: 14,
  lessons: [
    {
      id: "lesson-8-1",
      type: "theory" as LessonType,
      title: "Introduction to Multi-Agent RL",
      description: "Learning in environments with multiple agents",
      estimatedMinutes: 40,
      content: `# Multi-Agent Reinforcement Learning

When multiple agents learn and interact in the same environment...`
    }
  ]
};

export const curriculum = {
  title: "Reinforcement Learning Mastery",
  description: "A comprehensive curriculum for mastering RL from basics to advanced topics",
  modules: [module1, module2, module3, module4, module5, module6, module7, module8]
};
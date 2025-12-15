import { Module, Lesson, LessonType, AIQuestion } from "@/types/curriculum";

// Module 1: Foundations of RL - With thoughtful AI questions
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

## The Core Idea

Reinforcement Learning (RL) is fundamentally different from supervised and unsupervised learning. Instead of learning from a fixed dataset, an RL agent learns by **interacting** with an environment and receiving feedback in the form of rewards.

## The RL Framework

At its heart, RL involves:
- An **agent** that takes actions
- An **environment** that responds to those actions
- **Rewards** that signal how good or bad the actions were
- A **goal** to maximize cumulative reward over time

## Key Differences from Other ML Paradigms

### Supervised Learning
- Has labeled training data (input → correct output)
- Learns to map inputs to outputs
- Feedback is immediate and direct

### Reinforcement Learning
- No labeled data - only rewards
- Must discover which actions yield rewards through trial and error
- Feedback can be delayed (credit assignment problem)
- Actions affect future states (sequential decision making)

## The Exploration-Exploitation Tradeoff

One of the fundamental challenges in RL is balancing:
- **Exploration**: Trying new actions to discover their rewards
- **Exploitation**: Using what you've learned to get rewards

This tradeoff doesn't exist in supervised learning but is central to RL.

## Real-World Examples

1. **Game Playing**: AlphaGo learning Go by playing millions of games
2. **Robotics**: A robot learning to walk by trying different gaits
3. **Resource Management**: Optimizing energy consumption in data centers
4. **Recommendation Systems**: Learning user preferences through interactions

## Why RL Matters

RL is powerful because it can:
- Learn without human-labeled data
- Adapt to changing environments
- Discover strategies humans might not think of
- Handle sequential decision problems

But it also has challenges:
- Sample inefficiency (needs many interactions)
- Reward design is crucial and difficult
- Safety concerns during exploration
- Convergence can be slow or unstable`
    },
    {
      id: "lesson-1-2",
      type: "quiz" as LessonType,
      title: "Understanding RL Fundamentals",
      description: "Deep conceptual questions about RL basics",
      estimatedMinutes: 20,
      aiQuestions: [
        {
          id: "q1",
          question: "Imagine you're teaching a robot to make coffee. Compare how you would approach this using supervised learning versus reinforcement learning. What are the key differences in data requirements and learning process?",
          context: "Consider what training data you'd need, how feedback works, and what challenges each approach would face.",
          concepts: ["trial-and-error", "labeled data", "reward signal", "exploration"],
          hints: [
            "Think about what kind of data supervised learning needs vs what RL needs",
            "Consider how the robot would learn from mistakes in each approach",
            "How would you define 'success' in each paradigm?"
          ],
          rubric: {
            excellent: [
              "Mentions supervised learning needs labeled examples of correct coffee-making sequences",
              "Notes RL learns through trial and error with rewards",
              "Discusses exploration of different techniques in RL",
              "Mentions the challenge of defining intermediate rewards in RL"
            ],
            good: [
              "Identifies the data difference (labeled vs rewards)",
              "Mentions trial and error learning",
              "Notes some practical differences"
            ],
            needsWork: [
              "Confusion between the two paradigms",
              "Missing the key distinction about data requirements",
              "Not addressing the learning process differences"
            ]
          }
        },
        {
          id: "q2",
          question: "Explain the exploration-exploitation tradeoff using a real-world scenario (not a multi-armed bandit). Why is this tradeoff fundamental to RL but not to supervised learning?",
          concepts: ["exploration", "exploitation", "uncertainty", "learning dynamics"],
          hints: [
            "Think of a scenario where you must choose between something you know works vs trying something new",
            "Consider why supervised learning doesn't face this dilemma",
            "What happens if you only explore? Only exploit?"
          ],
          followUp: "How would you balance exploration and exploitation in your example? What factors would influence your strategy?"
        },
        {
          id: "q3",
          question: "A chess-playing RL agent loses its first 1000 games but eventually becomes unbeatable. A supervised learning model trained on grandmaster games plays well immediately. Discuss the pros and cons of each approach and when you'd choose one over the other.",
          context: "Consider learning efficiency, final performance, adaptability, and discovery of novel strategies.",
          concepts: ["sample efficiency", "generalization", "novel strategies", "adaptability"],
          hints: [
            "Think about what happens when the rules slightly change",
            "Consider which approach might discover completely new strategies",
            "What are the computational costs of each approach?"
          ],
          rubric: {
            excellent: [
              "Notes RL can discover novel strategies beyond training data",
              "Discusses supervised learning's immediate good performance",
              "Mentions RL's poor sample efficiency but potential for superhuman play",
              "Considers adaptability to rule changes or new opponents"
            ],
            good: [
              "Identifies the time/performance tradeoff",
              "Mentions novel strategy discovery",
              "Discusses some practical considerations"
            ],
            needsWork: [
              "Only focuses on one approach",
              "Misses the key advantages of each method",
              "Doesn't consider practical tradeoffs"
            ]
          }
        }
      ]
    },
    {
      id: "lesson-1-3",
      type: "theory" as LessonType,
      title: "Markov Decision Processes",
      description: "The mathematical framework underlying RL",
      estimatedMinutes: 40,
      content: `# Markov Decision Processes (MDPs)

## The Mathematical Framework

An MDP is defined by a tuple (S, A, P, R, γ) where:
- **S**: Set of states
- **A**: Set of actions
- **P**: Transition probability P(s'|s,a)
- **R**: Reward function R(s,a,s')
- **γ**: Discount factor [0,1]

## The Markov Property

"The future is independent of the past given the present"

Formally: P(s_{t+1}|s_t, a_t, s_{t-1}, a_{t-1}, ...) = P(s_{t+1}|s_t, a_t)

This means the current state contains all information needed to decide what to do next.

## Why the Markov Property Matters

1. **Simplification**: We don't need to remember entire history
2. **Tractability**: Makes the math manageable
3. **Sufficiency**: Current state is sufficient statistic for the future

## Components Deep Dive

### States
- Represent the situation the agent is in
- Must contain enough information to be Markov
- Can be discrete (chess positions) or continuous (robot joint angles)

### Actions
- Choices available to the agent
- Can depend on current state (state-dependent action spaces)
- Discrete (move left/right) or continuous (steering angle)

### Transition Dynamics
- P(s'|s,a): Probability of reaching s' from s when taking action a
- Captures the environment's response to actions
- Can be deterministic (P=1 for one outcome) or stochastic

### Rewards
- Scalar feedback signal
- Defines the goal implicitly
- Can be sparse (only at goal) or dense (every step)
- Reward hypothesis: All goals can be described as maximization of cumulative reward

### Discount Factor γ
- Weighs immediate vs future rewards
- γ=0: Only care about immediate reward (myopic)
- γ=1: Future rewards as important as immediate (can lead to infinite returns)
- γ∈(0,1): Balance between immediate and future

## The Goal in an MDP

Maximize expected cumulative discounted reward:

E[∑_{t=0}^∞ γ^t r_t]

This objective naturally handles:
- Infinite horizons (discounting ensures convergence)
- Uncertainty (expectation over randomness)
- Time preference (earlier rewards worth more)`
    },
    {
      id: "lesson-1-4",
      type: "quiz" as LessonType,
      title: "MDP Conceptual Understanding",
      description: "Explore the depth of MDP concepts",
      estimatedMinutes: 25,
      aiQuestions: [
        {
          id: "q1",
          question: "Consider a self-driving car. What information would you include in the state representation to satisfy the Markov property? What would happen if you left out important information?",
          context: "Think about what the car needs to know to make safe driving decisions without knowing its past observations.",
          concepts: ["markov property", "state representation", "sufficient statistics", "partial observability"],
          hints: [
            "What does the car need to know about its surroundings?",
            "Consider both static (road layout) and dynamic (other vehicles) elements",
            "What happens if you only include position but not velocity?"
          ],
          relatedCode: `# Example state representation
state = {
    'position': (x, y),
    'velocity': (vx, vy),
    'nearby_vehicles': [...],
    # What else?
}`
        },
        {
          id: "q2",
          question: "Explain what would happen in an RL agent's behavior if the discount factor γ=0 versus γ=0.99. Use a specific example like a robot navigating to a charging station.",
          concepts: ["discount factor", "myopic behavior", "long-term planning", "convergence"],
          hints: [
            "With γ=0, how far ahead does the agent plan?",
            "How would path selection differ between the two cases?",
            "Consider a path with small negative rewards (-1 per step) leading to a big reward (+100)"
          ],
          followUp: "What problems might arise if γ=1 in a continuing task with positive rewards?"
        },
        {
          id: "q3",
          question: "A cleaning robot gets +1 reward for cleaning dirt and -0.1 for each movement. Analyze how this reward structure shapes behavior. What unexpected behaviors might emerge?",
          context: "Consider both intended and unintended consequences of this reward design.",
          concepts: ["reward shaping", "unintended behavior", "sparse vs dense rewards", "reward hacking"],
          hints: [
            "What happens if the robot finds a very dirty area?",
            "How does the movement penalty affect exploration?",
            "Could the robot learn any 'cheating' strategies?"
          ],
          rubric: {
            excellent: [
              "Identifies the tradeoff between moving to find dirt and movement cost",
              "Mentions potential for robot to stay in dirty areas or create dirt",
              "Discusses how this shapes exploration vs exploitation",
              "Notes the importance of reward design in getting desired behavior"
            ],
            good: [
              "Recognizes the movement penalty discourages exploration",
              "Mentions some potential behaviors",
              "Shows understanding of reward shaping"
            ],
            needsWork: [
              "Only describes the obvious intended behavior",
              "Doesn't consider unintended consequences",
              "Misunderstands the role of rewards"
            ]
          }
        },
        {
          id: "q4",
          question: "Why might the Markov property be violated in real-world problems? Give an example and explain how you might address this violation.",
          concepts: ["partial observability", "history dependence", "state augmentation", "recurrent policies"],
          hints: [
            "Think about situations where current observation doesn't tell the whole story",
            "Consider sensor limitations or hidden information",
            "How could you augment the state to restore the Markov property?"
          ]
        }
      ]
    },
    {
      id: "lesson-1-5",
      type: "exercise" as LessonType,
      title: "Build Your First RL Environment",
      description: "Create a simple GridWorld environment",
      estimatedMinutes: 45,
      starterCode: `import numpy as np
import matplotlib.pyplot as plt

class GridWorld:
    """
    A simple grid world environment where an agent navigates to a goal.
    """
    def __init__(self, size=5, start_pos=(0, 0), goal_pos=(4, 4)):
        self.size = size
        self.start_pos = start_pos
        self.goal_pos = goal_pos
        self.reset()

    def reset(self):
        """Reset the environment to initial state."""
        # TODO: Set agent position to start_pos
        # TODO: Return the initial state
        pass

    def step(self, action):
        """
        Take an action and return (next_state, reward, done, info).
        Actions: 0=up, 1=right, 2=down, 3=left
        """
        # TODO: Update agent position based on action
        # TODO: Handle boundary conditions (can't move outside grid)
        # TODO: Calculate reward (small negative per step, positive at goal)
        # TODO: Check if episode is done (reached goal)
        pass

    def render(self):
        """Visualize the current state of the environment."""
        # TODO: Create a visual representation of the grid
        # TODO: Show agent position and goal position
        pass

# Test your environment
env = GridWorld()
state = env.reset()
print(f"Initial state: {state}")

# Try taking some actions
for action in [1, 1, 2, 2]:  # right, right, down, down
    next_state, reward, done, info = env.step(action)
    print(f"Action {action}: state={next_state}, reward={reward}, done={done}")
    if done:
        break

env.render()`,
      solution: `import numpy as np
import matplotlib.pyplot as plt

class GridWorld:
    """
    A simple grid world environment where an agent navigates to a goal.
    """
    def __init__(self, size=5, start_pos=(0, 0), goal_pos=(4, 4)):
        self.size = size
        self.start_pos = start_pos
        self.goal_pos = goal_pos
        self.reset()

    def reset(self):
        """Reset the environment to initial state."""
        self.agent_pos = list(self.start_pos)
        return tuple(self.agent_pos)

    def step(self, action):
        """
        Take an action and return (next_state, reward, done, info).
        Actions: 0=up, 1=right, 2=down, 3=left
        """
        # Store old position in case we hit a wall
        old_pos = self.agent_pos.copy()

        # Update position based on action
        if action == 0 and self.agent_pos[0] > 0:  # Up
            self.agent_pos[0] -= 1
        elif action == 1 and self.agent_pos[1] < self.size - 1:  # Right
            self.agent_pos[1] += 1
        elif action == 2 and self.agent_pos[0] < self.size - 1:  # Down
            self.agent_pos[0] += 1
        elif action == 3 and self.agent_pos[1] > 0:  # Left
            self.agent_pos[1] -= 1

        # Calculate reward
        if tuple(self.agent_pos) == self.goal_pos:
            reward = 10.0  # Large positive reward for reaching goal
            done = True
        else:
            reward = -0.1  # Small negative reward for each step
            done = False

        # Additional info
        info = {
            'old_pos': old_pos,
            'hit_wall': old_pos == self.agent_pos
        }

        return tuple(self.agent_pos), reward, done, info

    def render(self):
        """Visualize the current state of the environment."""
        grid = np.zeros((self.size, self.size))

        # Mark goal
        grid[self.goal_pos] = 0.5

        # Mark agent
        grid[tuple(self.agent_pos)] = 1.0

        plt.figure(figsize=(6, 6))
        plt.imshow(grid, cmap='coolwarm', vmin=0, vmax=1)
        plt.colorbar(label='Agent=1, Goal=0.5')
        plt.title('GridWorld Environment')
        plt.grid(True, alpha=0.3)

        # Add labels
        for i in range(self.size):
            for j in range(self.size):
                if (i, j) == tuple(self.agent_pos):
                    plt.text(j, i, 'A', ha='center', va='center', fontsize=20, fontweight='bold')
                elif (i, j) == self.goal_pos:
                    plt.text(j, i, 'G', ha='center', va='center', fontsize=20, fontweight='bold')

        plt.xticks(range(self.size))
        plt.yticks(range(self.size))
        plt.show()

# Test your environment
env = GridWorld()
state = env.reset()
print(f"Initial state: {state}")

# Try taking some actions
for action in [1, 1, 2, 2]:  # right, right, down, down
    next_state, reward, done, info = env.step(action)
    print(f"Action {action}: state={next_state}, reward={reward:.2f}, done={done}")
    if done:
        print("Goal reached!")
        break

env.render()`,
      hints: [
        "Remember to handle boundary checking - the agent shouldn't move outside the grid",
        "The reward structure shapes the agent's behavior - consider using small negative rewards for each step",
        "The 'done' flag should be True only when the goal is reached"
      ]
    }
  ]
};

// Module 2: Tabular Methods - Focus on deep understanding
const module2: Module = {
  id: "module-2",
  number: 2,
  title: "Tabular Solution Methods",
  description: "Dynamic programming, Monte Carlo, TD learning - the foundations",
  prerequisites: ["module-1"],
  estimatedHours: 12,
  lessons: [
    {
      id: "lesson-2-1",
      type: "theory" as LessonType,
      title: "Value Functions and Bellman Equations",
      description: "Understanding value functions and their recursive nature",
      estimatedMinutes: 45,
      content: `# Value Functions and Bellman Equations

## State-Value Function V(s)

The state-value function V^π(s) represents the expected return when starting from state s and following policy π:

V^π(s) = E_π[G_t | S_t = s] = E_π[∑_{k=0}^∞ γ^k R_{t+k+1} | S_t = s]

## Action-Value Function Q(s,a)

The action-value function Q^π(s,a) represents the expected return when starting from state s, taking action a, then following policy π:

Q^π(s,a) = E_π[G_t | S_t = s, A_t = a]

## The Bellman Expectation Equations

The key insight: value functions satisfy recursive relationships.

### For V^π:
V^π(s) = ∑_a π(a|s) ∑_{s',r} p(s',r|s,a)[r + γV^π(s')]

### For Q^π:
Q^π(s,a) = ∑_{s',r} p(s',r|s,a)[r + γ ∑_{a'} π(a'|s')Q^π(s',a')]

## Why Bellman Equations Matter

1. **Recursive Structure**: Break down long-term value into immediate reward + discounted future value
2. **Foundation for Algorithms**: All RL algorithms essentially solve these equations
3. **Optimal Substructure**: Optimal solutions composed of optimal sub-solutions

## Bellman Optimality Equations

For optimal value functions:

V*(s) = max_a ∑_{s',r} p(s',r|s,a)[r + γV*(s')]

Q*(s,a) = ∑_{s',r} p(s',r|s,a)[r + γ max_{a'} Q*(s',a')]

## The Backup Diagram

A visual way to understand value updates:
- Current state branches into possible actions
- Each action branches into possible next states
- Values "back up" from future to present`
    },
    {
      id: "lesson-2-2",
      type: "quiz" as LessonType,
      title: "Deep Dive into Value Functions",
      description: "Understand value functions at a fundamental level",
      estimatedMinutes: 30,
      aiQuestions: [
        {
          id: "q1",
          question: "In a gridworld, why might V(s) be high for a state far from the goal but near a cliff, while Q(s,a) varies dramatically for different actions in that same state? What does this tell us about the relationship between V and Q?",
          context: "Consider a state where one action leads toward the goal (safe path) and another leads toward a cliff (dangerous but shorter path).",
          concepts: ["state value", "action value", "policy dependence", "risk"],
          hints: [
            "V(s) is an average over all actions under the policy",
            "Q(s,a) is specific to each action",
            "Think about what happens with different policies (cautious vs risky)"
          ]
        },
        {
          id: "q2",
          question: "Explain why the Bellman equation is recursive. What would happen if we tried to calculate values without this recursion (i.e., calculating expected returns directly)?",
          concepts: ["recursion", "computational complexity", "dynamic programming", "bootstrapping"],
          hints: [
            "Consider calculating a 100-step return directly vs recursively",
            "Think about the computational complexity of each approach",
            "How does recursion help with infinite horizons?"
          ],
          relatedCode: `# Direct calculation (without recursion):
# V(s) = E[r1 + γr2 + γ²r3 + ... + γ^(T-1)rT]

# Recursive (Bellman):
# V(s) = E[r + γV(s')]`
        },
        {
          id: "q3",
          question: "You have two policies: Policy A always chooses the action with highest immediate reward. Policy B chooses actions to maximize long-term value. In what scenarios would Policy A actually be optimal? When would it be terrible?",
          concepts: ["greedy policy", "horizon", "discount factor", "optimal policy"],
          hints: [
            "Think about the role of the discount factor",
            "Consider environments with different reward structures",
            "What if all future states have the same value?"
          ],
          followUp: "How does the discount factor γ influence which policy is better?"
        }
      ]
    },
    {
      id: "lesson-2-3",
      type: "theory" as LessonType,
      title: "Temporal Difference Learning",
      description: "Learn from incomplete episodes using bootstrapping",
      estimatedMinutes: 50,
      content: `# Temporal Difference (TD) Learning

## The Key Innovation

TD learning combines ideas from:
- **Monte Carlo**: Learn from experience without model
- **Dynamic Programming**: Bootstrap from value estimates

## TD(0) Update Rule

V(S_t) ← V(S_t) + α[R_{t+1} + γV(S_{t+1}) - V(S_t)]

Where:
- α is the learning rate
- R_{t+1} + γV(S_{t+1}) is the TD target
- R_{t+1} + γV(S_{t+1}) - V(S_t) is the TD error

## Why TD Learning is Revolutionary

### 1. Online Learning
- Update values after each step
- Don't need to wait for episode end
- Can learn from incomplete sequences

### 2. Bootstrapping
- Use current estimates to improve estimates
- Don't need complete return information
- Faster propagation of value information

### 3. Lower Variance
- Only one step of randomness (vs entire trajectory in MC)
- More stable learning
- But introduces bias from bootstrap estimates

## SARSA: On-Policy TD Control

Q(S_t, A_t) ← Q(S_t, A_t) + α[R_{t+1} + γQ(S_{t+1}, A_{t+1}) - Q(S_t, A_t)]

- Learns value of policy being followed
- Action A_{t+1} chosen by current policy
- Converges to optimal if policy improves

## Q-Learning: Off-Policy TD Control

Q(S_t, A_t) ← Q(S_t, A_t) + α[R_{t+1} + γ max_a Q(S_{t+1}, a) - Q(S_t, A_t)]

- Learns optimal Q* regardless of policy being followed
- Uses max over next actions (not actual next action)
- More sample efficient but can be less stable`
    },
    {
      id: "lesson-2-4",
      type: "quiz" as LessonType,
      title: "TD Learning Insights",
      description: "Explore the subtleties of TD methods",
      estimatedMinutes: 30,
      aiQuestions: [
        {
          id: "q1",
          question: "You mentioned alpha (learning rate). What would happen if α=0? What if α=1? What if α=0.5? Explain the tradeoffs and when you might choose each value.",
          context: "Consider both convergence speed and stability.",
          concepts: ["learning rate", "convergence", "stability", "non-stationarity"],
          hints: [
            "α=0 means no learning - what's the point?",
            "α=1 means complete replacement - when might this be good?",
            "How does α affect old vs new information?"
          ],
          followUp: "In a non-stationary environment (where rewards change over time), how would you adjust α?"
        },
        {
          id: "q2",
          question: "Compare SARSA and Q-learning in a cliff-walking scenario. The agent must reach a goal but there's a cliff with huge negative reward. Which algorithm learns a safer path and why?",
          concepts: ["on-policy", "off-policy", "exploration risk", "optimal vs safe"],
          hints: [
            "SARSA learns the value of the policy it's following (including exploration)",
            "Q-learning learns the optimal value (assuming greedy exploitation)",
            "Which one accounts for exploration mistakes during learning?"
          ],
          relatedCode: `# Cliff scenario:
# S...........G
# ############  <- cliff (-100 reward)

# SARSA update uses actual next action (might be exploratory)
# Q-learning uses best next action (assumes optimal play)`
        },
        {
          id: "q3",
          question: "TD learning 'bootstraps' - it updates estimates based on other estimates. Why doesn't this circular reasoning cause problems? When might bootstrapping actually be problematic?",
          concepts: ["bootstrapping", "bias-variance tradeoff", "convergence", "function approximation"],
          hints: [
            "Consider what happens over many updates",
            "Think about the conditions needed for convergence",
            "What if the estimates are systematically wrong?"
          ]
        },
        {
          id: "q4",
          question: "You're training an agent with Q-learning. Initially, all Q-values are 0. The agent takes an action, gets reward -1, and sees that all next-state Q-values are also 0. Walk through the exact Q-value update. What happens over multiple visits to this state?",
          context: "Use α=0.1 and γ=0.9 for concreteness.",
          concepts: ["initialization", "pessimism", "value propagation", "convergence dynamics"],
          hints: [
            "Calculate: Q = 0 + 0.1 * (-1 + 0.9 * 0 - 0)",
            "What happens on the second visit?",
            "How do values propagate backward from the goal?"
          ]
        }
      ]
    }
  ]
};

// Module 3: Scaling Up - Function Approximation
const module3: Module = {
  id: "module-3",
  number: 3,
  title: "Function Approximation",
  description: "Moving beyond tables to handle large/continuous state spaces",
  prerequisites: ["module-2"],
  estimatedHours: 14,
  lessons: [
    {
      id: "lesson-3-1",
      type: "theory" as LessonType,
      title: "Why Function Approximation?",
      description: "The necessity and challenges of generalization",
      estimatedMinutes: 35,
      content: `# Why Function Approximation?

## The Curse of Dimensionality

Tabular methods hit a wall with:
- Large state spaces (chess: 10^47 states)
- Continuous states (robot joint angles)
- High-dimensional observations (images)

## Function Approximation to the Rescue

Instead of a table entry for each state:
V(s) ≈ v̂(s, θ) where θ are parameters

Examples:
- Linear: v̂(s, θ) = θᵀφ(s)
- Neural network: v̂(s, θ) = NN(s; θ)

## The Generalization Benefit

- Learn about unseen states
- Transfer knowledge between similar states
- Compact representation

## New Challenges

1. **Convergence**: No longer guaranteed
2. **Stability**: Deadly triad can cause divergence
3. **Feature Engineering**: How to represent states?`
    },
    {
      id: "lesson-3-2",
      type: "quiz" as LessonType,
      title: "Function Approximation Concepts",
      description: "Understand the implications of approximation",
      estimatedMinutes: 25,
      aiQuestions: [
        {
          id: "q1",
          question: "You're using a neural network to approximate Q-values for a racing game. The network sees similar states (slightly different car positions) but learns very different Q-values for them. What might be happening and how would you debug this?",
          concepts: ["generalization", "overfitting", "feature representation", "training stability"],
          hints: [
            "Consider what features the network is focusing on",
            "Think about the training process - batch size, learning rate",
            "Are similar states actually similar in terms of value?"
          ]
        },
        {
          id: "q2",
          question: "Explain why the 'deadly triad' (function approximation + bootstrapping + off-policy learning) can cause divergence. What would you remove or modify to ensure stability?",
          concepts: ["deadly triad", "divergence", "stability", "convergence guarantees"],
          hints: [
            "Each component alone is fine - it's the combination",
            "Think about how errors can compound",
            "Consider what each component contributes to instability"
          ],
          followUp: "Which modern algorithms address this instability? How?"
        }
      ]
    }
  ]
};

export const enhancedCurriculum = {
  title: "Reinforcement Learning Mastery",
  description: "Learn RL through thoughtful questions and deep understanding",
  modules: [module1, module2, module3]
};
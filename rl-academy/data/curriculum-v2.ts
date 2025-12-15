import { Module, Lesson, LessonType } from "@/types/curriculum";

// MODULE 1: Learning RL Through Doing
const module1: Module = {
  id: "module-1",
  number: 1,
  title: "Foundations Through Practice",
  description: "Learn RL by building and experimenting, not memorizing theory",
  prerequisites: [],
  estimatedHours: 8,
  lessons: [
    {
      id: "lesson-1-1",
      type: "theory" as LessonType,
      title: "The Pit Escape Problem",
      description: "Introduction to RL through a concrete example",
      estimatedMinutes: 30,
      content: `# Your First RL Lesson: Learning Through a Concrete Example

Let me teach you RL through a specific problem, building up the terminology naturally as we go.

## The Problem: Pit Escape

Imagine you're controlling a small robot on a 5×5 grid. The robot starts in the top-left corner and needs to reach the goal (a charging station) in the bottom-right corner. But there are dangerous pits scattered around that the robot must avoid.

\`\`\`
[S][ ][ ][ ][ ]
[ ][X][ ][X][ ]
[ ][ ][ ][ ][ ]
[ ][X][ ][ ][ ]
[ ][ ][ ][ ][G]

S = Start (robot's position)
G = Goal (charging station)
X = Pit (falls in, game over)
\`\`\`

The robot can move: **UP, DOWN, LEFT, RIGHT**

## Building the Terminology

### States

Every possible situation the robot can be in. In our case, each grid square is a **state**.

- The robot being at position (0,0) is one state
- Being at (2,3) is a different state
- We have 25 possible states total (5×5 grid)

### Actions

What the robot can do from any state. Here: **{UP, DOWN, LEFT, RIGHT}**

From most positions, all 4 actions are available. At edges, some actions might hit a wall.

### Environment

The grid world itself. It's everything outside the robot's control - where the pits are, where the goal is, the physics of how movement works.

### Policy ($\\pi$)

The robot's strategy or "brain". It's a mapping from states to actions. A policy answers: *"When I'm at position (2,3), which direction should I move?"*

A simple policy might be: "Always move right if possible, otherwise move down." A better policy learns to avoid pits.

### Reward ($R$)

The feedback signal. After each action, the environment gives the robot a number:

- Reach goal: **+100**
- Fall in pit: **-100**
- Each normal step: **-1** (small penalty encourages finding shortest path)

### Episode

One complete run from start to finish. Robot starts at S, takes actions, and the episode ends when it reaches G (success) or falls in a pit (failure).

### Trajectory

The sequence of states and actions in an episode.

**Example:** Start(0,0) → RIGHT → (0,1) → DOWN → (1,1) → [falls in pit at (1,1)] = Episode ends

## The Core RL Problem

The robot **doesn't know where the pits are initially**. It must **learn through experience**.

**First attempt:** Robot goes right, right, down - falls in pit at (1,1). Gets rewards: -1, -1, -100.
It learns: *"Going to (1,1) is bad!"*

**Second attempt:** Robot goes right, down, down - falls in pit at (2,1).
It learns: *"That path is also bad!"*

After many attempts, the robot learns a policy that consistently reaches the goal while avoiding pits.

## Two Key Functions (This is Central to RL)

### Value Function $V(s)$: "How good is it to be in state $s$?"

- Being at (4,4) right next to goal has **high value** (you're almost done!)
- Being at (1,0) - next to a pit - has **low value** (danger!)

### Action-Value Function $Q(s,a)$: "How good is it to take action $a$ when in state $s$?"

- At (0,1): $Q$(going DOWN) is terrible (there's a pit!)
- At (0,1): $Q$(going RIGHT) might be good (safe path)

The robot learns these Q-values through experience, and uses them to choose actions.

## The Learning Loop

\`\`\`
1. Robot is in state s
2. Robot picks action a (based on current policy)
3. Environment responds:
   - Robot moves to new state s'
   - Robot receives reward r
4. Robot updates its knowledge (Q-values)
5. Repeat from step 1 with new state
\`\`\`

This is the heart of RL: **act, observe consequence, update beliefs, repeat**.

## Exploration vs Exploitation Dilemma

After 10 episodes, the robot knows going RIGHT from start is safe. But should it:

- **Exploit**: Keep doing what it knows works
- **Explore**: Try going DOWN from start (might discover a shorter path!)

This tension exists throughout learning. Too much exploitation = might miss better strategies. Too much exploration = waste time on known-bad actions.

## Why This is Different from Other ML

**Supervised Learning:** You have a dataset of correct answers. "Here are 1000 examples of correct moves in this grid."

**RL:** No dataset of correct answers! The robot must discover good moves by trying things and seeing what happens. The reward signal is much weaker than labeled data.

Also: Actions have consequences that unfold over time. Moving right now might be good because it sets up a better position later, even if the immediate reward is negative.

---

Does this click? The terminology makes more sense when you see it in action on a concrete problem.

Next, we'll implement a simpler version of this problem - one where you don't even have states! This will help you understand Q-values before we add the complexity of states and sequential decisions.`
    },
    {
      id: "lesson-1-2",
      type: "theory" as LessonType,
      title: "Multi-Armed Bandits: The Simplest RL Problem",
      description: "Learn Q-values without the complexity of states",
      estimatedMinutes: 25,
      interactiveQuestions: [
        {
          id: "iq-epsilon-zero",
          question: "What do you think would happen if we set epsilon to 0 in the epsilon-greedy strategy? How would the agent behave?",
          context: "Remember that epsilon controls the probability of exploration (choosing a random action) versus exploitation (choosing the best known action).",
          expectedConcepts: ["greedy", "exploitation", "no exploration", "stuck", "suboptimal"],
          sampleAnswers: {
            ifEpsilonZero: "The agent would become purely greedy, always exploiting and never exploring. It might get stuck with a suboptimal arm."
          }
        },
        {
          id: "iq-epsilon-one",
          question: "Now think about the opposite: what if epsilon is 1? What behavior would you expect from the agent?",
          context: "Consider what epsilon=1 means for the exploration-exploitation balance.",
          expectedConcepts: ["random", "pure exploration", "no exploitation", "never uses learning"],
          sampleAnswers: {
            ifEpsilonOne: "The agent would explore 100% of the time, choosing randomly and never using what it learned."
          }
        },
        {
          id: "iq-q-values",
          question: "Why do we call them Q-values? What do these values actually represent for each arm?",
          context: "Think about what we're trying to estimate for each slot machine.",
          expectedConcepts: ["expected reward", "action value", "quality", "estimated return"],
          sampleAnswers: {
            ifEpsilonZero: "Q-values represent the expected reward or 'quality' of taking that action (pulling that arm)."
          }
        }
      ],
      content: `# Multi-Armed Bandits: The Simplest RL Problem

## The Premise

Imagine you're in a casino with 10 slot machines (bandits). Each machine has a different (unknown) payout rate:

- Machine 1: pays out $3 on average
- Machine 2: pays out $7 on average
- Machine 3: pays out $1 on average
- etc.

You have **1000 pulls total**. Goal: **Maximize your total winnings**.

![Multi-Armed Bandits Illustration](/images/multi-armed-bandits.png)

**The catch:** You don't know which machines are good! You must learn through experience.

## Why This is RL (Simplified)

This is RL with **only actions, no states**. Every time step is identical - you just choose an arm to pull.

- **Actions**: Which machine to pull (10 choices)
- **Rewards**: Money you get from that pull
- **No states**: You're always in the same situation (standing in front of 10 machines)
- **Policy**: Your strategy for choosing which arm to pull

Because there are no states, we don't need $V(s)$. We only need:

$$Q(a) = \\text{"What's the expected reward from pulling arm } a\\text{?"}$$

If we knew the true Q-values, we'd just always pull the best arm. But we must **estimate $Q$ through experience**.

## Key Concepts We'll Implement

### 1. Action-Value Estimation

We maintain estimates of each arm's value:

\`\`\`python
Q(arm_1) = average reward we've seen from arm 1
Q(arm_2) = average reward we've seen from arm 2
...
\`\`\`

### 2. Exploration vs Exploitation

- **Exploit**: Pull the arm with highest current Q estimate
- **Explore**: Pull a different arm to learn more about it

### 3. The Update Rule

After pulling arm $a$ and getting reward $r$:

$$Q(a) = Q(a) + \\alpha \\times (r - Q(a))$$

Where $\\alpha$ (alpha) is the learning rate.

This is just: $\\text{new estimate} = \\text{old estimate} + \\text{step size} \\times (\\text{error})$

The error is $(r - Q(a))$ = "how different was this reward from what we expected?"

## Three Strategies We'll Compare

### 1. Epsilon-Greedy

**The strategy:**
- Keep track of $Q(a)$ for each arm (average reward seen so far)
- Keep track of how many times you've pulled each arm

**Each time step:**
- Flip a biased coin with probability $\\varepsilon$ (epsilon, like 0.1 = 10%)
- If coin says "explore": Pick a random arm
- If coin says "exploit": Pick the arm with highest Q value
- Pull that arm, get reward $r$
- Update $Q(a)$: $Q(a) = Q(a) + \\alpha \\times (r - Q(a))$

**Parameters to tune:**
- $\\varepsilon$ (epsilon): exploration rate, typically 0.1
- $\\alpha$ (alpha): learning rate, typically 0.1

### 2. UCB (Upper Confidence Bound)

**The strategy:**
- Keep track of $Q(a)$ for each arm
- Keep track of how many times you've pulled each arm: $N(a)$
- Keep track of total time steps: $t$

**Each time step:**
- For each arm, calculate an "optimism bonus":

$$\\text{bonus} = c \\times \\sqrt{\\frac{\\ln(t)}{N(a)}}$$

Where $c$ is exploration constant (like 2)

- Pick arm with highest: $Q(a) + \\text{bonus}$
- Pull that arm, get reward $r$
- Update $Q(a)$ the same way as epsilon-greedy
- Increment $N(a)$ and $t$

**Why this works:** Arms you haven't tried much have big bonuses (high uncertainty). The more you pull an arm, the smaller its bonus becomes. This is "optimism in face of uncertainty" - assume uncertain arms might be great!

**Parameters to tune:**
- $c$: exploration constant, typically 1-2

### 3. Thompson Sampling

**The strategy:**
- For each arm, maintain a belief distribution about its true value
- We'll use a simple version: assume each arm's reward is Normal distributed
- Track mean estimate $\\mu(a)$ and how certain we are (based on # samples)

**Each time step:**
- For each arm, sample a value from your current belief distribution:

$$\\text{sample}(a) = \\mu(a) + \\frac{1}{\\sqrt{N(a)+1}} \\times \\text{random normal}()$$

- Pick the arm with highest sampled value
- Pull that arm, get reward $r$
- Update your belief: $\\mu(a) = \\mu(a) + \\alpha \\times (r - \\mu(a))$

**Why this works:** If you're uncertain about an arm (low $N(a)$), your samples are very noisy - sometimes that arm looks amazing, so you'll try it. As you gather data, samples become more accurate.

**Parameters to tune:**
- $\\alpha$: learning rate, typically 0.1

---

In the next lessons, you'll implement all three strategies and compare them. You'll see firsthand how different exploration strategies affect learning speed and total reward!`
    },
    {
      id: "lesson-1-3",
      type: "exercise" as LessonType,
      title: "Implement Epsilon-Greedy",
      description: "Code your first RL algorithm",
      estimatedMinutes: 45,
      starterCode: `import numpy as np
import matplotlib.pyplot as plt

# First, let's create our bandit environment
class BanditEnvironment:
    """10 slot machines with different unknown payouts"""

    def __init__(self, n_arms=10):
        self.n_arms = n_arms
        # True mean reward for each arm (unknown to agent)
        self.true_values = np.random.randn(n_arms)
        # Let's make one arm clearly the best
        self.true_values[0] = self.true_values.max() + 1
        self.best_arm = np.argmax(self.true_values)

    def pull(self, arm):
        """Pull an arm, get a noisy reward around its true value"""
        # Reward = true_value + noise
        reward = self.true_values[arm] + np.random.randn()
        return reward

# TODO: Implement EpsilonGreedyAgent
class EpsilonGreedyAgent:
    def __init__(self, n_arms=10, epsilon=0.1):
        self.n_arms = n_arms
        self.epsilon = epsilon
        # TODO: Initialize Q-values to zero
        # TODO: Initialize pull counters
        pass

    def select_arm(self):
        """Choose which arm to pull using epsilon-greedy strategy"""
        # TODO: With probability epsilon, explore (pick random arm)
        # TODO: Otherwise, exploit (pick arm with highest Q)
        pass

    def update(self, arm, reward, alpha=0.1):
        """Update Q-value estimate after getting reward"""
        # TODO: Q(a) = Q(a) + alpha * (reward - Q(a))
        pass

# Test your implementation
if __name__ == "__main__":
    env = BanditEnvironment(n_arms=10)
    agent = EpsilonGreedyAgent(n_arms=10, epsilon=0.1)

    rewards_history = []

    for t in range(1000):
        arm = agent.select_arm()
        reward = env.pull(arm)
        agent.update(arm, reward)
        rewards_history.append(reward)

    print(f"Total reward: {sum(rewards_history):.2f}")
    print(f"Best arm found: {agent.Q.argmax()} (true best: {env.best_arm})")

    # Plot cumulative reward
    plt.plot(np.cumsum(rewards_history))
    plt.xlabel('Time Steps')
    plt.ylabel('Cumulative Reward')
    plt.title('Learning Progress')
    plt.show()`,
      solution: `import numpy as np
import matplotlib.pyplot as plt

class BanditEnvironment:
    """10 slot machines with different unknown payouts"""

    def __init__(self, n_arms=10):
        self.n_arms = n_arms
        self.true_values = np.random.randn(n_arms)
        self.true_values[0] = self.true_values.max() + 1
        self.best_arm = np.argmax(self.true_values)

    def pull(self, arm):
        reward = self.true_values[arm] + np.random.randn()
        return reward

class EpsilonGreedyAgent:
    def __init__(self, n_arms=10, epsilon=0.1):
        self.n_arms = n_arms
        self.epsilon = epsilon
        self.Q = np.zeros(n_arms)  # Q-value estimates
        self.N = np.zeros(n_arms)  # Pull counters

    def select_arm(self):
        if np.random.random() < self.epsilon:
            # Explore: random arm
            return np.random.randint(0, self.n_arms)
        else:
            # Exploit: best arm so far
            return np.argmax(self.Q)

    def update(self, arm, reward, alpha=0.1):
        # Update Q-value estimate
        self.Q[arm] = self.Q[arm] + alpha * (reward - self.Q[arm])
        self.N[arm] += 1

if __name__ == "__main__":
    env = BanditEnvironment(n_arms=10)
    agent = EpsilonGreedyAgent(n_arms=10, epsilon=0.1)

    rewards_history = []
    best_arm_selections = []

    for t in range(1000):
        arm = agent.select_arm()
        reward = env.pull(arm)
        agent.update(arm, reward)

        rewards_history.append(reward)
        best_arm_selections.append(arm == env.best_arm)

    print(f"Total reward: {sum(rewards_history):.2f}")
    print(f"Best arm found: {agent.Q.argmax()} (true best: {env.best_arm})")
    print(f"% times best arm chosen: {100*np.mean(best_arm_selections):.1f}%")

    # Plot results
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

    ax1.plot(np.cumsum(rewards_history))
    ax1.set_xlabel('Time Steps')
    ax1.set_ylabel('Cumulative Reward')
    ax1.set_title('Learning Progress')

    ax2.bar(range(10), agent.N)
    ax2.set_xlabel('Arm')
    ax2.set_ylabel('Times Pulled')
    ax2.set_title('Arm Selection Counts')
    ax2.axvline(env.best_arm, color='r', linestyle='--', label='Best Arm')
    ax2.legend()

    plt.tight_layout()
    plt.show()`,
      tests: [
        {
          name: "Test Q-values update",
          description: "Check if Q-values are being updated correctly",
          testCode: `agent = EpsilonGreedyAgent(n_arms=10)
initial_q = agent.Q[0]
agent.update(0, 5.0, alpha=0.1)
expected_q = initial_q + 0.1 * (5.0 - initial_q)
assert abs(agent.Q[0] - expected_q) < 0.001, "Q-value update incorrect"`
        },
        {
          name: "Test exploration",
          description: "Check if agent explores with probability epsilon",
          testCode: `agent = EpsilonGreedyAgent(n_arms=10, epsilon=1.0)
selections = [agent.select_arm() for _ in range(100)]
assert len(set(selections)) > 5, "Should explore different arms with epsilon=1.0"`
        }
      ]
    },
    {
      id: "lesson-1-4",
      type: "exercise" as LessonType,
      title: "UCB and Thompson Sampling",
      description: "Implement smarter exploration strategies",
      estimatedMinutes: 60,
      starterCode: `import numpy as np
import matplotlib.pyplot as plt

# Copy BanditEnvironment from previous lesson
class BanditEnvironment:
    def __init__(self, n_arms=10):
        self.n_arms = n_arms
        self.true_values = np.random.randn(n_arms)
        self.true_values[0] = self.true_values.max() + 1
        self.best_arm = np.argmax(self.true_values)

    def pull(self, arm):
        return self.true_values[arm] + np.random.randn()

# TODO: Implement UCB Agent
class UCBAgent:
    def __init__(self, n_arms=10, c=2):
        """
        c: exploration constant
        """
        # TODO: Initialize Q, N (pull counts), and t (time step)
        pass

    def select_arm(self):
        """Choose arm with highest Q(a) + bonus"""
        # TODO: Handle t=0 case (pull each arm once first)
        # TODO: Calculate bonus = c * sqrt(ln(t) / N(a))
        # TODO: Return argmax(Q + bonus)
        pass

    def update(self, arm, reward, alpha=0.1):
        """Update Q-value and counters"""
        # TODO: Update Q(a)
        # TODO: Increment N(a) and t
        pass

# TODO: Implement Thompson Sampling Agent
class ThompsonAgent:
    def __init__(self, n_arms=10):
        # TODO: Initialize mu (mean estimates) and N (pull counts)
        pass

    def select_arm(self):
        """Sample from belief distribution for each arm, pick highest"""
        # TODO: For each arm, sample = mu(a) + (1/sqrt(N(a)+1)) * randn()
        # TODO: Return argmax(samples)
        pass

    def update(self, arm, reward, alpha=0.1):
        """Update belief about arm's value"""
        # TODO: Update mu(a)
        # TODO: Increment N(a)
        pass

# Compare all three strategies
def compare_strategies(n_runs=10, n_steps=1000):
    strategies = {
        'Epsilon-Greedy': lambda: EpsilonGreedyAgent(epsilon=0.1),
        'UCB': lambda: UCBAgent(c=2),
        'Thompson': lambda: ThompsonAgent()
    }

    results = {}

    for name, create_agent in strategies.items():
        total_rewards = []
        best_arm_pcts = []

        for _ in range(n_runs):
            env = BanditEnvironment()
            agent = create_agent()

            rewards = []
            best_selections = []

            for t in range(n_steps):
                arm = agent.select_arm()
                reward = env.pull(arm)
                agent.update(arm, reward)

                rewards.append(reward)
                best_selections.append(arm == env.best_arm)

            total_rewards.append(sum(rewards))
            best_arm_pcts.append(100 * np.mean(best_selections))

        results[name] = {
            'reward_mean': np.mean(total_rewards),
            'reward_std': np.std(total_rewards),
            'best_arm_mean': np.mean(best_arm_pcts),
            'best_arm_std': np.std(best_arm_pcts)
        }

    # Print comparison
    for name, stats in results.items():
        print(f"\\n{name}:")
        print(f"  Avg total reward: {stats['reward_mean']:.1f} ± {stats['reward_std']:.1f}")
        print(f"  Avg % best arm: {stats['best_arm_mean']:.1f}% ± {stats['best_arm_std']:.1f}%")

if __name__ == "__main__":
    compare_strategies()`,
      solution: `import numpy as np
import matplotlib.pyplot as plt

class BanditEnvironment:
    def __init__(self, n_arms=10):
        self.n_arms = n_arms
        self.true_values = np.random.randn(n_arms)
        self.true_values[0] = self.true_values.max() + 1
        self.best_arm = np.argmax(self.true_values)

    def pull(self, arm):
        return self.true_values[arm] + np.random.randn()

class EpsilonGreedyAgent:
    def __init__(self, n_arms=10, epsilon=0.1):
        self.n_arms = n_arms
        self.epsilon = epsilon
        self.Q = np.zeros(n_arms)
        self.N = np.zeros(n_arms)

    def select_arm(self):
        if np.random.random() < self.epsilon:
            return np.random.randint(0, self.n_arms)
        else:
            return np.argmax(self.Q)

    def update(self, arm, reward, alpha=0.1):
        self.Q[arm] = self.Q[arm] + alpha * (reward - self.Q[arm])
        self.N[arm] += 1

class UCBAgent:
    def __init__(self, n_arms=10, c=2):
        self.n_arms = n_arms
        self.c = c
        self.Q = np.zeros(n_arms)
        self.N = np.zeros(n_arms)
        self.t = 0

    def select_arm(self):
        # Pull each arm once first
        if self.t < self.n_arms:
            return self.t

        # Calculate UCB values
        bonuses = self.c * np.sqrt(np.log(self.t) / (self.N + 1e-5))
        ucb_values = self.Q + bonuses
        return np.argmax(ucb_values)

    def update(self, arm, reward, alpha=0.1):
        self.Q[arm] = self.Q[arm] + alpha * (reward - self.Q[arm])
        self.N[arm] += 1
        self.t += 1

class ThompsonAgent:
    def __init__(self, n_arms=10):
        self.n_arms = n_arms
        self.mu = np.zeros(n_arms)
        self.N = np.zeros(n_arms)

    def select_arm(self):
        # Sample from belief distribution for each arm
        samples = self.mu + (1.0 / np.sqrt(self.N + 1)) * np.random.randn(self.n_arms)
        return np.argmax(samples)

    def update(self, arm, reward, alpha=0.1):
        self.mu[arm] = self.mu[arm] + alpha * (reward - self.mu[arm])
        self.N[arm] += 1

def compare_strategies(n_runs=10, n_steps=1000):
    strategies = {
        'Epsilon-Greedy': lambda: EpsilonGreedyAgent(epsilon=0.1),
        'UCB': lambda: UCBAgent(c=2),
        'Thompson': lambda: ThompsonAgent()
    }

    results = {}

    for name, create_agent in strategies.items():
        total_rewards = []
        best_arm_pcts = []

        for _ in range(n_runs):
            env = BanditEnvironment()
            agent = create_agent()

            rewards = []
            best_selections = []

            for t in range(n_steps):
                arm = agent.select_arm()
                reward = env.pull(arm)
                agent.update(arm, reward)

                rewards.append(reward)
                best_selections.append(arm == env.best_arm)

            total_rewards.append(sum(rewards))
            best_arm_pcts.append(100 * np.mean(best_selections))

        results[name] = {
            'reward_mean': np.mean(total_rewards),
            'reward_std': np.std(total_rewards),
            'best_arm_mean': np.mean(best_arm_pcts),
            'best_arm_std': np.std(best_arm_pcts)
        }

    for name, stats in results.items():
        print(f"\\n{name}:")
        print(f"  Avg total reward: {stats['reward_mean']:.1f} ± {stats['reward_std']:.1f}")
        print(f"  Avg % best arm: {stats['best_arm_mean']:.1f}% ± {stats['best_arm_std']:.1f}%")

if __name__ == "__main__":
    compare_strategies()`,
      tests: []
    },
    {
      id: "lesson-1-5",
      type: "theory" as LessonType,
      title: "Q-Learning in GridWorld",
      description: "Apply what you learned to the full RL problem",
      estimatedMinutes: 30,
      content: `# Q-Learning in GridWorld

Now that you understand Q-values from the bandit problem, let's go back to the GridWorld and apply Q-learning.

## The Key Difference

In bandits:
- No states, just actions
- $Q(a)$ = "How good is action $a$?"

In GridWorld:
- States AND actions
- $Q(s, a)$ = "How good is action $a$ when in state $s$?"

Instead of a 1D array of Q-values (one per action), we now have a 2D table (states × actions).

## The Q-Learning Update Rule

After taking action $a$ in state $s$, receiving reward $r$, and landing in state $s'$:

$$Q(s,a) \\leftarrow Q(s,a) + \\alpha \\left[r + \\gamma \\max_{a'} Q(s',a') - Q(s,a)\\right]$$

Let's break this down:

- $r + \\gamma \\max_{a'} Q(s',a')$ is the **target** (what we think $Q(s,a)$ should be)
  - $r$ = immediate reward
  - $\\gamma$ = discount factor (typically 0.9-0.99)
  - $\\max_{a'} Q(s',a')$ = value of the best action from next state
- $Q(s,a)$ is our **current estimate**
- $r + \\gamma \\max_{a'} Q(s',a') - Q(s,a)$ is the **TD error**
- $\\alpha$ is the learning rate (how much to update)

## Why the $\\max$?

This is **Q-learning's key insight**: We assume we'll take the best action from $s'$, even if we're exploring now.

This makes Q-learning **off-policy**: it learns the optimal policy while following an exploratory policy (like epsilon-greedy).

## How Values Propagate

Remember our GridWorld:

\`\`\`
[S][ ][ ][ ][ ]
[ ][X][ ][X][ ]
[ ][ ][ ][ ][ ]
[ ][X][ ][ ][ ]
[ ][ ][ ][ ][G]
\`\`\`

At first, all $Q(s,a) = 0$.

**Episode 1:** Agent randomly reaches goal at (4,4). It gets reward +100.

- The Q-value for the action that reached the goal updates: $Q(\\text{state}_{\\text{before goal}}, \\text{action}_{\\text{to goal}}) \\approx 99$

**Episode 2:** Agent gets one step closer to goal, then reaches it.

- Now the Q-value for being 2 steps away updates: $Q \\approx -1 + 0.9 \\times 99 = 88$

**After many episodes:** Values "propagate backwards" from the goal. Squares closer to goal have higher Q-values, squares near pits have lower Q-values.

## The Algorithm

\`\`\`python
# Initialize Q-table to zeros
Q = np.zeros((n_states, n_actions))

for episode in range(n_episodes):
    state = env.reset()
    done = False

    while not done:
        # Choose action (epsilon-greedy)
        if random() < epsilon:
            action = random_action()
        else:
            action = argmax(Q[state, :])

        # Take action, observe result
        next_state, reward, done = env.step(action)

        # Q-learning update
        best_next_action_value = max(Q[next_state, :])
        td_target = reward + gamma * best_next_action_value
        td_error = td_target - Q[state, action]
        Q[state, action] += alpha * td_error

        state = next_state
\`\`\`

## What You'll See

As the agent learns:

1. **Early episodes:** Random movement, falls in pits a lot
2. **Middle episodes:** Starts avoiding known pits, sometimes reaches goal
3. **Late episodes:** Reliably reaches goal via shortest safe path

The Q-table becomes a "map of goodness" - it encodes:
- Which actions to avoid (near pits)
- Which actions lead to goal (high Q-values on safe path)

In the next lesson, you'll implement this yourself and watch the agent learn!`
    }
  ]
};

export const curriculumV2 = {
  title: "Reinforcement Learning Academy",
  description: "Learn RL by doing, not memorizing",
  modules: [module1]
};

# Reinforcement Learning Curriculum
## Topic-Based Learning Path (No Week Markers)

---

## Curriculum Structure

This curriculum is organized into **modules** (major topics) containing **lessons** (specific concepts). Each lesson includes:
- **Theory**: Core concepts with intuitive explanations
- **Examples**: Concrete instances to build understanding
- **Quiz**: 5-7 questions to test comprehension
- **Coding Exercise**: Hands-on implementation
- **Playground**: Interactive experimentation (where applicable)

Progress at your own pace. Complete modules in order as concepts build on each other.

---

# MODULE 1: FOUNDATIONS OF REINFORCEMENT LEARNING

## Module Overview
- **What you'll learn**: Core RL concepts, MDPs, value functions, policies
- **Prerequisites**: Python programming, basic probability
- **Estimated time**: 6-10 hours
- **Outcome**: Understand the RL framework and fundamental concepts

---

## Lesson 1.1: What is Reinforcement Learning?

### Theory
- The RL paradigm: agent, environment, actions, states, rewards
- How RL differs from supervised and unsupervised learning
- Examples: game playing, robotics, recommendation systems
- The reward hypothesis: goals can be expressed as maximizing cumulative reward
- The explore-exploit dilemma

### Examples
- **Robot navigation**: State = position, Action = move direction, Reward = reaching goal
- **Game playing**: State = board position, Action = move, Reward = win/loss
- **Ad placement**: State = user context, Action = which ad, Reward = click/conversion

### Quiz Topics
- Identify components (state/action/reward) in scenarios
- RL vs supervised learning differences
- Reward signal design
- Exploration vs exploitation tradeoffs

### Coding Exercise
**Title**: Build a Simple Grid World
**Task**: Create a basic grid environment where an agent can move (up/down/left/right)
**Starter Code**: Empty GridWorld class
**Implement**:
- State representation (x, y coordinates)
- Action space (4 directions)
- Step function (state transitions)
- Reward function (goal = +1, obstacles = -1)
- Reset function

**Test Cases**:
- Agent moves correctly
- Hitting walls keeps agent in place
- Reaching goal gives +1 reward
- Environment resets properly

---

## Lesson 1.2: Markov Decision Processes (MDPs)

### Theory
- Markov property: future depends only on present state
- Formal MDP definition: (S, A, P, R, γ)
- State transition dynamics P(s'|s,a)
- Reward function R(s, a, s')
- Discount factor γ: why we need it, how it affects behavior
- Episodes vs continuing tasks

### Examples
- **FrozenLake**: Slippery grid world MDP
  - States: grid positions
  - Actions: directional moves
  - Transitions: intended direction 33%, perpendicular 33% each
  - Rewards: goal +1, holes 0, steps -0.01
- **Recycling Robot**: Simple continuing task
- **Cart-Pole**: Classic continuous state space

### Quiz Topics
- Markov property verification
- Identify P, R, γ from scenarios
- Episode vs continuing task classification
- Effect of different discount factors

### Coding Exercise
**Title**: Implement an MDP Simulator
**Task**: Create a class that models any discrete MDP
**Implement**:
- Define transition probability table
- Sample next state from P(s'|s,a)
- Generate reward from R(s,a,s')
- Simulate trajectory (sequence of states, actions, rewards)
- Calculate discounted return from trajectory

**Test Cases**:
- Transitions follow specified probabilities (statistical test)
- Returns calculated correctly with different γ
- Deterministic MDP produces expected sequence
- Stochastic MDP produces varying sequences

---

## Lesson 1.3: Policies and Value Functions

### Theory
- Policy π(a|s): mapping from states to actions
- Deterministic vs stochastic policies
- State-value function V^π(s): expected return starting from s following π
- Action-value function Q^π(s,a): expected return from (s,a) following π
- Relationship between V and Q: V^π(s) = Σ_a π(a|s) Q^π(s,a)
- Optimal policy π*, optimal value functions V*, Q*

### Examples
- **Random policy**: π(a|s) = 1/|A| for all states
- **Greedy policy**: Always take action with highest Q-value
- **Epsilon-greedy**: Explore with probability ε, exploit otherwise
- Value function in GridWorld: V increases as you get closer to goal
- Q-function visualized as action preferences per state

### Quiz Topics
- Calculate V from Q and policy
- Identify optimal actions from Q-values
- Policy comparison (which is better?)
- Stochastic vs deterministic policy scenarios

### Coding Exercise
**Title**: Compute Value Functions by Simulation
**Task**: Estimate V^π and Q^π through Monte Carlo sampling
**Implement**:
- Run many episodes following a given policy
- Track returns from each state/state-action pair
- Average returns to estimate V and Q
- Visualize value functions as heatmaps

**Test Cases**:
- Values converge with more episodes
- Random policy gives uniform low values
- Optimal policy gives higher values
- Q-values satisfy V(s) = Σ π(a|s)Q(s,a)

---

## Lesson 1.4: Bellman Equations

### Theory
- Bellman expectation equation for V^π
- Bellman expectation equation for Q^π
- Bellman optimality equation for V*
- Bellman optimality equation for Q*
- Recursive nature: value of state = immediate reward + discounted value of next state
- Intuition: "The value of a decision is the value of its consequences"

### Examples
- **Derive V for simple 2-state MDP**: Work through math step-by-step
- **GridWorld Bellman backup**: Show how V(s) depends on V(neighbors)
- **Bellman error**: Measure how far current V is from satisfying Bellman equation

### Quiz Topics
- Apply Bellman equation to compute V for small MDP
- Identify which Bellman equation to use (expectation vs optimality)
- Understand recursive structure
- Bellman backup calculations

### Coding Exercise
**Title**: Bellman Equation Verification
**Task**: Verify Bellman equations hold for known value functions
**Implement**:
- Given true V* for an MDP, compute Bellman optimality RHS
- Check LHS = RHS (within tolerance)
- Compute Bellman error for arbitrary V
- Visualize error across states

**Test Cases**:
- Optimal V satisfies Bellman optimality equation
- Random V has large Bellman error
- Error decreases as V approaches V*
- Backup operator moves V toward V*

---

## Module 1 Checkpoint Quiz
**Comprehensive assessment of Module 1 concepts**
- 15 questions covering all lessons
- Pass threshold: 70%
- Unlocks Module 2

---

# MODULE 2: TABULAR SOLUTION METHODS

## Module Overview
- **What you'll learn**: Dynamic programming, Monte Carlo, TD learning
- **Prerequisites**: Module 1 completed
- **Estimated time**: 10-14 hours
- **Outcome**: Solve small discrete MDPs exactly and approximately

---

## Lesson 2.1: Dynamic Programming - Policy Evaluation

### Theory
- Iterative policy evaluation algorithm
- Synchronous vs asynchronous updates
- Convergence guarantees (contraction mapping)
- In-place updates
- Computational complexity
- When DP is applicable (need complete model)

### Examples
- **GridWorld policy evaluation**: Evaluate random policy, show iterations
- **Convergence visualization**: Plot max change in V over iterations
- **Effect of discount factor**: γ closer to 1 = slower convergence

### Quiz Topics
- Policy evaluation algorithm steps
- When to stop iterating (convergence threshold)
- Model requirements for DP
- Update equation application

### Coding Exercise
**Title**: Implement Iterative Policy Evaluation
**Task**: Evaluate a given policy on an MDP
**Implement**:
- Initialize V(s) = 0 for all states
- Iteratively update V using Bellman expectation equation
- Track convergence (max change in V)
- Return final value function

**Test Cases**:
- Converges to correct V for known policies
- Different convergence thresholds give different accuracy
- In-place vs synchronous updates both work
- Works on FrozenLake and GridWorld

**Playground**:
- Adjust convergence threshold, discount factor
- Visualize V evolving over iterations
- Compare different policies

---

## Lesson 2.2: Dynamic Programming - Policy Improvement

### Theory
- Policy improvement theorem
- Greedy policy w.r.t. value function
- Policy improvement step: π' = greedy(V^π)
- Guaranteed improvement (or already optimal)
- Convergence to π* in finite iterations

### Examples
- **GridWorld improvement**: Start with random policy, improve it
- **Show greedy actions**: Visualize action arrows based on Q-values
- **Improvement stops**: When policy no longer changes

### Quiz Topics
- Policy improvement theorem statement
- Construct greedy policy from V or Q
- Why improvement guarantees better performance
- Detect when policy is optimal

### Coding Exercise
**Title**: Implement Policy Improvement
**Task**: Improve a policy given its value function
**Implement**:
- Compute Q(s,a) from V(s) using one-step lookahead
- Create greedy policy: π'(s) = argmax_a Q(s,a)
- Check if policy changed
- Return improved policy and flag indicating if optimal

**Test Cases**:
- Improvement from random policy increases performance
- Optimal policy doesn't change
- Greedy policy selects correct actions
- Works with stochastic environments

---

## Lesson 2.3: Policy Iteration

### Theory
- Combine evaluation and improvement
- Algorithm: evaluate → improve → evaluate → improve → ...
- Convergence in finite iterations
- Guarantees optimal policy π*
- Computational cost per iteration

### Examples
- **Full policy iteration on GridWorld**: Show each iteration's policy
- **Number of iterations to convergence**: Typically very few (3-5)
- **Why it works**: Monotonic improvement

### Quiz Topics
- Policy iteration algorithm steps
- Why it converges
- Stopping criterion
- Difference from value iteration

### Coding Exercise
**Title**: Implement Policy Iteration
**Task**: Solve an MDP using policy iteration
**Implement**:
- Initialize random policy
- Loop: evaluate policy, improve policy
- Stop when policy doesn't change
- Return optimal policy and value function

**Test Cases**:
- Finds optimal policy for GridWorld
- Converges in < 10 iterations
- Final policy achieves maximum expected return
- Value function matches analytical solution (if known)

**Playground**:
- Watch policy evolve iteration by iteration
- Visualize changing value functions
- Compare convergence speed on different MDPs

---

## Lesson 2.4: Value Iteration

### Theory
- Combine one sweep of evaluation + improvement
- Bellman optimality operator
- Algorithm: repeatedly apply Bellman optimality backup
- Convergence to V* (and implicitly π*)
- Often faster than policy iteration (fewer iterations)
- Stopping criterion: max change in V below threshold

### Examples
- **Value iteration on GridWorld**: Show V converging
- **Extract policy at end**: Greedy w.r.t. final V
- **Comparison with policy iteration**: Convergence speed, iterations

### Quiz Topics
- Value iteration algorithm
- Why it finds optimal policy
- When to stop iterating
- Policy iteration vs value iteration tradeoffs

### Coding Exercise
**Title**: Implement Value Iteration
**Task**: Solve an MDP using value iteration
**Implement**:
- Initialize V(s) = 0
- Repeatedly apply max_a Bellman backup
- Stop when convergence threshold reached
- Extract greedy policy from final V

**Test Cases**:
- Converges to optimal V*
- Extracted policy is optimal
- Convergence in reasonable iterations (< 100)
- Works on FrozenLake, GridWorld, CliffWalking

**Playground**:
- Visualize V* evolution
- Compare with policy iteration
- Adjust convergence threshold and see effect

---

## Lesson 2.5: Monte Carlo Methods - Prediction

### Theory
- Learn from complete episodes (no model needed!)
- Monte Carlo policy evaluation
- First-visit vs every-visit MC
- Incremental mean updates
- Variance reduction: why averaging helps
- Applicability: episodic tasks only

### Examples
- **Blackjack evaluation**: Estimate V for dealer strategy
- **GridWorld MC**: Compare to DP results
- **Convergence**: Requires many episodes

### Quiz Topics
- MC vs DP differences
- First-visit vs every-visit
- When MC is preferred over DP
- Incremental update formula

### Coding Exercise
**Title**: Monte Carlo Policy Evaluation
**Task**: Estimate V^π using MC sampling
**Implement**:
- Generate episodes following policy π
- Track returns for each state visited
- Compute average return per state
- Plot convergence (error vs # episodes)

**Test Cases**:
- V estimates converge to true values
- More episodes → lower error
- First-visit and every-visit give similar results
- Works without knowing transition dynamics

---

## Lesson 2.6: Monte Carlo Methods - Control

### Theory
- Monte Carlo control: find π* without model
- Exploring starts assumption
- Greedy in the limit with infinite exploration (GLIE)
- Epsilon-greedy policies for exploration
- On-policy vs off-policy control

### Examples
- **Blackjack control**: Learn optimal strategy
- **Epsilon-greedy exploration**: Balance explore/exploit
- **GLIE schedules**: ε decay over time

### Quiz Topics
- Why exploring starts or epsilon-greedy needed
- On-policy control algorithm
- GLIE convergence conditions
- MC control vs MC prediction

### Coding Exercise
**Title**: On-Policy Monte Carlo Control
**Task**: Learn optimal policy for an environment
**Implement**:
- Initialize Q(s,a) arbitrarily
- Generate episodes with epsilon-greedy policy
- Update Q estimates from episode returns
- Improve policy (greedy w.r.t. Q)
- Decay epsilon over time (GLIE)

**Test Cases**:
- Learns near-optimal policy for GridWorld
- Q-values converge
- Policy improves over episodes
- Final policy performs well (high win rate)

**Playground**:
- Visualize learning progress
- Adjust epsilon, epsilon decay
- Watch policy evolve
- Compare final policies with different hyperparameters

---

## Lesson 2.7: Temporal Difference Learning - TD(0)

### Theory
- Learn from incomplete episodes (bootstrapping!)
- TD prediction: update V using next state's V
- TD error: δ = R + γV(s') - V(s)
- TD(0) update rule
- Bias-variance tradeoff: TD vs MC
- Advantages: online, low variance, works in continuing tasks

### Examples
- **Random walk TD(0)**: Classic example
- **TD vs MC convergence**: TD often faster
- **TD error over time**: Should decrease as V improves

### Quiz Topics
- TD update equation
- TD error meaning
- Why bootstrapping helps
- TD vs MC vs DP comparison

### Coding Exercise
**Title**: TD(0) Prediction
**Task**: Estimate V^π using TD learning
**Implement**:
- Initialize V(s) = 0
- For each time step: observe (s, r, s')
- Update: V(s) ← V(s) + α[r + γV(s') - V(s)]
- Track learning progress

**Test Cases**:
- V converges to correct values
- Different learning rates affect convergence
- Works online (updates every step, not end of episode)
- Handles continuing tasks

**Playground**:
- Visualize V updates in real-time
- Adjust learning rate α
- Compare convergence speed to MC
- Show TD error evolution

---

## Lesson 2.8: SARSA - On-Policy TD Control

### Theory
- SARSA: State-Action-Reward-State-Action
- On-policy TD control algorithm
- Q-learning but uses actual next action
- Update: Q(s,a) ← Q(s,a) + α[r + γQ(s',a') - Q(s,a)]
- Epsilon-greedy for exploration
- Convergence to optimal Q* under GLIE

### Examples
- **Windy GridWorld**: SARSA learns safe path
- **Cliff Walking**: SARSA takes safer route (avoids cliff)
- **Exploration matters**: ε too low = poor learning

### Quiz Topics
- SARSA update rule
- On-policy meaning (learns value of policy being followed)
- Why called SARSA (sequence: s,a,r,s',a')
- Hyperparameters: α, γ, ε

### Coding Exercise
**Title**: Implement SARSA
**Task**: Learn to solve FrozenLake with SARSA
**Implement**:
- Initialize Q(s,a) = 0
- Choose actions with epsilon-greedy
- Update Q after each step using SARSA rule
- Decay epsilon over episodes
- Track performance (returns per episode)

**Test Cases**:
- Agent learns to reach goal
- Q-values converge
- Policy improves over time
- Final policy success rate > 70%

**Playground**:
- Watch agent learn in real-time
- Adjust α, γ, ε
- Compare different exploration strategies
- Visualize Q-values as heatmap

---

## Lesson 2.9: Q-Learning - Off-Policy TD Control

### Theory
- Q-learning: learns optimal Q* directly
- Off-policy: learns optimal policy while following exploratory policy
- Update: Q(s,a) ← Q(s,a) + α[r + γ max_a' Q(s',a') - Q(s,a)]
- Key difference from SARSA: uses max instead of actual next action
- More aggressive learning (targets optimal Q*)
- Convergence guarantees under certain conditions

### Examples
- **Cliff Walking**: Q-learning finds optimal risky path
- **SARSA vs Q-learning**: Different behaviors on same task
- **Maximization bias**: Q-learning can overestimate

### Quiz Topics
- Q-learning update rule
- Off-policy meaning
- SARSA vs Q-learning differences
- When to use each algorithm

### Coding Exercise
**Title**: Implement Q-Learning
**Task**: Solve GridWorld with Q-learning
**Implement**:
- Initialize Q-table
- Epsilon-greedy action selection
- Q-learning update (use max)
- Track learning curves

**Test Cases**:
- Learns optimal policy
- Q-values converge to Q*
- Outperforms SARSA on risky tasks
- Handles stochastic environments

**Playground**:
- Side-by-side SARSA vs Q-learning comparison
- Cliff Walking environment (shows difference clearly)
- Visualize Q-value evolution
- Compare convergence speed

---

## Lesson 2.10: N-Step Methods

### Theory
- Unify MC and TD: n-step returns
- n=1: TD(0), n=∞: Monte Carlo
- n-step return: G_t^(n) = R_t+1 + γR_t+2 + ... + γ^n V(S_t+n)
- Forward view vs backward view
- TD(λ): eligibility traces
- Bias-variance tradeoff with n

### Examples
- **Random Walk with different n**: Show optimal n exists
- **Eligibility traces visualization**: Which states get credit
- **λ parameter effect**: 0 = TD(0), 1 = MC

### Quiz Topics
- N-step return formula
- Optimal n selection
- TD(λ) basics
- Eligibility traces intuition

### Coding Exercise
**Title**: N-Step SARSA
**Task**: Implement n-step SARSA with adjustable n
**Implement**:
- Store n-step trajectory
- Compute n-step return
- Update Q after n steps
- Compare n=1, 5, 10, ∞ (MC)

**Test Cases**:
- n=1 matches SARSA
- n=∞ matches MC control
- Intermediate n balances bias-variance
- Find optimal n for GridWorld

**Playground**:
- Adjust n with slider
- Visualize learning curves for different n
- See which n converges fastest
- Understand bias-variance tradeoff

---

## Module 2 Checkpoint Quiz
**Comprehensive assessment**
- 20 questions covering DP, MC, TD methods
- Algorithm comparisons
- When to use which method
- Pass threshold: 70%

---

# MODULE 3: FUNCTION APPROXIMATION

## Module Overview
- **What you'll learn**: Scale RL beyond tabular methods using function approximation
- **Prerequisites**: Module 2, basic neural networks
- **Estimated time**: 12-16 hours
- **Outcome**: Handle large/continuous state spaces

---

## Lesson 3.1: Why Function Approximation?

### Theory
- Curse of dimensionality: tabular methods fail with large state spaces
- Generalization: learn from similar states
- Function approximation: V(s;w) and Q(s,a;w) parameterized by weights w
- Linear function approximation
- Neural network function approximation
- Feature engineering vs representation learning

### Examples
- **Mountain Car**: Continuous state (position, velocity)
- **Atari**: 210x160x3 pixel states (millions of states)
- **Robotic control**: High-dimensional sensor inputs
- **Linear combination of features**: Tile coding, radial basis functions

### Quiz Topics
- When tabular methods fail
- Types of function approximation
- Generalization benefits
- Feature representations

### Coding Exercise
**Title**: Feature Engineering for Mountain Car
**Task**: Create useful features for continuous state space
**Implement**:
- Design features (position, velocity, position^2, etc.)
- Tile coding implementation
- Feature vector construction
- Visualize feature activations

**Test Cases**:
- Features cover state space adequately
- Similar states have similar feature vectors
- Tile coding creates binary features
- Feature vector has appropriate dimensionality

---

## Lesson 3.2: Linear Function Approximation - Prediction

### Theory
- Linear value function: V(s;w) = w^T x(s)
- Gradient descent for value estimation
- Stochastic gradient descent (SGD)
- Learning rate α
- Convergence properties (convex objective)
- Semi-gradient methods (bootstrapping creates bias)

### Examples
- **Mountain Car with linear V**: Feature weights visualization
- **Learning curve**: TD error over time
- **Weight convergence**: Plot w over iterations

### Quiz Topics
- Linear function approximation equation
- SGD update rule
- Why "semi-gradient"?
- Convergence guarantees

### Coding Exercise
**Title**: Linear TD Prediction
**Task**: Estimate V using linear function approximation
**Implement**:
- Initialize weight vector w
- Compute features x(s)
- SGD updates: w ← w + α[R + γV(s';w) - V(s;w)] ∇V(s;w)
- Track MSE vs true V

**Test Cases**:
- Weights converge
- V approximates true value function
- Different learning rates affect convergence
- Works on Mountain Car

---

## Lesson 3.3: Linear Function Approximation - Control

### Theory
- Linear action-value function: Q(s,a;w) = w^T x(s,a)
- Feature construction for state-action pairs
- Semi-gradient SARSA with function approximation
- Semi-gradient Q-learning with function approximation
- Convergence challenges (off-policy + function approx = potential divergence)

### Examples
- **Mountain Car control**: Learn to reach goal
- **Action features**: One-hot encoding of actions + state features
- **Learned weights**: Which features matter most?

### Quiz Topics
- Q function approximation
- State-action feature design
- SARSA vs Q-learning with function approximation
- Divergence risks

### Coding Exercise
**Title**: Linear SARSA for Mountain Car
**Task**: Solve Mountain Car using linear function approximation
**Implement**:
- State-action feature vectors
- Linear Q(s,a;w)
- SARSA updates with function approximation
- Track episode lengths (should decrease)

**Test Cases**:
- Agent learns to reach goal
- Episode length decreases over time
- Weights converge to stable values
- Generalizes to unseen states

**Playground**:
- Visualize learned Q-function
- Adjust feature set and see effect
- Compare different feature representations
- Watch agent behavior improve

---

## Lesson 3.4: Neural Networks Basics

### Theory
- Perceptron and multi-layer networks
- Activation functions: ReLU, tanh, sigmoid
- Forward pass
- Backpropagation
- Loss functions: MSE for regression
- Optimization: SGD, Adam
- Overfitting and regularization

### Examples
- **Simple XOR**: Non-linear function requires hidden layers
- **Function fitting**: Approximate sin(x) with neural net
- **Visualization**: Decision boundaries, hidden layer activations

### Quiz Topics
- Neural network architecture
- Activation function purposes
- Backpropagation intuition
- When to use neural networks vs linear

### Coding Exercise
**Title**: Train a Simple Neural Network
**Task**: Fit a non-linear function with a 2-layer network
**Implement**:
- Network class (forward pass)
- Loss computation (MSE)
- Backpropagation (gradients)
- SGD updates
- Plot loss over iterations

**Test Cases**:
- Network approximates target function
- Loss decreases over iterations
- Different architectures (width, depth) affect performance
- Activation functions matter

---

## Lesson 3.5: Neural Network Function Approximation for RL

### Theory
- Deep Q-Networks (DQN) preview
- Neural network as Q-function approximator
- Experience replay motivation
- Target networks motivation
- Challenges: non-stationarity, correlations, deadly triad

### Examples
- **CartPole with neural net**: Simple continuous state control
- **Network architecture choices**: Input layer, hidden layers, output layer
- **Instability without tricks**: Show naive approach failing

### Quiz Topics
- Why neural networks for RL?
- Challenges specific to RL (vs supervised learning)
- Experience replay purpose
- Target network purpose

### Coding Exercise
**Title**: Neural Network Q-Learning for CartPole
**Task**: Solve CartPole with neural network Q-function
**Implement**:
- Neural network Q(s,a;θ)
- Q-learning updates with neural net
- Simple experience buffer (optional for now)
- Track performance over episodes

**Test Cases**:
- Agent learns to balance pole
- Episode lengths increase
- Network doesn't diverge (too badly)
- Performance improves over time

---

## Module 3 Checkpoint Quiz
**Comprehensive assessment**
- 15 questions on function approximation
- Linear vs non-linear methods
- Feature engineering
- Neural network basics
- Pass threshold: 70%

---

# MODULE 4: DEEP Q-NETWORKS (DQN)

## Module Overview
- **What you'll learn**: Deep RL breakthroughs for high-dimensional inputs
- **Prerequisites**: Module 3
- **Estimated time**: 14-18 hours
- **Outcome**: Implement DQN and variants, understand deep RL challenges

---

## Lesson 4.1: The DQN Algorithm

### Theory
- Full DQN algorithm
- Experience replay buffer
- Target network (separate from online network)
- Update frequency for target network
- Epsilon-greedy with annealing
- Preprocessing: frame stacking, grayscale, resizing
- Loss function: MSE between Q and target
- Deadly triad revisited

### Examples
- **Atari Breakout**: DQN learns to play from pixels
- **Replay buffer mechanics**: Store, sample, update
- **Target network lag**: Why it stabilizes learning

### Quiz Topics
- Full DQN algorithm steps
- Why experience replay helps
- Why target network helps
- Hyperparameters and their effects

### Coding Exercise
**Title**: Implement DQN
**Task**: Full DQN implementation for CartPole or LunarLander
**Implement**:
- Replay buffer class (store, sample)
- Q-network (neural net)
- Target network (copy of Q-network)
- DQN training loop
- Epsilon annealing schedule
- Periodic target network updates

**Test Cases**:
- Agent solves CartPole (episode reward > 195)
- Replay buffer stores and samples correctly
- Target network updates periodically
- Performance improves steadily
- Converges faster than naive Q-learning

**Playground**:
- Visualize replay buffer contents
- Adjust replay buffer size, batch size
- Change target network update frequency
- See effect of different network architectures

---

## Lesson 4.2: Double DQN

### Theory
- Maximization bias in Q-learning
- Why standard DQN overestimates Q-values
- Double Q-learning idea: decouple selection and evaluation
- Double DQN: use online network to select action, target network to evaluate
- Update rule modification
- Empirical improvements

### Examples
- **Overestimation demonstration**: Plot Q-values vs true values
- **Double DQN vs DQN**: Performance comparison
- **Value accuracy**: Double DQN gives more accurate Q-estimates

### Quiz Topics
- Maximization bias explanation
- Double Q-learning principle
- Double DQN update equation
- When Double DQN helps most

### Coding Exercise
**Title**: Implement Double DQN
**Task**: Modify DQN to use Double Q-learning
**Implement**:
- Change target computation: use online net for argmax, target net for value
- Compare to standard DQN
- Track Q-value estimates
- Measure overestimation

**Test Cases**:
- Double DQN reduces overestimation
- Performance matches or exceeds standard DQN
- Q-values more accurate
- Works on LunarLander

---

## Lesson 4.3: Dueling DQN

### Theory
- Separate value and advantage streams
- Architecture: shared layers → split into V(s) and A(s,a) streams
- Aggregation: Q(s,a) = V(s) + A(s,a) - mean(A(s,·))
- Why dueling helps: better credit assignment
- When dueling architecture is beneficial

### Examples
- **Dueling network diagram**: Architecture visualization
- **Value vs advantage**: What each stream learns
- **Dueling DQN performance**: Often better generalization

### Quiz Topics
- Dueling architecture structure
- Why separate V and A?
- Aggregation formula
- When to use dueling vs standard

### Coding Exercise
**Title**: Implement Dueling DQN
**Task**: Create dueling network architecture
**Implement**:
- Shared convolutional/dense layers
- Split into V and A streams
- Combine streams to produce Q-values
- Train on Atari or LunarLander
- Compare to standard DQN

**Test Cases**:
- Dueling architecture produces valid Q-values
- V stream learns state values
- A stream learns relative advantages
- Performance improvements on some tasks

---

## Lesson 4.4: Prioritized Experience Replay

### Theory
- Not all experiences equally useful
- Priority based on TD error magnitude
- Proportional prioritization vs rank-based
- Importance sampling to correct bias
- Annealing β parameter
- Sum tree data structure for efficient sampling

### Examples
- **TD error distribution**: High-error transitions are rare but valuable
- **Prioritized vs uniform sampling**: Learning curve comparison
- **Priority evolution**: Priorities change as learning progresses

### Quiz Topics
- Why prioritize experiences?
- Priority calculation
- Importance sampling weights
- β annealing schedule

### Coding Exercise
**Title**: Prioritized Experience Replay
**Task**: Implement PER for DQN
**Implement**:
- Priority calculation from TD error
- Weighted sampling from buffer
- Importance sampling weight computation
- Sum tree (or simpler approximation)
- Integrate with DQN

**Test Cases**:
- High TD error transitions sampled more often
- Importance weights correct for bias
- Learning improves over uniform sampling
- Works on challenging environment

---

## Lesson 4.5: Rainbow DQN

### Theory
- Combines multiple DQN improvements:
  - Double DQN
  - Dueling DQN
  - Prioritized Experience Replay
  - Multi-step returns (n-step)
  - Distributional RL (C51 algorithm)
  - Noisy Networks (for exploration)
- State-of-the-art performance on Atari
- Ablation studies: which components matter most

### Examples
- **Rainbow vs DQN**: Dramatic performance improvements
- **Component contributions**: Ablation study results
- **When Rainbow is overkill**: Simple tasks don't need all components

### Quiz Topics
- Rainbow components
- Which improvements are most important
- Computational cost tradeoffs
- When to use full Rainbow vs simpler variants

### Coding Exercise
**Title**: Simplified Rainbow (Double + Dueling + PER)
**Task**: Combine three improvements
**Implement**:
- Start with DQN base
- Add Double Q-learning
- Add Dueling architecture
- Add PER
- Measure contribution of each

**Test Cases**:
- Combined version outperforms base DQN
- Each component adds measurable improvement
- Training stable and converges
- Solves challenging environment (e.g., Atari Pong)

**Playground**:
- Toggle components on/off
- See effect of each improvement
- Compare learning curves
- Visualize Q-value distributions

---

## Module 4 Checkpoint Quiz
**Comprehensive assessment**
- 20 questions on DQN and variants
- Understand each improvement's purpose
- When to use which variant
- Pass threshold: 70%

---

# MODULE 5: POLICY GRADIENT METHODS

## Module Overview
- **What you'll learn**: Directly optimize policy instead of value function
- **Prerequisites**: Module 4
- **Estimated time**: 14-18 hours
- **Outcome**: Understand policy gradients, implement REINFORCE and Actor-Critic

---

## Lesson 5.1: Introduction to Policy Gradients

### Theory
- Direct policy parameterization: π(a|s;θ)
- Advantages over value-based methods
- Continuous action spaces
- Stochastic policies
- Policy gradient theorem
- Objective: maximize expected return J(θ)
- Gradient ascent on policy parameters

### Examples
- **Why policy gradients?**: Continuous control (e.g., robotic arm)
- **Stochastic policies**: Rock-paper-scissors, poker
- **Policy representation**: Neural network outputting action probabilities

### Quiz Topics
- Policy-based vs value-based methods
- When to use policy gradients
- Stochastic policy benefits
- Policy gradient theorem statement

### Coding Exercise
**Title**: Policy Network for CartPole
**Task**: Create neural network that outputs action probabilities
**Implement**:
- Policy network π(a|s;θ)
- Softmax output for discrete actions
- Forward pass: state → action probabilities
- Sample action from distribution
- No learning yet (just inference)

**Test Cases**:
- Network outputs valid probability distribution
- Action sampling works correctly
- Different states produce different distributions
- Network architecture appropriate for task

---

## Lesson 5.2: REINFORCE Algorithm

### Theory
- Monte Carlo policy gradient
- REINFORCE update rule
- Log probability trick: ∇log π(a|s;θ)
- Return as "reward signal" for gradient
- High variance problem
- Learning rate sensitivity

### Examples
- **REINFORCE on CartPole**: Episode-by-episode learning
- **Variance visualization**: High variance in gradient estimates
- **Baseline preview**: Reducing variance

### Quiz Topics
- REINFORCE algorithm steps
- Why ∇log π(a|s;θ)?
- High variance problem
- When REINFORCE works well

### Coding Exercise
**Title**: Implement REINFORCE
**Task**: Learn CartPole policy using REINFORCE
**Implement**:
- Generate full episode
- Compute returns G_t for each time step
- Compute policy gradient
- Update policy network parameters
- Track episode returns

**Test Cases**:
- Agent learns to solve CartPole
- Episode returns increase over time
- Policy gradient computed correctly
- Works with continuous and discrete actions

**Playground**:
- Visualize learning progress
- Adjust learning rate
- See high variance in updates
- Watch policy evolve

---

## Lesson 5.3: Baselines for Variance Reduction

### Theory
- Baseline b(s) to reduce variance
- Does not introduce bias (E[∇log π · b] = 0)
- Common baselines: average return, value function
- REINFORCE with baseline
- Advantage function: A(s,a) = Q(s,a) - V(s)
- Variance-bias tradeoff

### Examples
- **Variance comparison**: With vs without baseline
- **Value function as baseline**: V(s) reduces variance significantly
- **Learning curves**: Smoother with baseline

### Quiz Topics
- Why baselines reduce variance
- Why baselines don't add bias
- Advantage function definition
- Choosing a good baseline

### Coding Exercise
**Title**: REINFORCE with Baseline
**Task**: Add value function baseline to REINFORCE
**Implement**:
- Train separate value network V(s;w)
- Use V(s) as baseline: A_t = G_t - V(s_t)
- Update policy with advantage
- Update value function with returns
- Compare to vanilla REINFORCE

**Test Cases**:
- Lower variance than vanilla REINFORCE
- Faster convergence
- Value network learns state values
- Advantage estimates approximately correct

**Playground**:
- Compare learning curves (with/without baseline)
- Visualize advantage values
- Adjust value learning rate
- See variance reduction

---

## Lesson 5.4: Actor-Critic Methods

### Theory
- Actor: policy network π(a|s;θ)
- Critic: value network V(s;w) or Q(s,a;w)
- Use critic to estimate advantage (bootstrap)
- TD error as advantage estimate
- Update actor with policy gradient
- Update critic with TD learning
- One-step Actor-Critic (A2C)

### Examples
- **Actor-Critic architecture**: Two networks working together
- **TD error as advantage**: δ_t = r_t + γV(s_{t+1}) - V(s_t)
- **Online learning**: Update after each step

### Quiz Topics
- Actor vs critic roles
- Why bootstrap advantage?
- One-step Actor-Critic algorithm
- Bias-variance tradeoff (AC vs REINFORCE)

### Coding Exercise
**Title**: Implement Actor-Critic (A2C)
**Task**: Build one-step Actor-Critic agent
**Implement**:
- Actor network (policy)
- Critic network (value function)
- Compute TD error
- Update actor using policy gradient with TD error
- Update critic using TD learning
- Run on CartPole or LunarLander

**Test Cases**:
- Actor and critic both learn
- TD error decreases over time
- Performance better than REINFORCE
- Faster convergence

**Playground**:
- Visualize actor and critic outputs
- Adjust learning rates for each
- Compare to REINFORCE
- See bias-variance tradeoff

---

## Lesson 5.5: Advantage Actor-Critic (A2C)

### Theory
- Synchronous advantage actor-critic
- Multiple parallel environments
- Batch updates
- Generalized advantage estimation (GAE)
- Entropy regularization for exploration
- A2C vs A3C (asynchronous)

### Examples
- **Parallel environments**: Speed up data collection
- **GAE**: Smooth advantage estimates
- **Entropy bonus**: Encourage exploration

### Quiz Topics
- Why parallel environments?
- GAE formula and purpose
- Entropy regularization
- A2C algorithm steps

### Coding Exercise
**Title**: A2C with Multiple Environments
**Task**: Implement synchronized A2C
**Implement**:
- Multiple environment instances
- Collect rollouts from all environments
- Batch advantage computation
- Synchronous actor and critic updates
- Optional: GAE for advantage estimation
- Optional: Entropy bonus

**Test Cases**:
- Faster learning than single-environment AC
- Batch updates work correctly
- Multiple environments run in parallel
- Solves more complex tasks

---

## Module 5 Checkpoint Quiz
**Comprehensive assessment**
- 15 questions on policy gradients
- REINFORCE, baselines, Actor-Critic
- Variance reduction techniques
- Pass threshold: 70%

---

# MODULE 6: ADVANCED POLICY OPTIMIZATION

## Module Overview
- **What you'll learn**: State-of-the-art policy gradient methods (PPO, TRPO)
- **Prerequisites**: Module 5
- **Estimated time**: 14-18 hours
- **Outcome**: Implement PPO, understand trust regions, solve complex continuous control

---

## Lesson 6.1: Trust Region Policy Optimization (TRPO)

### Theory
- Problem: large policy updates can be destructive
- Trust region constraint: limit KL divergence
- Constrained optimization problem
- Conjugate gradient method (simplified explanation)
- Line search for step size
- Monotonic improvement guarantee
- Computational complexity

### Examples
- **Destructive updates**: Show policy collapsing without trust region
- **KL divergence constraint**: Keeps new policy close to old
- **TRPO learning curves**: Stable, monotonic improvement

### Quiz Topics
- Why trust regions?
- KL divergence as distance metric
- TRPO objective function
- Monotonic improvement theorem

### Coding Exercise
**Title**: Simplified TRPO
**Task**: Implement TRPO with simplified optimization (no conjugate gradient)
**Implement**:
- Compute advantage estimates
- Compute policy ratio and KL divergence
- Line search to satisfy KL constraint
- Policy update
- Track KL divergence per update

**Test Cases**:
- KL constraint satisfied
- Monotonic improvement (mostly)
- Solves continuous control task
- More stable than vanilla policy gradient

---

## Lesson 6.2: Proximal Policy Optimization (PPO)

### Theory
- Simplified alternative to TRPO
- Clipped surrogate objective
- Clip ratio between 1-ε and 1+ε
- Multiple epochs on same data
- No complex second-order optimization
- PPO has become the workhorse algorithm
- PPO-Clip vs PPO-Penalty variants

### Examples
- **Clipping visualization**: How clipping limits policy changes
- **PPO vs TRPO**: Similar performance, much simpler
- **Multiple epochs**: Reuse data efficiently

### Quiz Topics
- PPO clipped objective formula
- Why clipping works
- PPO vs TRPO tradeoffs
- Hyperparameters: ε, epochs, batch size

### Coding Exercise
**Title**: Implement PPO
**Task**: Full PPO implementation
**Implement**:
- Collect rollouts
- Compute advantages (GAE)
- Clipped surrogate loss
- Multiple epochs of minibatch updates
- Value function loss
- Entropy bonus
- Train on continuous control task (e.g., HalfCheetah, Humanoid)

**Test Cases**:
- Clipping prevents large policy changes
- Multiple epochs improve sample efficiency
- Solves challenging continuous control
- Stable training, smooth learning curves

**Playground**:
- Adjust clipping parameter ε
- Change number of epochs
- Visualize policy updates
- Compare with/without clipping

---

## Lesson 6.3: PPO for Discrete Actions

### Theory
- PPO works for both continuous and discrete actions
- Categorical distribution for discrete actions
- Clipping still applies to probability ratios
- Entropy regularization especially important
- Applications: Atari, board games

### Examples
- **Atari with PPO**: Often outperforms DQN
- **Entropy decay**: Start high, decay over time

### Quiz Topics
- PPO for discrete vs continuous
- Categorical policy implementation
- Entropy regularization purpose
- When PPO beats value-based methods

### Coding Exercise
**Title**: PPO for Atari
**Task**: Apply PPO to discrete action space (Atari game)
**Implement**:
- Convolutional policy network
- Categorical action distribution
- PPO updates for discrete actions
- Frame preprocessing
- Train on Pong or Breakout

**Test Cases**:
- Agent learns to play Atari game
- Score improves over time
- Policy entropy decreases (exploration → exploitation)
- Competitive with DQN

---

## Lesson 6.4: Generalized Advantage Estimation (GAE)

### Theory
- Bias-variance tradeoff in advantage estimation
- n-step returns: A^(n) = r_t + γr_{t+1} + ... + γ^n V(s_{t+n}) - V(s_t)
- Exponentially weighted average of n-step advantages
- GAE parameter λ: 0 = TD(0), 1 = Monte Carlo
- Combines low bias and low variance
- Used in PPO, TRPO, A2C

### Examples
- **GAE vs TD vs MC**: Bias-variance comparison
- **λ tuning**: Effect on learning
- **GAE in practice**: Standard in modern policy gradient methods

### Quiz Topics
- GAE formula
- λ parameter effect
- Why GAE is better than simple advantages
- Optimal λ selection

### Coding Exercise
**Title**: Implement GAE
**Task**: Add GAE to your Actor-Critic or PPO
**Implement**:
- Compute TD errors for entire trajectory
- Apply GAE formula: A_t = Σ_l (γλ)^l δ_{t+l}
- Integrate with PPO or AC
- Compare learning with different λ values

**Test Cases**:
- GAE improves learning over simple TD advantage
- λ = 0 matches TD, λ = 1 matches MC
- Intermediate λ (e.g., 0.95) often best
- More stable learning curves

**Playground**:
- Adjust λ with slider
- Visualize advantage estimates
- Compare learning curves
- Find optimal λ for task

---

## Lesson 6.5: Continuous Control Applications

### Theory
- Gaussian policy for continuous actions
- Mean and standard deviation parameterization
- Action clipping and rescaling
- Hyperparameter tuning for continuous control
- Common environments: MuJoCo, PyBullet
- Evaluation metrics: cumulative reward, success rate

### Examples
- **Humanoid walking**: Complex continuous control
- **Robotic manipulation**: Reaching, grasping
- **Hyperparameter sensitivity**: PPO is fairly robust

### Quiz Topics
- Gaussian policy representation
- Continuous action challenges
- Hyperparameter best practices
- Evaluation in continuous control

### Coding Exercise
**Title**: PPO for Continuous Control
**Task**: Solve a MuJoCo or PyBullet task
**Implement**:
- Gaussian policy network (mean and log_std)
- Sample actions from Gaussian
- PPO training loop
- Hyperparameter search (optional)
- Visualize learned behavior

**Test Cases**:
- Agent learns locomotion or manipulation
- Reward increases over time
- Policy generalizes to test scenarios
- Performance competitive with baselines

**Playground**:
- Watch agent behavior in real-time
- Adjust network architecture
- Tune hyperparameters
- Compare different policy parameterizations

---

## Module 6 Checkpoint Quiz
**Comprehensive assessment**
- 15 questions on TRPO, PPO, GAE
- Continuous vs discrete actions
- Trust regions and clipping
- Pass threshold: 70%

---

# MODULE 7: MODEL-BASED RL

## Module Overview
- **What you'll learn**: Learn dynamics model, use it for planning and learning
- **Prerequisites**: Module 6
- **Estimated time**: 10-14 hours
- **Outcome**: Understand model-based RL, implement Dyna-Q, basics of MCTS

---

## Lesson 7.1: Introduction to Model-Based RL

### Theory
- Model-free vs model-based distinction
- Dynamics model: p(s', r | s, a)
- Reward model: r(s, a, s')
- Planning with a model
- Sample efficiency advantages
- Model error and compounding errors
- When to use model-based RL

### Examples
- **Perfect model**: Board games like chess
- **Learned model**: Robotics simulation
- **Model uncertainty**: Real-world robotics

### Quiz Topics
- Model-free vs model-based comparison
- Model components
- Planning vs learning distinction
- Sample efficiency benefits and challenges

### Coding Exercise
**Title**: Learn a Dynamics Model
**Task**: Learn transition and reward functions from data
**Implement**:
- Collect transitions (s, a, r, s')
- Train neural network to predict (r, s') from (s, a)
- Evaluate model accuracy
- Visualize predictions vs true dynamics

**Test Cases**:
- Model predicts next state accurately
- Reward predictions close to true rewards
- Model generalizes to unseen state-action pairs
- Accuracy improves with more data

---

## Lesson 7.2: Dyna-Q Algorithm

### Theory
- Integrate learning and planning
- Real experience: update Q, update model
- Simulated experience: sample from model, update Q
- Planning steps: n simulated experiences per real step
- Dyna architecture
- Tabular Dyna-Q

### Examples
- **Dyna-Q on GridWorld**: Much faster learning than Q-learning
- **Planning steps**: More planning = faster convergence
- **Changing environments**: Model must adapt

### Quiz Topics
- Dyna-Q algorithm steps
- Real vs simulated experience
- Planning steps hyperparameter
- When Dyna helps most

### Coding Exercise
**Title**: Implement Dyna-Q
**Task**: Tabular Dyna-Q for GridWorld
**Implement**:
- Tabular model (counts of transitions)
- Q-learning from real experience
- Update model with real experience
- Planning: sample from model, update Q
- Adjustable planning steps

**Test Cases**:
- Learns faster than Q-learning
- More planning steps → faster learning
- Model accurately represents environment
- Handles environment changes (model updates)

**Playground**:
- Adjust planning steps (0 to 50)
- Visualize real vs simulated experience
- See speedup from planning
- Compare to model-free Q-learning

---

## Lesson 7.3: Model Errors and Uncertainty

### Theory
- Model bias and how it compounds
- Epistemic vs aleatoric uncertainty
- Ensemble models for uncertainty estimation
- Model-based RL challenges in complex domains
- Dyna-2: combining model-free and model-based
- MBPO: short rollouts to mitigate compounding errors

### Examples
- **Compounding errors**: Small model errors lead to divergence
- **Ensemble disagreement**: Measure uncertainty
- **Short rollouts**: MBPO uses 1-5 step rollouts

### Quiz Topics
- Model error sources
- Uncertainty types
- Mitigating compounding errors
- Ensemble methods

### Coding Exercise
**Title**: Model Uncertainty with Ensembles
**Task**: Train ensemble of models, use disagreement for uncertainty
**Implement**:
- Train k=5 dynamics models
- Compute prediction variance across ensemble
- Use uncertainty for exploration or rollout length
- Compare single model vs ensemble

**Test Cases**:
- Ensemble reduces overfitting
- Disagreement correlates with error
- Uncertainty-aware agent explores better
- Performance improves over single model

---

## Lesson 7.4: Monte Carlo Tree Search (MCTS)

### Theory
- Tree search with learned value function
- Selection, expansion, simulation, backpropagation
- Upper Confidence Bound for Trees (UCT)
- AlphaGo/AlphaZero MCTS variant
- Applications: board games, combinatorial optimization
- MCTS with learned policy and value networks

### Examples
- **MCTS on Tic-Tac-Toe**: Simple demonstration
- **AlphaZero**: Superhuman game play with MCTS
- **UCB formula**: Balance exploration and exploitation in tree

### Quiz Topics
- MCTS algorithm phases
- UCB exploration bonus
- Why MCTS works well for games
- MCTS vs traditional search

### Coding Exercise
**Title**: MCTS for Tic-Tac-Toe
**Task**: Implement basic MCTS
**Implement**:
- Game tree node class
- Selection with UCB
- Expansion
- Simulation (random rollout or value network)
- Backpropagation
- Play game with MCTS agent

**Test Cases**:
- MCTS agent plays well
- More simulations → better play
- UCB balances exploration/exploitation
- Beats random agent consistently

**Playground**:
- Adjust number of simulations
- Visualize tree growth
- See move probabilities
- Play against MCTS agent

---

## Module 7 Checkpoint Quiz
**Comprehensive assessment**
- 12 questions on model-based RL
- Dyna-Q, model learning, MCTS
- Model-based vs model-free tradeoffs
- Pass threshold: 70%

---

# MODULE 8: MULTI-AGENT RL & ADVANCED TOPICS

## Module Overview
- **What you'll learn**: Multi-agent systems, RLHF basics, advanced topics
- **Prerequisites**: Modules 1-7
- **Estimated time**: 12-16 hours
- **Outcome**: Understand multi-agent challenges, RLHF, and cutting-edge topics

---

## Lesson 8.1: Introduction to Multi-Agent RL

### Theory
- Single-agent vs multi-agent environments
- Cooperative, competitive, and mixed scenarios
- Non-stationarity from other agents' learning
- Nash equilibrium
- Independent learners vs joint action learners
- Communication and coordination

### Examples
- **Cooperative**: Multi-robot coordination
- **Competitive**: Poker, RTS games
- **Mixed**: Autonomous driving

### Quiz Topics
- Multi-agent challenges
- Cooperative vs competitive
- Nash equilibrium concept
- Non-stationarity problem

### Coding Exercise
**Title**: Multi-Agent GridWorld
**Task**: Implement environment with multiple agents
**Implement**:
- Multi-agent environment (2+ agents)
- Cooperative task (reach goals together)
- Independent Q-learning for each agent
- Observe emergent coordination

**Test Cases**:
- Multiple agents can act
- Cooperative task solvable
- Agents learn (somewhat)
- Coordination emerges

---

## Lesson 8.2: Self-Play and Population-Based Training

### Theory
- Self-play: agent trains against itself
- Nash equilibrium through self-play
- Population-based training: diverse agent pool
- Exploitability metrics
- Applications: game AI (AlphaGo, OpenAI Five)

### Examples
- **AlphaGo**: Self-play for superhuman Go
- **OpenAI Five**: Dota 2 with self-play
- **Population diversity**: Prevents overfitting to single strategy

### Quiz Topics
- Self-play algorithm
- Why self-play works
- Population-based training benefits
- Exploitability measurement

### Coding Exercise
**Title**: Self-Play for Tic-Tac-Toe
**Task**: Train agent against itself
**Implement**:
- Agent plays both sides
- Policy network updates after each game
- Track win rate vs older versions
- Maintain population of past agents

**Test Cases**:
- Agent improves over time
- Beats random agent
- Near-optimal strategy emerges
- Population diversity maintained

**Playground**:
- Watch self-play games
- Visualize policy evolution
- Compare to supervised learning from expert games
- Play against trained agent

---

## Lesson 8.3: Reinforcement Learning from Human Feedback (RLHF)

### Theory
- RLHF motivation: align AI with human preferences
- Collect human preference comparisons
- Train reward model from preferences
- Use reward model in RL (PPO typically)
- Applications: ChatGPT, Claude
- Reward hacking and safety concerns

### Examples
- **RLHF for language models**: Helpful, harmless, honest AI
- **Preference labeling**: Human compares two outputs
- **Reward model**: Predicts which output human prefers

### Quiz Topics
- RLHF pipeline steps
- Preference learning
- Reward model training
- Applications and limitations

### Coding Exercise
**Title**: Simple RLHF for Text Generation
**Task**: Implement simplified RLHF
**Implement**:
- Generate text pairs from language model
- Simulate human preferences (or collect real ones)
- Train reward model (binary classifier)
- Fine-tune language model with PPO using reward model
- Compare before/after RLHF

**Test Cases**:
- Reward model predicts preferences accurately
- PPO improves outputs according to reward model
- Generated text quality improves (subjective)
- Reward hacking observable (if present)

---

## Lesson 8.4: Exploration Strategies

### Theory
- Exploration-exploitation tradeoff revisited
- Epsilon-greedy review
- Optimistic initialization
- Upper Confidence Bound (UCB)
- Thompson Sampling
- Curiosity-driven exploration (intrinsic rewards)
- Random Network Distillation (RND)
- Never Give Up (NGU)

### Examples
- **UCB for bandits**: Optimism in the face of uncertainty
- **Intrinsic motivation**: Exploring novel states
- **Montezuma's Revenge**: Hard exploration problem

### Quiz Topics
- Exploration strategy comparison
- UCB formula and intuition
- Intrinsic motivation
- When each strategy works best

### Coding Exercise
**Title**: Exploration Methods Comparison
**Task**: Implement and compare exploration strategies
**Implement**:
- Epsilon-greedy
- UCB
- Thompson Sampling (for bandits or simple MDP)
- Curiosity-driven (count-based or prediction error)
- Test on hard exploration tasks

**Test Cases**:
- UCB performs well on bandits
- Curiosity helps in sparse reward environments
- Epsilon-greedy is simple but effective
- Each method has situations where it excels

**Playground**:
- Visualize exploration patterns
- Compare strategies side-by-side
- Adjust hyperparameters
- See when each method succeeds/fails

---

## Lesson 8.5: Offline RL

### Theory
- Learning from fixed dataset (no environment interaction)
- Conservative Q-Learning (CQL)
- Batch-Constrained Q-Learning (BCQ)
- Applications: healthcare, robotics with expensive data collection
- Challenges: distribution shift, extrapolation error
- Offline RL as supervised learning + RL

### Examples
- **Autonomous driving**: Learn from logged data
- **Healthcare**: Learn treatment policies from medical records
- **Robotics**: Pre-training from demonstrations

### Quiz Topics
- Offline vs online RL
- Why offline RL is hard
- Conservative approaches (CQL, BCQ)
- Applications and limitations

### Coding Exercise
**Title**: Offline Q-Learning
**Task**: Learn from fixed dataset without environment interaction
**Implement**:
- Load dataset of transitions
- Train Q-function (with conservatism)
- Evaluate on environment (if available) or by simulation
- Compare to behavioral cloning

**Test Cases**:
- Q-function learns from data
- Conservative penalties prevent overestimation
- Performance reasonable given data quality
- Better than behavioral cloning (in some cases)

---

## Lesson 8.6: Meta-RL and Transfer Learning

### Theory
- Learning to learn: adapt quickly to new tasks
- Model-Agnostic Meta-Learning (MAML)
- Meta-RL: learn policy that can adapt
- Transfer learning: leverage knowledge from related tasks
- Multi-task RL
- Zero-shot and few-shot generalization

### Examples
- **MAML**: Few-shot adaptation
- **Multi-task RL**: One policy for many games
- **Sim-to-real transfer**: Train in simulation, deploy in real world

### Quiz Topics
- Meta-learning concept
- MAML algorithm
- Transfer learning strategies
- When meta-RL is beneficial

### Coding Exercise
**Title**: Multi-Task RL
**Task**: Train single policy on multiple related tasks
**Implement**:
- Multiple task variants (e.g., GridWorlds with different layouts)
- Shared policy network with task conditioning
- Train on all tasks simultaneously
- Test generalization to new task

**Test Cases**:
- Policy solves multiple tasks
- Faster learning than training separate policies
- Some generalization to unseen tasks
- Task conditioning works

---

## Lesson 8.7: Safe RL

### Theory
- Safety constraints in RL
- Constrained MDPs
- Shielding: prevent unsafe actions
- Reward shaping for safety
- Verification and formal methods
- Safe exploration
- Applications: autonomous vehicles, robotics

### Examples
- **Safe autonomous driving**: Never hit pedestrians
- **Robotic manipulation**: Don't break objects
- **Shielding**: Override agent's unsafe actions

### Quiz Topics
- Safety constraints formulation
- Constrained optimization
- Shielding vs reward shaping
- Safe exploration strategies

### Coding Exercise
**Title**: Safe RL with Constraints
**Task**: Learn policy that satisfies safety constraints
**Implement**:
- Define safety constraint (e.g., stay in safe region)
- Modify PPO or DQN to respect constraints
- Lagrangian relaxation or constrained optimization
- Track constraint violations

**Test Cases**:
- Agent learns task while satisfying constraints
- Constraint violations rare or zero
- Performance reasonable despite constraints
- Safety generalizes to test scenarios

---

## Module 8 Final Project Ideas

**Option 1: Multi-Agent Coordination**
- Implement cooperative multi-agent RL
- Environment: Multi-robot navigation or team game
- Use self-play or independent learners
- Demonstrate emergent coordination

**Option 2: RLHF for Text or Image Generation**
- Collect preference data
- Train reward model
- Fine-tune generative model with PPO
- Evaluate alignment with preferences

**Option 3: Model-Based RL for Robotics**
- Learn dynamics model for robotic task
- Use model for planning (Dyna or MCTS)
- Compare to model-free baseline
- Demonstrate sample efficiency

**Option 4: Safe RL Application**
- Define safety-critical task
- Implement constrained RL algorithm
- Ensure safety while optimizing performance
- Formal verification or testing

---

## Final Curriculum Checkpoint Quiz
**Comprehensive final assessment**
- 30 questions covering all modules
- Algorithm selection for scenarios
- Hyperparameter tuning
- Troubleshooting common issues
- Pass threshold: 75%

---

# APPENDIX: REFERENCE MATERIALS

## Quick Algorithm Comparison Table

| Algorithm | Type | Model | On/Off-Policy | Best For |
|-----------|------|-------|---------------|----------|
| Q-Learning | Value | Free | Off | Discrete, Tabular |
| SARSA | Value | Free | On | Discrete, Safe Learning |
| DQN | Value | Free | Off | Discrete, High-Dim |
| PPO | Policy | Free | On | General Purpose |
| TRPO | Policy | Free | On | Continuous Control |
| A2C/A3C | Actor-Critic | Free | On | Parallel Envs |
| Dyna-Q | Model-Based | Based | Off | Sample Efficiency |
| MCTS | Search | Based | N/A | Games, Planning |

## Common Hyperparameters

**Q-Learning / DQN:**
- Learning rate α: 0.0001 - 0.001
- Discount γ: 0.95 - 0.99
- Epsilon (start): 1.0, (end): 0.01-0.1
- Replay buffer size: 10k - 1M
- Batch size: 32 - 256

**PPO:**
- Learning rate: 0.0003 - 0.001
- Discount γ: 0.99
- GAE λ: 0.95
- Clip ε: 0.1 - 0.2
- Epochs per update: 3 - 10
- Minibatch size: 64 - 4096

## Debugging Checklist

**Agent not learning:**
- Check reward scale (too large/small?)
- Verify environment is solvable
- Increase exploration (higher ε)
- Check learning rate (try smaller/larger)
- Visualize Q-values or policy

**Unstable learning:**
- Reduce learning rate
- Add target network (DQN)
- Clip gradients
- Normalize inputs/rewards
- Check for bugs in environment

**Slow convergence:**
- Increase learning rate (carefully)
- More exploration
- Better feature representation
- Tune discount factor
- Add reward shaping

## Key Equations Reference

**Bellman Equations:**
- V^π(s) = Σ_a π(a|s) Σ_{s',r} p(s',r|s,a)[r + γV^π(s')]
- Q^π(s,a) = Σ_{s',r} p(s',r|s,a)[r + γΣ_{a'} π(a'|s')Q^π(s',a')]
- V*(s) = max_a Σ_{s',r} p(s',r|s,a)[r + γV*(s')]
- Q*(s,a) = Σ_{s',r} p(s',r|s,a)[r + γ max_{a'} Q*(s',a')]

**Update Rules:**
- Q-learning: Q(s,a) ← Q(s,a) + α[r + γ max_{a'} Q(s',a') - Q(s,a)]
- SARSA: Q(s,a) ← Q(s,a) + α[r + γQ(s',a') - Q(s,a)]
- TD(0): V(s) ← V(s) + α[r + γV(s') - V(s)]
- Policy Gradient: θ ← θ + α∇_θ log π(a|s;θ) G_t

**Advantage Estimation:**
- GAE: A_t = Σ_{l=0}^∞ (γλ)^l δ_{t+l}, where δ_t = r_t + γV(s_{t+1}) - V(s_t)

## Common Environments

**Gym Classic Control:**
- CartPole-v1: Balance pole (discrete actions)
- MountainCar-v0: Reach goal on hill (continuous state)
- Acrobot-v1: Swing to height (discrete actions)

**Atari:**
- Pong-v0: Classic paddle game
- Breakout-v0: Brick breaking
- SpaceInvaders-v0: Shoot aliens

**MuJoCo / PyBullet:**
- HalfCheetah: 2D running
- Humanoid: 3D humanoid locomotion
- Reacher: Reach target with arm

**Multi-Agent:**
- PettingZoo: Multi-agent environments
- SMAC (StarCraft): Cooperative strategy

---

## Curriculum Complete! 🎉

You've covered the full spectrum of modern reinforcement learning:
- Foundations (MDPs, Bellman equations)
- Tabular methods (DP, MC, TD)
- Function approximation and deep RL
- DQN and variants
- Policy gradients (REINFORCE, Actor-Critic, PPO)
- Model-based RL
- Multi-agent, RLHF, and advanced topics

**Next Steps:**
1. Apply these techniques to real problems
2. Read cutting-edge papers
3. Contribute to open-source RL projects
4. Build your own RL tools
5. Keep learning - RL is rapidly evolving!

**Recommended Resources:**
- Sutton & Barto: "Reinforcement Learning: An Introduction"
- Spinning Up in Deep RL (OpenAI)
- David Silver's RL Course
- Papers: DQN, PPO, AlphaGo, RLHF papers
- Code: Stable-Baselines3, CleanRL, RLlib
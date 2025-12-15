# RL Learning Webapp - Product Specification

## 🎯 Implementation Status (Dec 12, 2024)

**✅ Completed (40% of MVP)**
- Next.js app with TypeScript, Tailwind CSS v3, and shadcn/ui
- Dashboard with progress tracking and curriculum overview
- Theory lesson viewer with markdown/LaTeX support
- Interactive quiz component with instant feedback
- Progress persistence using LocalStorage
- Dark/light mode theme system
- Basic routing and navigation

**🚧 In Progress**
- Monaco Editor integration for code exercises
- Pyodide setup for Python execution in browser
- Interactive playground component

**📋 Next Priority**
- Complete code exercise component with test runner
- Add more curriculum content (currently only Module 1 has content)
- Implement achievements system

**See `implementation_status.md` for detailed progress report**

---

## Product Overview

An interactive web application that teaches reinforcement learning through a structured 16-week curriculum. The platform combines theory, quizzes, and hands-on coding exercises with an embedded code execution environment, allowing learners to write and run RL algorithms directly in the browser.

### Core Value Proposition
- **Learn by doing**: Tight feedback loop between theory and implementation
- **Self-paced**: Progress through curriculum at your own speed
- **Immediate feedback**: Run code and see results instantly
- **Visual learning**: Watch RL agents learn in real-time through interactive visualizations
- **Progress tracking**: Clear sense of achievement and momentum

### Target User
Self-directed learners with Python proficiency but limited ML/AI experience who want to master reinforcement learning through practical implementation.

---

## Technical Architecture Overview

### Frontend Stack
- **Framework**: Next.js (React)
- **Code Editor**: Monaco Editor (VS Code engine)
- **Python Runtime**: Pyodide (WebAssembly) for Weeks 1-4, server execution for Weeks 5+
- **Styling**: Tailwind CSS + Shadcn
- **Visualization**: Recharts, D3.js for custom RL visualizations - if complex, example images can be sourced offline
- **State Management**: React Context / Zustand

### Backend Stack (Phase 2)
- **API**: FastAPI (Python)
- **Database**: PostgreSQL (user progress, quiz results) - for localhost, use port 5438
- **Code Execution**: Docker containers for sandboxed Python execution
- **Authentication**: NextAuth.js

### Data Storage
- **Curriculum Content**: Static JSON/Markdown files
- **User Progress**: Database (lessons completed, quiz scores, exercise status)
- **User Code**: LocalStorage (MVP) → Database (Phase 2)

---

## Screen-by-Screen Specifications

## 1. Dashboard / Home Screen

### Purpose
Central hub for navigation, progress tracking, and motivation.

### Layout
```
+----------------------------------------------------------+
|  [Logo]  RL Mastery                    [Profile] [Settings] |
+----------------------------------------------------------+
|                                                          |
|  Welcome back, Ankit! 👋                                |
|  You're currently in Week 2, Lesson 3                   |
|                                                          |
|  [Continue Learning →]                                   |
|                                                          |
|  +--------------------+  +---------------------------+  |
|  | Your Progress      |  | This Week                 |  |
|  |                    |  | □ Lesson 1: Theory       |  |
|  | 18/64 Lessons ✓    |  | ✓ Lesson 2: Quiz         |  |
|  | 12/48 Exercises ✓  |  | ⊙ Lesson 3: Exercise     |  |
|  | Week 2 of 16       |  | □ Lesson 4: Playground   |  |
|  +--------------------+  +---------------------------+  |
|                                                          |
|  Curriculum Overview                                    |
|  +------------------------------------------------+    |
|  | Week 1: RL Foundations        [████████] 100%  |    |
|  | Week 2: Tabular Methods       [████░░░░░]  50%  |    |
|  | Week 3: Function Approx       [░░░░░░░░]   0%  |    |
|  | ...                                             |    |
|  +------------------------------------------------+    |
|                                                          |
|  Achievements                                           |
|  🎯 First Exercise    🔥 3-Day Streak    📈 Quick Learner |
+----------------------------------------------------------+
```

### Components
1. **Hero Section**
   - Personalized greeting
   - Current location in curriculum
   - Primary CTA: "Continue Learning" button

2. **Progress Cards**
   - Overall stats (lessons, exercises, quizzes completed)
   - Current week breakdown with checkboxes
   - Visual progress bars

3. **Curriculum Map**
   - All 16 weeks listed
   - Status indicators: locked 🔒, in progress ⊙, completed ✓
   - Click to navigate to any unlocked week
   - Progress bar per week

4. **Achievements/Gamification**
   - Streak counter
   - Badges for milestones
   - Learning stats (total hours, best streak)

### User Actions
- Click "Continue Learning" → Navigate to next incomplete lesson
- Click any unlocked week → Navigate to week overview
- Click Settings → Go to settings screen
- Click Profile → View/edit profile

### State Requirements
- User progress data (completed lessons, current position)
- Streak information
- Achievement unlocks
- Last active timestamp

---

## 2. Week Overview Screen

### Purpose
Preview week content and navigate between lessons.

### Layout
```
+----------------------------------------------------------+
|  ← Back to Dashboard                                     |
+----------------------------------------------------------+
|                                                          |
|  Week 2: Tabular Methods Deep Dive                      |
|                                                          |
|  This week you'll master the core tabular RL algorithms |
|  including SARSA, Q-learning, and Expected SARSA.       |
|                                                          |
|  Learning Objectives:                                   |
|  • Understand exploration vs exploitation               |
|  • Compare on-policy and off-policy methods             |
|  • Implement and debug tabular agents                   |
|                                                          |
|  +--------------------------------------------------+   |
|  | Lesson 1: Monte Carlo Methods        ✓  [Review] |   |
|  | Lesson 2: Temporal Difference Learning ✓ [Review] |   |
|  | Lesson 3: SARSA Algorithm            ⊙  [Start]  |   |
|  | Lesson 4: Q-Learning vs SARSA        🔒 [Locked]  |   |
|  | Lesson 5: Week 2 Playground          🔒 [Locked]  |   |
|  | Week 2 Checkpoint Quiz               🔒 [Locked]  |   |
|  +--------------------------------------------------+   |
|                                                          |
|  Estimated time: 8-10 hours                             |
|  Prerequisites: Week 1 completed ✓                      |
|                                                          |
+----------------------------------------------------------+
```

### Components
1. **Week Header**
   - Week number and title
   - Brief description
   - Learning objectives (bulleted list)

2. **Lesson List**
   - All lessons in order
   - Status icons (completed, in progress, locked)
   - Primary action button (Review/Start/Continue/Locked)
   - Lesson type indicator (Theory/Quiz/Exercise/Playground)

3. **Week Metadata**
   - Estimated completion time
   - Prerequisites
   - Optional: Resources (papers, videos)

### User Actions
- Click lesson with "Start/Continue" → Go to that lesson
- Click "Review" → Re-enter completed lesson
- Navigate back to dashboard
- Locked lessons show tooltip explaining unlock requirements

### State Requirements
- Per-lesson completion status
- Current active lesson
- Lock/unlock logic based on prerequisite completion

---

## 3. Lesson View Screen (Theory)

### Purpose
Primary learning interface for reading and understanding concepts.

### Layout
```
+----------------------------------------------------------+
|  Week 2 > Lesson 3: SARSA Algorithm                      |
+----------------------------------------------------------+
| [TOC ▼]            |  MAIN CONTENT AREA                  |
|                    |                                      |
| Introduction       |  # SARSA: On-Policy TD Control      |
| • What is SARSA?   |                                      |
| • Key Differences  |  SARSA (State-Action-Reward-State-  |
| The Algorithm      |  Action) is an on-policy temporal   |
| • Update Rule      |  difference control algorithm...    |
| • Pseudocode       |                                      |
| Example            |  ## The Update Rule                 |
| • GridWorld        |                                      |
| Comparison         |  Q(S,A) ← Q(S,A) + α[R + γQ(S',A')  |
| • SARSA vs Q-L     |                - Q(S,A)]             |
| Key Takeaways      |                                      |
|                    |  [Diagram: SARSA update cycle]      |
|                    |                                      |
|                    |  Unlike Q-learning, SARSA updates   |
|                    |  based on the action actually taken |
|                    |  by the current policy...           |
|                    |                                      |
|                    |  ## Example: GridWorld              |
|                    |                                      |
|                    |  [Interactive visualization]        |
|                    |                                      |
|                    |  +------------------------------+   |
|                    |  | 💡 Key Insight                |   |
|                    |  | SARSA learns the value of the |   |
|                    |  | policy it's following, making |   |
|                    |  | it more conservative than     |   |
|                    |  | Q-learning in risky envs.     |   |
|                    |  +------------------------------+   |
|                    |                                      |
+--------------------+--------------------------------------+
| ← Previous Section                   Next: Quiz → |
+----------------------------------------------------------+
| Reading Progress: ████████░░░░░░  60%                    |
+----------------------------------------------------------+
```

### Components
1. **Navigation Sidebar (Left, Sticky)**
   - Table of contents with nested sections
   - Click to jump to section
   - Current section highlighted
   - Collapsible/expandable

2. **Content Area**
   - Markdown-rendered theory
   - LaTeX math rendering (for equations)
   - Syntax-highlighted code snippets (read-only examples)
   - Embedded images/diagrams
   - Callout boxes (Tips, Warnings, Key Insights)
   - Interactive visualizations where applicable

3. **Navigation Footer**
   - Previous/Next section buttons
   - Progress bar showing reading completion
   - Breadcrumb trail

### Interactions
- Scroll to read, auto-saves reading position
- Click TOC items to jump to sections
- Click code snippets to copy to clipboard
- Hover over terms for definitions (tooltip)
- Optional: Highlight text to save notes

### Content Types
- **Text**: Explanations, examples
- **Equations**: LaTeX-rendered formulas
- **Code**: Syntax-highlighted Python examples
- **Diagrams**: Static images or interactive SVG
- **Callouts**: Important concepts, warnings, pro tips
- **Videos**: Embedded short explanations (optional)

---

## 4. Quiz Screen

### Purpose
Test understanding of theory concepts with immediate feedback.

### Layout - Question View
```
+----------------------------------------------------------+
|  Week 2 > Lesson 3 Quiz                                  |
+----------------------------------------------------------+
|                                                          |
|  Question 3 of 7                           [░░░█░░░]    |
|                                                          |
|  Which statement is TRUE about SARSA?                   |
|                                                          |
|  ○ SARSA is an off-policy algorithm                     |
|  ○ SARSA updates Q-values based on the greedy action    |
|  ● SARSA learns the value of the policy being followed  |
|  ○ SARSA always converges faster than Q-learning        |
|                                                          |
|                                    [Show Hint] [Submit]  |
|                                                          |
+----------------------------------------------------------+
```

### Layout - After Submission
```
+----------------------------------------------------------+
|  Week 2 > Lesson 3 Quiz                                  |
+----------------------------------------------------------+
|                                                          |
|  Question 3 of 7                           [░░░█░░░]    |
|                                                          |
|  Which statement is TRUE about SARSA?                   |
|                                                          |
|  ○ SARSA is an off-policy algorithm                     |
|  ○ SARSA updates Q-values based on the greedy action    |
|  ✓ SARSA learns the value of the policy being followed  |
|  ○ SARSA always converges faster than Q-learning        |
|                                                          |
|  +------------------------------------------------------+|
|  | ✓ Correct!                                           ||
|  |                                                      ||
|  | SARSA is an on-policy algorithm, meaning it learns  ||
|  | the value of the policy it's currently following.   ||
|  | This is why it's called State-Action-Reward-State-  ||
|  | Action - it uses the actual next action A'.         ||
|  +------------------------------------------------------+|
|                                                          |
|                                            [Next →]      |
|                                                          |
+----------------------------------------------------------+
```

### Layout - End Summary
```
+----------------------------------------------------------+
|  Quiz Complete! 🎉                                       |
+----------------------------------------------------------+
|                                                          |
|  Your Score: 6/7 (86%)                                  |
|                                                          |
|  +------------------------------------------------------+|
|  | ✓ Question 1: What is SARSA?                         ||
|  | ✓ Question 2: On-policy vs off-policy                ||
|  | ✓ Question 3: SARSA characteristics                  ||
|  | ✗ Question 4: Convergence guarantees                 ||
|  | ✓ Question 5: Update rule                            ||
|  | ✓ Question 6: Exploration strategies                 ||
|  | ✓ Question 7: Comparison with Q-learning             ||
|  +------------------------------------------------------+|
|                                                          |
|  Topics to Review:                                      |
|  • Convergence conditions for tabular methods           |
|                                                          |
|  [Review Incorrect] [Retake Quiz] [Continue to Exercise]|
|                                                          |
+----------------------------------------------------------+
```

### Components
1. **Question Display**
   - Question number and total
   - Progress indicator
   - Question text (may include code snippets or diagrams)
   - Answer options (radio buttons for single choice, checkboxes for multiple)

2. **Hint System**
   - "Show Hint" button
   - Progressive hints (Hint 1 is gentle, Hint 2 more direct)
   - Hints don't reveal answer directly

3. **Feedback Panel** (appears after submission)
   - Correct/Incorrect indicator with color coding
   - Explanation of why answer is right/wrong
   - Reference to relevant lesson section

4. **Summary Screen**
   - Overall score
   - Question-by-question breakdown
   - Topics to review (based on incorrect answers)
   - Actions: Review, Retake, or Continue

### Question Types
- Multiple choice (single answer)
- Multiple select (multiple correct answers)
- True/False
- Fill-in-the-blank (text input)
- Code output prediction ("What does this code print?")

### User Actions
- Select answer → Enable Submit button
- Click Submit → Show feedback, advance to next
- Click Hint → Reveal progressive hint (optional)
- Click "Review Incorrect" → Jump to relevant lesson sections
- Click "Retake Quiz" → Reset and start over
- Click "Continue" → Proceed to next lesson

### State Requirements
- Current question index
- User's answer selections
- Correct/incorrect status per question
- Hints used count
- Final score
- Timestamp of completion

---

## 5. Coding Exercise Screen

### Purpose
The core interactive experience where users implement RL algorithms and see them run.

### Layout
```
+----------------------------------------------------------+
|  Week 2 > Lesson 3: Implement SARSA                      |
+----------------------------------------------------------+
|  INSTRUCTIONS          |  CODE EDITOR                    |
|  (scrollable)          |                                 |
+------------------------+                                 |
|                        |  1  import numpy as np          |
| # Exercise: SARSA      |  2  from collections...         |
|                        |  3                               |
| Implement the SARSA    |  4  def sarsa(env, episodes...  |
| algorithm for the      |  5      # TODO: Initialize...  |
| FrozenLake environment.|  6      Q = np.zeros((env...   |
|                        |  7                               |
| ## Your Task           |  8      for episode in...      |
| Complete the sarsa()   |  9          state = env.reset() |
| function below.        | 10          # TODO: Choose...  |
|                        | 11          action = ...        |
| ## Requirements        | 12                               |
| 1. Initialize Q-table  |                                 |
| 2. Select actions with |                                 |
| epsilon-greedy         |                                 |
| 3. Update Q-values     +------------------------+--------+
| using SARSA rule       | [Run Code] [Run Tests] [Reset] |
| 4. Track returns       +--------------------------------+
|                        |                                 |
| ## Starter Code        | OUTPUT PANEL                    |
| We've provided...      | [Console] [Plots] [Tests]      |
|                        +--------------------------------+
| ## Test Cases          |                                 |
| Your implementation    | >>> Running your code...        |
| will be tested with... | Episode 100: Avg Return = -0.52 |
|                        | Episode 200: Avg Return = -0.31 |
| [Show Hints ▼]         | Episode 500: Avg Return =  0.12 |
|                        | Training complete!              |
+------------------------+---------------------------------+
```

### Layout - With Visualization
```
+----------------------------------------------------------+
|  OUTPUT PANEL                                            |
+----------------------------------------------------------+
| [Console] [Plots] [Tests] [Visualization]               |
+----------------------------------------------------------+
|                                                          |
|  Learning Curve                                         |
|  ┌─────────────────────────────────────────┐            |
|  │                              ___---      │            |
|  │                       __----              │            |
|  │             ___----                       │            |
|  │   ___----                                 │            |
|  └─────────────────────────────────────────┘            |
|    0      100     200     300     400    500            |
|                   Episodes                              |
|                                                          |
|  Q-Value Heatmap (Final Policy)                        |
|  ┌─────────────────┐                                    |
|  │ S  →  →  →  G  │  (S = Start, G = Goal)             |
|  │ ↓  H  →  H  ↓  │  (H = Hole)                        |
|  │ →  →  →  H  ↓  │  (Arrows = best action)            |
|  │ H  →  →  →  G  │                                     |
|  └─────────────────┘                                    |
|                                                          |
+----------------------------------------------------------+
```

### Layout - Test Results
```
+----------------------------------------------------------+
| [Console] [Plots] [Tests] [Visualization]               |
+----------------------------------------------------------+
|                                                          |
|  Test Results                                           |
|                                                          |
|  ✓ Test 1: Q-table initialized correctly                |
|  ✓ Test 2: Epsilon-greedy action selection works        |
|  ✓ Test 3: SARSA update rule implemented correctly      |
|  ✗ Test 4: Agent learns to reach goal                   |
|                                                          |
|  Error in Test 4:                                       |
|  Expected: Average return > 0.5 after 1000 episodes     |
|  Got: Average return = 0.23                             |
|                                                          |
|  Hint: Try increasing epsilon to explore more, or       |
|  adjusting the learning rate.                           |
|                                                          |
|  [View Full Test Code]                                  |
|                                                          |
+----------------------------------------------------------+
```

### Components

**1. Instructions Panel (Left, Scrollable)**
- Exercise description
- Task breakdown with numbered requirements
- Starter code explanation
- Test case descriptions
- Hints (collapsible sections)
- Expected outputs/behavior

**2. Code Editor (Right Top)**
- Monaco Editor with Python syntax highlighting
- Line numbers
- Basic autocomplete
- Error underlining
- Pre-filled starter code with TODO comments
- Keyboard shortcuts (Cmd/Ctrl+Enter to run)

**3. Control Buttons**
- **Run Code**: Execute code, show console output and plots
- **Run Tests**: Execute test suite, show pass/fail
- **Reset**: Restore to starter code (with confirmation)
- **Show Solution**: Unlock after X attempts or Y minutes (shows reference implementation)

**4. Output Panel (Right Bottom, Tabbed)**

**Tab: Console**
- stdout/stderr from code execution
- Print statements
- Error messages with line numbers
- Execution time

**Tab: Plots**
- Matplotlib visualizations rendered as images
- Learning curves (rewards over episodes)
- Q-value heatmaps
- Policy visualizations
- Agent trajectory animations (for gridworld-type envs)

**Tab: Tests**
- List of test cases with ✓/✗ status
- Failed test details (expected vs actual)
- Hints for failing tests
- Code coverage (advanced feature)

**Tab: Visualization** (Interactive)
- Live agent behavior in environment
- Step-through controls (play/pause/step)
- Speed controls
- Episode selector
- State/action/reward display

**5. Status Bar**
- Execution status (Ready / Running... / Success / Error)
- "Mark as Complete" button (appears when tests pass)
- Time spent on exercise

**6. Hints System** (Collapsible in instructions)
- Progressive hints (not all visible at once)
- "Show Hint 1" → reveals first hint
- "Show Hint 2" → reveals more direct guidance
- Each hint has "Was this helpful?" feedback

### Code Execution Flow
1. User writes code in editor
2. Clicks "Run Code"
3. Code sent to execution engine (Pyodide or backend)
4. Execution runs with timeout (30 seconds default)
5. Results returned:
   - Console output (stdout/stderr)
   - Generated plots (base64 images)
   - Variable values (if requested)
   - Execution time
6. Results displayed in Output Panel
7. Auto-scroll to show results

### Test Execution Flow
1. User clicks "Run Tests"
2. User code combined with test harness
3. Tests executed in isolated environment
4. Each test case returns: pass/fail, actual vs expected, error message
5. Summary displayed: X/Y tests passed
6. If all pass: "Mark as Complete" button enabled + confetti animation 🎉

### User Actions
- Write/edit code
- Run code to see outputs
- Run tests to verify correctness
- View hints when stuck
- Reset to starter code if needed
- View solution (after attempts)
- Mark as complete → Unlock next lesson
- Save code (auto-save every 30 seconds)

### State Requirements
- User's current code (persisted)
- Test results (current session)
- Hints revealed count
- Attempts count
- Time spent
- Completion status
- Saved solution snapshots (optional: user can save working versions)

---

## 6. Interactive Playground Screen

### Purpose
Experiment with RL algorithms and hyperparameters to build intuition.

### Layout
```
+----------------------------------------------------------+
|  Week 2 > SARSA Playground                               |
+----------------------------------------------------------+
|                                                          |
|  CONTROLS             |  VISUALIZATION                   |
+------------------------+                                 |
| Environment           |   FrozenLake 4x4                 |
| [FrozenLake 4x4 ▼]    |                                 |
|                       |   ┌─────────────────┐           |
| Algorithm             |   │ S  F  F  F     │           |
| [SARSA ▼]             |   │ F  H  F  H     │           |
|                       |   │ F  F  F  H     │           |
| Learning Rate (α)     |   │ H  F  F  G  🤖 │           |
| 0.1 [─────●─────] 0.5 |   └─────────────────┘           |
|                       |                                 |
| Discount (γ)          |   Episode: 247 / 500            |
| 0.9 [──────────●] 1.0 |   Current Reward: +1.0          |
|                       |   Total Return: 0.42            |
| Epsilon (ε)           |                                 |
| 0.0 [────●──────] 1.0 |   [▶ Play] [⏸ Pause] [⏭ Step]  |
|                       |   Speed: [──●────────]          |
| Episodes              +----------------------------------+
| 500                   |                                 |
|                       |  METRICS                        |
| [▶ Run Simulation]    |  [Learning Curve] [Q-Values]   |
| [Reset]               +----------------------------------+
|                       |                                 |
| [+ Add to Compare]    |  Average Return                 |
|                       |   1.0 ┌──────────────────       |
|                       |       │          ___---         |
| Comparison (2/3)      |   0.5 │    __---                |
| ┌──────────────────┐  |       │__--                     |
| │Config 1: α=0.1   │  |   0.0 └──────────────────       |
| │  Return: 0.42    │  |       0    100   200   500      |
| │Config 2: α=0.3   │  |                                 |
| │  Return: 0.58    │  |  [Download Data] [Save Config]  |
| └──────────────────┘  |                                 |
+-----------------------+----------------------------------+
```

### Components

**1. Control Panel (Left)**

**Environment Selector**
- Dropdown: FrozenLake-v1 (4x4), FrozenLake-v1 (8x8), CliffWalking, GridWorld
- Environment renders in visualization area

**Algorithm Selector**
- Dropdown: SARSA, Q-Learning, Expected SARSA, Monte Carlo
- Algorithm-specific parameters appear dynamically

**Hyperparameter Sliders**
- Learning rate (α): 0.01 to 0.5
- Discount factor (γ): 0.9 to 1.0
- Epsilon (ε): 0.0 to 1.0 (for epsilon-greedy)
- Episodes: 100 to 2000
- Real-time value display next to slider

**Simulation Controls**
- "Run Simulation" button (primary action)
- "Reset" button (clears current run)
- "Add to Comparison" (saves current config to comparison panel)

**Comparison Panel**
- Shows up to 3 saved configurations
- Each shows: algorithm, key params, final performance
- Click to highlight in metrics area
- "Clear All" button

**2. Visualization Area (Center Top)**

**Environment Display**
- Grid-based environments rendered visually
- Agent position shown with emoji/icon
- Current state highlighted
- Goal/holes/obstacles marked
- Real-time updates as agent moves

**Playback Controls**
- Play/Pause button
- Step forward (single step)
- Speed slider (1x to 10x)
- Episode counter
- Current reward display

**3. Metrics Area (Center Bottom)**

**Tabs: Learning Curve / Q-Values / Policy / Comparison**

**Learning Curve Tab**
- Line chart: Average return over episodes
- Smoothed with moving average
- X-axis: Episodes, Y-axis: Return
- Multiple lines if comparing configs

**Q-Values Tab**
- Heatmap showing Q-values for each state-action pair
- Color intensity = value magnitude
- Can select specific episode to view
- Scrubber to see evolution over training

**Policy Tab**
- Visual representation of learned policy
- Arrows showing best action per state
- Grid overlay with action directions
- Value function heatmap overlay (optional)

**Comparison Tab** (when multiple configs saved)
- Side-by-side or overlay comparison
- All configs on same chart
- Legend with config details
- Statistical comparison (convergence speed, final performance)

**4. Export/Save**
- Download learning data (CSV)
- Save configuration (JSON)
- Share link (encodes parameters in URL)
- "Copy to Exercise" button (transfers setup to coding exercise)

### Interactions
1. **Adjust parameters** → Sliders update in real-time
2. **Click "Run Simulation"** → 
   - Starts training
   - Visualization animates agent
   - Metrics update live
   - Can pause/resume
3. **Click "Add to Comparison"** →
   - Current config saved
   - Appears in comparison panel
   - Metrics show overlay
4. **Select environment** → Visualization updates to show new env
5. **Hover over states** → Tooltip shows Q-values for that state

### Preset Scenarios (Optional)
- "Cautious Learner" (low ε, low α)
- "Bold Explorer" (high ε, high α)
- "Quick Adapter" (high α, decay ε)
- "Patient Optimizer" (many episodes, low α)
- Helps users understand hyperparameter effects

### State Requirements
- Current parameter values
- Simulation state (running/paused/completed)
- Comparison configs (up to 3)
- Learning data (for plotting)
- Current episode/step

---

## 7. Week Checkpoint Screen

### Purpose
Comprehensive assessment and review before advancing to next week.

### Layout
```
+----------------------------------------------------------+
|  Week 2 Checkpoint: Tabular Methods Mastery             |
+----------------------------------------------------------+
|                                                          |
|  You've completed all lessons in Week 2! 🎉             |
|  Let's verify you're ready for Week 3.                  |
|                                                          |
|  Your Week 2 Progress                                   |
|  ┌──────────────────────────────────────┐               |
|  │ ✓ 4/4 Theory Lessons                 │               |
|  │ ✓ 4/4 Quizzes (avg: 88%)             │               |
|  │ ✓ 3/3 Coding Exercises               │               |
|  │ ✓ 1/1 Playground Exploration         │               |
|  │ ⊙ 0/1 Checkpoint Quiz                │               |
|  └──────────────────────────────────────┘               |
|                                                          |
|  Key Concepts This Week                                 |
|  • Monte Carlo methods for episodic tasks               |
|  • Temporal Difference learning (TD)                    |
|  • SARSA (on-policy TD control)                         |
|  • Q-learning (off-policy TD control)                   |
|  • Exploration vs exploitation strategies               |
|                                                          |
|  Checkpoint Quiz                                        |
|  Take this 15-question quiz to test your mastery        |
|  of Week 2 concepts. You need 70% to unlock Week 3.     |
|                                                          |
|  [Start Checkpoint Quiz]                                |
|                                                          |
|  Not ready yet?                                         |
|  [Review Week 2 Lessons]                                |
|                                                          |
+----------------------------------------------------------+
```

### After Quiz - Pass Scenario
```
+----------------------------------------------------------+
|  Checkpoint Complete! ✅                                 |
+----------------------------------------------------------+
|                                                          |
|  Excellent work! You scored 13/15 (87%)                 |
|                                                          |
|  ┌──────────────────────────────────────────────────┐   |
|  │ Strong Areas:                                    │   |
|  │ ✓ Monte Carlo methods                            │   |
|  │ ✓ TD learning basics                             │   |
|  │ ✓ SARSA implementation                           │   |
|  │                                                  │   |
|  │ Topics to Review (optional):                     │   |
|  │ • Convergence guarantees                         │   |
|  │ • Temporal difference error                      │   |
|  └──────────────────────────────────────────────────┘   |
|                                                          |
|  🎯 Achievement Unlocked: Tabular Methods Master        |
|                                                          |
|  You're ready for Week 3: Function Approximation!       |
|                                                          |
|  [Proceed to Week 3 →]                                  |
|  [Review Missed Topics]                                 |
|                                                          |
+----------------------------------------------------------+
```

### After Quiz - Needs Review
```
+----------------------------------------------------------+
|  Almost There! 📚                                        |
+----------------------------------------------------------+
|                                                          |
|  You scored 9/15 (60%)                                  |
|  You need 70% to proceed to Week 3.                     |
|                                                          |
|  ┌──────────────────────────────────────────────────┐   |
|  │ Topics to Review:                                │   |
|  │ • SARSA vs Q-learning differences                │   |
|  │ • TD error and update rules                      │   |
|  │ • Exploration strategies                         │   |
|  └──────────────────────────────────────────────────┘   |
|                                                          |
|  Recommended Actions:                                   |
|  1. Review Lesson 3: SARSA Algorithm                    |
|  2. Review Lesson 4: Q-Learning vs SARSA                |
|  3. Re-attempt coding exercises with different params   |
|  4. Revisit the Playground to build intuition           |
|                                                          |
|  [Review Recommended Lessons]                           |
|  [Retake Checkpoint Quiz]                               |
|                                                          |
+----------------------------------------------------------+
```

### Components
1. **Progress Summary**
   - Checklist of all week components
   - Completion percentages
   - Time spent this week

2. **Key Concepts Recap**
   - Bulleted list of main topics covered
   - Quick reference for what you should know

3. **Checkpoint Quiz**
   - 10-15 comprehensive questions
   - Covers all week topics
   - Pass threshold: 70%
   - Can retake if needed

4. **Results Screen**
   - Score and pass/fail status
   - Breakdown by topic area
   - Strengths and weaknesses identified
   - Recommendations for review

5. **Unlock Mechanism**
   - Pass checkpoint → Week 3 unlocked + achievement badge
   - Fail checkpoint → Recommendations + retake option
   - Can review lessons without retaking quiz

### User Actions
- Start checkpoint quiz
- Review lessons (if not ready)
- Retake quiz (if failed)
- Proceed to next week (if passed)
- Download week summary (PDF/Markdown)

---

## 8. Reference / Cheatsheet Screen

### Purpose
Quick lookup for formulas, algorithms, and common patterns.

### Layout
```
+----------------------------------------------------------+
|  RL Reference & Cheatsheet                    [Search🔍] |
+----------------------------------------------------------+
| CATEGORIES              |  CONTENT                       |
|                         |                                |
| Foundations             |  # Bellman Equation            |
| • Bellman Equations     |                                |
| • Value Functions       |  The Bellman equation expresses|
| • Policies              |  the recursive relationship... |
|                         |                                |
| Algorithms              |  V(s) = Σₐ π(a|s) Σₛ',ᵣ p(...)|
| ▸ Tabular Methods       |                                |
|   • Monte Carlo         |  [Copy Equation] [View Lesson] |
|   • TD Learning         |                                |
|   • SARSA               |  ## Implementation             |
|   • Q-Learning          |  ```python                     |
| ▸ Function Approx       |  def bellman_update(V, s, ...  |
| ▸ Policy Gradients      |  ```                           |
|                         |  [Copy Code]                   |
| Code Templates          |                                |
| • Q-Table Init          |                                |
| • Epsilon-Greedy        |  ## When to Use                |
| • Training Loop         |  - For computing exact value...|
|                         |  - As basis for all RL alg...  |
| Common Patterns         |                                |
| • Reward Shaping        +--------------------------------+
| • Exploration Decay     |                                |
| • Hyperparameter Tips   |                                |
|                         |                                |
| Glossary                |                                |
| • State (S)             |                                |
| • Action (A)            |                                |
| • Reward (R)            |                                |
| • Policy (π)            |                                |
+-------------------------+--------------------------------+
```

### Components
1. **Category Sidebar**
   - Collapsible sections
   - Quick navigation
   - Current selection highlighted

2. **Search Bar**
   - Full-text search across all content
   - Filters: All / Formulas / Code / Concepts
   - Recent searches

3. **Content Display**
   - Rendered markdown
   - Syntax-highlighted code
   - LaTeX equations
   - Copy buttons for code/equations
   - "View in Lesson" links back to source

### Content Categories

**Foundations**
- MDP definition
- Bellman equations (expectation & optimality)
- Value functions (V, Q)
- Policy types
- Discount factor intuition

**Algorithms Comparison Table**
| Algorithm | On/Off-Policy | Update Rule | Best For |
|-----------|---------------|-------------|----------|
| Monte Carlo | On | Full episode | Episodic tasks |
| SARSA | On | TD(0) | Safe learning |
| Q-Learning | Off | TD(0) | Optimal policy |
| ... | | | |

**Code Templates**
- Q-table initialization
- Epsilon-greedy selection
- Standard training loop
- Plotting learning curves
- Environment wrappers

**Common Debugging Tips**
- Agent not learning → Check learning rate, exploration
- Divergence → Reduce LR, check reward scale
- Slow convergence → Increase episodes, tune hyperparams

**Glossary**
- Alphabetical list of RL terms
- Short definitions with examples
- Links to detailed explanations

### User Actions
- Search for terms
- Navigate categories
- Copy code/equations
- Click "View in Lesson" to review
- Bookmark frequently referenced items

---

## 9. Settings / Profile Screen

### Layout
```
+----------------------------------------------------------+
|  Settings                                                |
+----------------------------------------------------------+
|                                                          |
|  Profile                                                |
|  ┌──────────────────────────────────────────────────┐   |
|  │ Name: Ankit                               [Edit] │   |
|  │ Email: ankit@example.com                  [Edit] │   |
|  │ Started: Dec 1, 2024                             │   |
|  │ Total Learning Time: 23.5 hours                  │   |
|  └──────────────────────────────────────────────────┘   |
|                                                          |
|  Learning Preferences                                   |
|  ┌──────────────────────────────────────────────────┐   |
|  │ Code Editor Theme                                │   |
|  │ [Dark ▼]                                         │   |
|  │                                                  │   |
|  │ Font Size                                        │   |
|  │ [14px ▼]                                         │   |
|  │                                                  │   |
|  │ Auto-Save Code                                   │   |
|  │ [✓] Every 30 seconds                             │   |
|  │                                                  │   |
|  │ Show Hints by Default                            │   |
|  │ [ ] Always visible (not recommended)             │   |
|  │                                                  │   |
|  │ Keyboard Shortcuts                               │   |
|  │ [✓] Enable (Cmd+Enter to run, etc.)              │   |
|  └──────────────────────────────────────────────────┘   |
|                                                          |
|  Goals & Notifications                                  |
|  ┌──────────────────────────────────────────────────┐   |
|  │ Weekly Learning Goal                             │   |
|  │ [10 hours ▼]                                     │   |
|  │                                                  │   |
|  │ Target Completion Date                           │   |
|  │ [March 15, 2025]      (16 weeks from start)      │   |
|  │                                                  │   |
|  │ Email Reminders                                  │   |
|  │ [✓] Daily reminder (9:00 AM)                     │   |
|  │ [✓] Weekly summary (Sundays)                     │   |
|  │ [ ] Inactivity nudge (after 3 days)              │   |
|  └──────────────────────────────────────────────────┘   |
|                                                          |
|  Data & Privacy                                         |
|  ┌──────────────────────────────────────────────────┐   |
|  │ [Export My Data]                                 │   |
|  │ Download all your code, progress, and quiz       │   |
|  │ results as a ZIP file.                           │   |
|  │                                                  │   |
|  │ [Reset Progress]                                 │   |
|  │ Clear all progress and start fresh.              │   |
|  │ ⚠️ This cannot be undone.                        │   |
|  │                                                  │   |
|  │ [Delete Account]                                 │   |
|  │ Permanently delete your account and all data.    │   |
|  └──────────────────────────────────────────────────┘   |
|                                                          |
+----------------------------------------------------------+
```

---

## Critical User Flows

### Flow 1: First-Time User Onboarding

**Steps:**
1. User lands on app → No auth required for MVP (local storage)
2. Welcome modal appears:
   - "Welcome to RL Mastery! 👋"
   - "This 16-week curriculum will teach you reinforcement learning through hands-on coding."
   - "Ready to start?"
   - [Get Started] button

3. Brief tour (optional skip):
   - Highlight: "This is your dashboard"
   - Highlight: "Each week has theory, quizzes, and coding"
   - Highlight: "Write and run code directly in browser"
   - [Skip Tour] / [Next →]

4. Redirect to Week 1, Lesson 1 (RL Foundations intro)

5. User reads theory → Takes first quiz → Completes first exercise

6. Success celebration:
   - "🎉 You completed your first exercise!"
   - "You learned: Multi-armed bandits"
   - [Continue to Next Lesson]

7. User navigates freely from here

**Key Success Metrics:**
- % who complete first exercise
- Time to first exercise completion
- Drop-off points in onboarding

---

### Flow 2: Daily Learning Session

**Steps:**
1. User returns to app → Dashboard loads
2. Shows: "Welcome back! Resume Week 2, Lesson 3"
3. Click [Continue Learning] → Jumps to Lesson 3 coding exercise
4. User's previous code already loaded (auto-saved)
5. User continues working, runs code, debugs
6. Tests pass → Confetti animation 🎉
7. [Mark as Complete] → Exercise marked done
8. [Next Lesson] → Loads Lesson 4 theory
9. User reads theory, realizes it's getting late
10. Closes browser → Progress auto-saved
11. Returns next day → Right where they left off

**Auto-save Points:**
- Code editor: every 30 seconds
- Reading position: on scroll stop
- Quiz answers: on selection
- All data in localStorage (Phase 1) or DB (Phase 2)

---

### Flow 3: Struggling with Concept

**Scenario:** User stuck on Q-learning exercise

**Steps:**
1. User writes code, clicks [Run Tests]
2. Tests fail: "Expected: Agent reaches goal 80% of time. Got: 20%"
3. User reads error, tries tweaking learning rate
4. Still failing after 3 attempts
5. Click [Show Hint 1]:
   - "Check your exploration rate. Are you exploring enough to find the goal?"
6. User adjusts epsilon, runs again
7. Still failing
8. Click [Show Hint 2]:
   - "Your Q-value update might not be using the max of the next state. Remember Q-learning is off-policy."
9. User reviews SARSA vs Q-learning lesson (link in hint)
10. "Aha!" moment → Fixes code
11. Tests pass → Relief and satisfaction
12. Proceeds to next lesson with confidence

**Support Mechanisms:**
- Progressive hints (don't give away answer)
- Links back to relevant theory
- Show solution after 30 minutes or 5 attempts (whichever first)
- "Was this helpful?" feedback on hints

---

### Flow 4: Building Intuition in Playground

**Steps:**
1. User finishes SARSA coding exercise
2. Sees "Explore SARSA Playground" button
3. Clicks → Playground loads with SARSA on FrozenLake
4. Default parameters shown, clicks [Run Simulation]
5. Watches agent learn, sees learning curve
6. Notices agent converges around episode 300
7. Adjusts epsilon from 0.1 to 0.5 → [Run Simulation]
8. Agent explores more, converges faster! (episode 200)
9. Clicks [Add to Comparison] → Config saved
10. Tries epsilon = 0.01 (very low exploration)
11. Agent barely explores, never finds goal
12. Comparison shows all 3 configs side-by-side
13. "Aha! Exploration really matters"
14. Downloads learning data for future reference
15. Proceeds to next lesson with deeper understanding

**Learning Amplifiers:**
- Visual feedback (see agent move)
- Immediate results (no waiting)
- Easy experimentation (sliders)
- Comparison enables insight
- No penalty for "failing" (it's exploration!)

---

### Flow 5: Week Completion & Checkpoint

**Steps:**
1. User completes last lesson of Week 2
2. Dashboard shows: "Week 2 Complete! Take checkpoint quiz"
3. Click [Take Checkpoint] → Checkpoint screen loads
4. Reviews key concepts, feels ready
5. Click [Start Checkpoint Quiz]
6. Answers 15 questions, scores 13/15 (87%)
7. Results screen:
   - "Excellent! You're ready for Week 3"
   - Shows strengths and minor weaknesses
   - Achievement badge unlocked
8. Week 3 unlocks on dashboard (was previously locked)
9. Celebration modal: "🎉 Week 2 Complete! 🚀"
10. [Proceed to Week 3] or [Take a Break]
11. User proceeds, sees Week 3 overview
12. Excited about function approximation and neural nets

**Motivation Boosters:**
- Clear pass/fail with encouraging language
- Achievement badges and unlocks
- Visual progress (14 more weeks to go!)
- Option to take break vs continue immediately

---

### Flow 6: Returning After Gap

**Scenario:** User takes 1-week break, returns

**Steps:**
1. User returns to dashboard
2. Message: "Welcome back! It's been 7 days. You left off in Week 3, Lesson 2."
3. Optional: Quick recap of Week 3 so far
4. Click [Resume Learning] → Loads Lesson 2
5. Code editor still has their previous code (saved)
6. Feels familiar, continues where left off
7. Streak broken, but progress intact
8. Completes lesson, momentum rebuilds

**Re-engagement:**
- Auto-save prevents loss of work
- Gentle reminder, not guilt
- Quick recap helps refresh memory
- Progress intact = low friction to continue

---

## Mobile Considerations

### MVP: Desktop-First, Mobile-Friendly Reading

**What works on mobile:**
- ✅ Theory lessons (scrollable text)
- ✅ Quizzes (tap to select, submit)
- ✅ Dashboard & navigation
- ✅ Progress tracking
- ✅ Reference/cheatsheet

**What's challenging on mobile:**
- ❌ Code editor (typing on phone keyboard)
- ❌ Playground (complex interactions)
- ⚠️ Visualizations (render but may be cramped)

### Recommended Approach
- **Phase 1 (MVP)**: Optimize for desktop/laptop, make theory/quizzes responsive for mobile reading
- **Phase 2**: Consider tablet-friendly code editor (larger screen, external keyboard)
- **Future**: Mobile app for theory/quizzes, require desktop for coding

### Responsive Breakpoints
- **Desktop** (≥1024px): Full side-by-side layout
- **Tablet** (768-1023px): Stacked layout, code editor still usable
- **Mobile** (≤767px): Reading mode only, suggest desktop for coding

---

## State Management & Data Persistence

### What Data Needs to Persist?

**User Profile**
- Name, email (if auth added)
- Start date
- Total learning time
- Preferences (editor theme, font size, etc.)

**Progress Data**
- Lessons completed (boolean per lesson)
- Quizzes attempted (scores, timestamps)
- Exercises completed (boolean, attempts count)
- Checkpoints passed (scores)
- Current location (week, lesson)
- Streak data (days active)

**User-Generated Content**
- Code for each exercise (current + historical snapshots)
- Quiz answers (for review)
- Playground configs saved
- Bookmarks / notes (future feature)

**Analytics/Metadata**
- Time spent per lesson
- Hints used count
- Solution views count
- Retake counts

### Storage Strategy

**Phase 1 (MVP): LocalStorage**
- Pros: Simple, no backend needed, works offline
- Cons: Limited to 5-10MB, not synced across devices
- Use for: All user data, code, progress
- Structure: JSON objects keyed by lesson ID

**Phase 2: Database (PostgreSQL)**
- User account table
- Progress table (user_id, lesson_id, status, score, timestamp)
- Code submissions table (user_id, exercise_id, code, timestamp)
- Sync to cloud, accessible across devices

**Hybrid Approach:**
- LocalStorage for immediate auto-save
- Periodic sync to backend (every 5 minutes if online)
- "Save to cloud" button for manual sync

---

## Technical Implementation Notes

### Code Execution Architecture

**Option 1: Pyodide (Browser-based)**
```
User writes code in Monaco Editor
  ↓
Code sent to Web Worker (Pyodide)
  ↓
Pyodide executes Python in WebAssembly
  ↓
stdout, plots, errors returned to main thread
  ↓
Displayed in Output Panel
```

**Pros:**
- No server needed
- Instant execution
- Works offline
- Sandboxed (secure)

**Cons:**
- Slower than native Python
- Package limitations (no PyTorch initially)
- 5-10s initial load time
- Memory constraints

**Good for:** Weeks 1-4 (numpy, basic RL)

**Option 2: Server Execution (Backend API)**
```
User writes code in Monaco Editor
  ↓
Code sent to FastAPI backend
  ↓
Backend spins up Docker container
  ↓
Executes code in isolated environment
  ↓
Returns stdout, plots (base64), errors
  ↓
Frontend displays results
```

**Pros:**
- Full package support (PyTorch, etc.)
- Faster execution
- GPU access possible

**Cons:**
- Server costs
- Security complexity (code injection)
- Latency (network round-trip)
- Requires backend

**Good for:** Weeks 5+ (neural networks)

### Recommended Hybrid
- Weeks 1-4: Pyodide
- Weeks 5+: Server execution
- User doesn't notice the switch (same UI)

---

## Content Structure

### Curriculum Data Format (JSON)

```json
{
  "weeks": [
    {
      "id": "week-1",
      "number": 1,
      "title": "RL Foundations",
      "description": "...",
      "estimatedHours": 8,
      "lessons": [
        {
          "id": "week-1-lesson-1",
          "type": "theory",
          "title": "Introduction to RL",
          "content": "path/to/markdown/file.md",
          "estimatedMinutes": 30
        },
        {
          "id": "week-1-quiz-1",
          "type": "quiz",
          "title": "RL Basics Quiz",
          "questions": [
            {
              "id": "q1",
              "type": "multiple-choice",
              "question": "What is a policy?",
              "options": ["...", "...", "..."],
              "correctAnswer": 1,
              "explanation": "...",
              "hints": ["...", "..."]
            }
          ]
        },
        {
          "id": "week-1-exercise-1",
          "type": "exercise",
          "title": "Implement Multi-Armed Bandit",
          "instructions": "path/to/instructions.md",
          "starterCode": "path/to/starter.py",
          "solution": "path/to/solution.py",
          "testCases": "path/to/tests.py",
          "hints": ["...", "..."]
        },
        {
          "id": "week-1-playground",
          "type": "playground",
          "title": "Bandit Playground",
          "environment": "multi_armed_bandit",
          "algorithms": ["epsilon-greedy", "ucb", "thompson"],
          "defaultParams": {...}
        }
      ]
    }
  ],
  "checkpoints": [
    {
      "id": "checkpoint-week-1",
      "weekId": "week-1",
      "questions": [...],
      "passThreshold": 0.7
    }
  ]
}
```

### File Organization
```
/curriculum-content/
  /week-01/
    /lessons/
      lesson-1-intro.md
      lesson-2-mdp.md
    /exercises/
      exercise-1-bandit/
        instructions.md
        starter.py
        solution.py
        tests.py
    /assets/
      bellman-diagram.png
  /week-02/
    ...
  curriculum.json (master index)
```

---

## Success Metrics & Analytics

### User Engagement
- Daily active users
- Average session duration
- Lessons completed per week
- Completion rate (% who finish Week 1, Week 2, etc.)
- Drop-off points (where users stop)

### Learning Effectiveness
- Quiz scores by topic
- Exercise completion rate
- Time to complete exercises
- Hints used frequency
- Solution views frequency
- Checkpoint pass rates

### Feature Usage
- Code runs per exercise (iteration count)
- Playground usage rate
- Comparison feature usage
- Reference section visits

### Quality Indicators
- User feedback (thumbs up/down)
- Bug reports
- Feature requests
- Time spent debugging (high = bad UX)

---

## Future Enhancements (Post-MVP)

### Phase 2 Features
- User accounts & authentication
- Cloud sync across devices
- Social features (leaderboards, share progress)
- Discussion forums per lesson
- Peer code review

### Phase 3 Features
- Video explanations embedded in lessons
- AI teaching assistant (chatbot for questions)
- Custom learning paths (skip/focus topics)
- Certificate generation
- Project showcase gallery

### Advanced Features
- Live coding challenges (timed)
- Collaborative coding (pair programming)
- Code quality analysis
- Performance profiling for RL code
- Integration with Jupyter notebooks (export)

---

## Open Questions

1. **Authentication:** Start without it (localStorage) or require from day 1?
   - **Recommendation:** No auth for MVP, add in Phase 2

2. **Content licensing:** What license for curriculum content?
   - **Recommendation:** MIT or CC BY-SA for open sharing

3. **Monetization:** Free forever or freemium model?
   - **Recommendation:** Free for Weeks 1-4, paid for 5-16? Or fully free, optional "Pro" features?

4. **Community:** Built-in forums or link to Discord/Reddit?
   - **Recommendation:** Start with external community, build-in later

5. **Code sandboxing:** How strict? Allow file I/O, network calls?
   - **Recommendation:** Weeks 1-4 no restrictions (Pyodide), 5+ strict sandbox

---

## MVP Scope Definition

### Must-Have (Phase 1 - 3 weeks)
✅ Dashboard with progress tracking
✅ Theory lessons (markdown rendering)
✅ Quizzes with instant feedback
✅ Coding exercises with Pyodide execution
✅ Output display (console + plots)
✅ Test cases with pass/fail
✅ LocalStorage for progress
✅ Weeks 1-4 content (tabular methods)
✅ Basic responsive design

### Nice-to-Have (Phase 1.5)
✅ Playground for Week 1-2
✅ Hints system
✅ Solutions (time-locked)
✅ Reference/cheatsheet
✅ Checkpoint quizzes

### Phase 2 (Weeks 4-8)
- User authentication
- Backend API (FastAPI)
- Database persistence
- Server-side code execution
- Weeks 5-16 content
- Advanced visualizations

---

## Conclusion

This webapp is absolutely feasible and would be an excellent portfolio project. The MVP can be built in 2-3 weeks focusing on Weeks 1-4 of the curriculum with browser-based code execution.

**Key Success Factors:**
1. Start small (MVP = Weeks 1-4)
2. Use Pyodide to avoid backend complexity initially
3. Focus on core learning loop (read → quiz → code → feedback)
4. Excellent UX for code editor and visualizations
5. Clear progress indicators for motivation

**Risks to Mitigate:**
- Scope creep (stick to MVP!)
- Code execution security (use Pyodide first)
- Content creation time (curriculum writing takes longer than coding)
- Browser compatibility (test on multiple browsers)

**Next Steps:**
1. Validate tech stack (build tiny Pyodide + Monaco POC)
2. Design database schema (even if using localStorage first)
3. Create 1-2 lessons of content to test structure
4. Build coding exercise template/framework
5. Iterate on UX with real lessons

Would you like to dive deeper into any specific aspect (tech stack validation, content structure, specific screen design)?
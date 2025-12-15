"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, Settings, Zap, CheckCircle, TrendingUp, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaygroundComponentProps {
  config?: any; // This would be more specific based on your playground types
  onComplete: () => void;
  isCompleted: boolean;
}

export default function PlaygroundComponent({
  config,
  onComplete,
  isCompleted
}: PlaygroundComponentProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [episode, setEpisode] = useState(0);
  const [reward, setReward] = useState(0);
  const [totalReward, setTotalReward] = useState(0);

  // Playground parameters
  const [learningRate, setLearningRate] = useState(0.1);
  const [epsilon, setEpsilon] = useState(0.1);
  const [discount, setDiscount] = useState(0.9);
  const [episodes, setEpisodes] = useState(100);
  const [renderSpeed, setRenderSpeed] = useState(100);
  const [showVisualization, setShowVisualization] = useState(true);

  // Mock simulation data
  const [simulationData, setSimulationData] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && episode < episodes) {
      interval = setInterval(() => {
        setEpisode(prev => {
          const next = prev + 1;
          if (next >= episodes) {
            setIsRunning(false);
            return prev;
          }
          return next;
        });

        // Simulate reward improvement over time
        const baseReward = Math.random() * 10;
        const improvement = (episode / episodes) * 20;
        const episodeReward = baseReward + improvement + (Math.random() - 0.5) * 5;

        setReward(Math.round(episodeReward * 10) / 10);
        setTotalReward(prev => prev + episodeReward);
        setSimulationData(prev => [...prev.slice(-49), episodeReward]);
      }, 1000 / (renderSpeed / 10));
    }

    return () => clearInterval(interval);
  }, [isRunning, episode, episodes, renderSpeed]);

  const handleStart = () => {
    setIsRunning(true);
    setHasInteracted(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setEpisode(0);
    setReward(0);
    setTotalReward(0);
    setSimulationData([]);
  };

  const handleCompleteExperiment = () => {
    if (hasInteracted) {
      onComplete();
    }
  };

  // Simple line chart visualization
  const maxReward = Math.max(...simulationData, 1);
  const chartHeight = 100;

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Interactive Playground
          </CardTitle>
          <CardDescription>
            Experiment with RL parameters and observe how they affect learning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This playground simulates a reinforcement learning agent. Adjust the parameters
            below and watch how the agent&apos;s performance changes over time. Try different
            combinations to understand their effects on learning.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Control Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Learning Rate */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="learning-rate">Learning Rate (α)</Label>
                <span className="text-sm text-muted-foreground">{learningRate}</span>
              </div>
              <Slider
                id="learning-rate"
                min={0.01}
                max={1}
                step={0.01}
                value={[learningRate]}
                onValueChange={([value]) => setLearningRate(value)}
                disabled={isRunning}
              />
            </div>

            {/* Epsilon (Exploration) */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="epsilon">Exploration (ε)</Label>
                <span className="text-sm text-muted-foreground">{epsilon}</span>
              </div>
              <Slider
                id="epsilon"
                min={0}
                max={1}
                step={0.01}
                value={[epsilon]}
                onValueChange={([value]) => setEpsilon(value)}
                disabled={isRunning}
              />
            </div>

            {/* Discount Factor */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="discount">Discount Factor (γ)</Label>
                <span className="text-sm text-muted-foreground">{discount}</span>
              </div>
              <Slider
                id="discount"
                min={0}
                max={1}
                step={0.01}
                value={[discount]}
                onValueChange={([value]) => setDiscount(value)}
                disabled={isRunning}
              />
            </div>

            {/* Episodes */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="episodes">Total Episodes</Label>
                <span className="text-sm text-muted-foreground">{episodes}</span>
              </div>
              <Slider
                id="episodes"
                min={10}
                max={500}
                step={10}
                value={[episodes]}
                onValueChange={([value]) => setEpisodes(value)}
                disabled={isRunning}
              />
            </div>

            {/* Speed */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="speed">Simulation Speed</Label>
                <span className="text-sm text-muted-foreground">{renderSpeed}%</span>
              </div>
              <Slider
                id="speed"
                min={10}
                max={200}
                step={10}
                value={[renderSpeed]}
                onValueChange={([value]) => setRenderSpeed(value)}
              />
            </div>

            {/* Visualization Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="visualization">Show Visualization</Label>
              <Switch
                id="visualization"
                checked={showVisualization}
                onCheckedChange={setShowVisualization}
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            {!isRunning ? (
              <>
                <Button onClick={handleStart} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
                <Button onClick={handleReset} variant="outline" disabled={episode === 0}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </>
            ) : (
              <Button onClick={handlePause} variant="outline" className="flex-1">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Visualization Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Episode</p>
                <p className="text-2xl font-bold">{episode}/{episodes}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Reward</p>
                <p className="text-2xl font-bold">{reward.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average</p>
                <p className="text-2xl font-bold">
                  {episode > 0 ? (totalReward / episode).toFixed(1) : "0.0"}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round((episode / episodes) * 100)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(episode / episodes) * 100}%` }}
                />
              </div>
            </div>

            {/* Chart */}
            {showVisualization && simulationData.length > 0 && (
              <div className="space-y-2">
                <Label>Reward Over Time</Label>
                <div className="relative h-32 bg-muted/20 rounded-lg p-2">
                  <svg className="w-full h-full">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(y => (
                      <line
                        key={y}
                        x1="0"
                        y1={`${y}%`}
                        x2="100%"
                        y2={`${y}%`}
                        stroke="currentColor"
                        strokeOpacity="0.1"
                      />
                    ))}

                    {/* Data line */}
                    <polyline
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      points={simulationData
                        .map((value, i) => {
                          const x = (i / (simulationData.length - 1)) * 100;
                          const y = 100 - (value / maxReward) * 90;
                          return `${x},${y}`;
                        })
                        .join(" ")}
                    />

                    {/* Data points */}
                    {simulationData.slice(-10).map((value, i) => {
                      const actualIndex = simulationData.length - 10 + i;
                      const x = (actualIndex / (simulationData.length - 1)) * 100;
                      const y = 100 - (value / maxReward) * 90;
                      return (
                        <circle
                          key={i}
                          cx={`${x}%`}
                          cy={`${y}%`}
                          r="2"
                          fill="hsl(var(--primary))"
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      {episode > episodes * 0.5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Learning Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {learningRate > 0.5 && (
                <Alert>
                  <AlertDescription>
                    High learning rate ({learningRate}) makes the agent learn quickly but may cause instability.
                  </AlertDescription>
                </Alert>
              )}
              {epsilon < 0.05 && (
                <Alert>
                  <AlertDescription>
                    Low exploration ({epsilon}) means the agent mostly exploits known strategies.
                  </AlertDescription>
                </Alert>
              )}
              {discount < 0.5 && (
                <Alert>
                  <AlertDescription>
                    Low discount factor ({discount}) makes the agent prioritize immediate rewards.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion */}
      {hasInteracted && episode >= episodes && (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Experiment Complete!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Great job experimenting with the RL parameters! You achieved an average reward of{" "}
              <span className="font-bold">{(totalReward / episodes).toFixed(2)}</span> over {episodes} episodes.
            </p>
          </CardContent>
          {!isCompleted && (
            <CardFooter>
              <Button onClick={handleCompleteExperiment} className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Complete & Continue
              </Button>
            </CardFooter>
          )}
        </Card>
      )}

      {/* Already Completed */}
      {isCompleted && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Playground Completed!</AlertTitle>
          <AlertDescription>
            You&apos;ve completed this playground session. Feel free to continue experimenting or move on to the next lesson.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
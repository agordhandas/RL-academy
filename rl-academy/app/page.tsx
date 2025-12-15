"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useProgress } from "@/hooks/use-progress";
import { enhancedCurriculum as curriculum } from "@/data/curriculum-enhanced";
import {
  ArrowRight,
  CheckCircle,
  Circle,
  Clock,
  Trophy,
  TrendingUp,
  BookOpen,
  Code,
  Target,
  Zap,
  Award
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { progress, overallProgress } = useProgress();
  const [greeting, setGreeting] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  if (!mounted) return null;

  const currentModule = curriculum.modules.find(m => m.id === progress.currentModule) || curriculum.modules[0];
  const currentLesson = currentModule?.lessons.find(l => l.id === progress.currentLesson);

  const completedModules = curriculum.modules.filter(module =>
    module.lessons.every(lesson => progress.completedLessons.has(lesson.id))
  ).length;

  const totalLessons = curriculum.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const completedLessons = progress.completedLessons.size;

  const stats = [
    {
      label: "Total Progress",
      value: `${overallProgress}%`,
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      label: "Completed Lessons",
      value: `${completedLessons}/${totalLessons}`,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      label: "Learning Time",
      value: `${Math.round(progress.totalLearningTime / 60)}h`,
      icon: Clock,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
    {
      label: "Achievements",
      value: "0",
      icon: Trophy,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-950",
    },
  ];

  return (
    <div className="container py-8 space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-none shadow-lg bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              {greeting}! Welcome to RL Academy
            </CardTitle>
            <CardDescription className="text-lg">
              {currentLesson ? (
                <>You&apos;re currently on <span className="font-semibold">{currentModule.title}</span>, {currentLesson.title}</>
              ) : (
                <>Ready to start your reinforcement learning journey?</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/curriculum/${progress.currentModule}/${progress.currentLesson}`}>
              <Button size="lg" className="group">
                Continue Learning
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Current Module Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Module</CardTitle>
                <CardDescription>
                  {currentModule.title} - {currentModule.description}
                </CardDescription>
              </div>
              <Badge variant="secondary">
                Module {currentModule.number}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Module Progress</span>
                <span className="font-semibold">
                  {currentModule.lessons.filter(l => progress.completedLessons.has(l.id)).length}/{currentModule.lessons.length} Lessons
                </span>
              </div>
              <Progress
                value={
                  (currentModule.lessons.filter(l => progress.completedLessons.has(l.id)).length /
                  currentModule.lessons.length) * 100
                }
                className="h-2"
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">This Module&apos;s Lessons</h4>
              <div className="grid gap-2">
                {currentModule.lessons.slice(0, 4).map((lesson) => {
                  const isCompleted = progress.completedLessons.has(lesson.id);
                  const isCurrent = lesson.id === progress.currentLesson;

                  return (
                    <Link
                      key={lesson.id}
                      href={`/curriculum/${currentModule.id}/${lesson.id}`}
                    >
                      <div className={`
                        flex items-center space-x-3 p-3 rounded-lg border transition-colors
                        ${isCurrent ? 'bg-primary/5 border-primary' : 'hover:bg-accent'}
                        ${isCompleted ? 'opacity-75' : ''}
                      `}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : isCurrent ? (
                          <Circle className="h-5 w-5 text-primary animate-pulse" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{lesson.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {lesson.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {lesson.estimatedMinutes} min
                            </span>
                          </div>
                        </div>
                        {isCurrent && (
                          <Badge>Current</Badge>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
              {currentModule.lessons.length > 4 && (
                <Link href={`/curriculum/${currentModule.id}`}>
                  <Button variant="outline" className="w-full">
                    View All Lessons
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Curriculum Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Curriculum Overview</CardTitle>
            <CardDescription>
              Your complete learning path - {completedModules}/{curriculum.modules.length} modules completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {curriculum.modules.map((module) => {
                const moduleProgress = (module.lessons.filter(l =>
                  progress.completedLessons.has(l.id)
                ).length / module.lessons.length) * 100;

                const isLocked = module.number > 1 &&
                  !curriculum.modules[module.number - 2].lessons.every(l =>
                    progress.completedLessons.has(l.id)
                  );

                return (
                  <Link
                    key={module.id}
                    href={isLocked ? "#" : `/curriculum/${module.id}`}
                    className={isLocked ? "cursor-not-allowed" : ""}
                  >
                    <div className={`
                      p-4 rounded-lg border transition-all
                      ${!isLocked ? 'hover:bg-accent hover:shadow-md' : 'opacity-50'}
                      ${module.id === progress.currentModule ? 'border-primary bg-primary/5' : ''}
                    `}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`
                            p-2 rounded-lg
                            ${moduleProgress === 100 ? 'bg-green-100 dark:bg-green-950' :
                              moduleProgress > 0 ? 'bg-blue-100 dark:bg-blue-950' :
                              'bg-gray-100 dark:bg-gray-800'}
                          `}>
                            {moduleProgress === 100 ? (
                              <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
                            ) : moduleProgress > 0 ? (
                              <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <Target className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              Module {module.number}: {module.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {module.estimatedHours} hours • {module.lessons.length} lessons
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold mb-1">
                            {Math.round(moduleProgress)}%
                          </div>
                          <Progress value={moduleProgress} className="h-2 w-24" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Practice Coding</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Jump into the playground and experiment with RL algorithms
              </p>
              <Link href="/playground">
                <Button className="w-full" variant="outline">
                  Open Playground
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track your progress and unlock achievements
              </p>
              <Link href="/achievements">
                <Button className="w-full" variant="outline">
                  View Achievements
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Quick Review</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Review key concepts and formulas from your lessons
              </p>
              <Link href="/reference">
                <Button className="w-full" variant="outline">
                  Open Reference
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
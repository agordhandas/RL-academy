"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { enhancedCurriculum as curriculum } from "@/data/curriculum-enhanced";
import { useProgress } from "@/hooks/use-progress";
import {
  BookOpen,
  Code,
  CheckCircle,
  Circle,
  Lock,
  Trophy,
  Clock,
  ChevronRight,
  Zap,
  Brain,
  Target,
  Award,
  Filter,
  Search
} from "lucide-react";

export default function CurriculumPage() {
  const { progress } = useProgress();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredModules = curriculum.modules.filter(module =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.lessons.some(lesson =>
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "theory": return BookOpen;
      case "quiz": return Brain;
      case "exercise": return Code;
      case "playground": return Zap;
      case "checkpoint": return Trophy;
      default: return Circle;
    }
  };

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case "theory": return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
      case "quiz": return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300";
      case "exercise": return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
      case "playground": return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300";
      case "checkpoint": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300";
    }
  };

  const isModuleLocked = (moduleNumber: number) => {
    if (moduleNumber === 1) return false;
    const previousModule = curriculum.modules[moduleNumber - 2];
    return !previousModule.lessons.every(lesson =>
      progress.completedLessons.has(lesson.id)
    );
  };

  const getModuleProgress = (moduleId: string) => {
    const module = curriculum.modules.find(m => m.id === moduleId);
    if (!module) return 0;
    const completed = module.lessons.filter(l =>
      progress.completedLessons.has(l.id)
    ).length;
    return (completed / module.lessons.length) * 100;
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Reinforcement Learning Curriculum
          </h1>
          <p className="text-lg text-muted-foreground">
            Master RL through {curriculum.modules.length} comprehensive modules covering everything from basics to advanced topics
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 relative"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search modules and lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </motion.div>
      </div>

      {/* Module Grid */}
      <div className="space-y-6">
        {filteredModules.map((module, index) => {
          const moduleProgress = getModuleProgress(module.id);
          const isLocked = isModuleLocked(module.number);
          const isExpanded = selectedModule === module.id;
          const completedLessons = module.lessons.filter(l =>
            progress.completedLessons.has(l.id)
          ).length;

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`${isLocked ? 'opacity-60' : ''} transition-all hover:shadow-lg`}>
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => setSelectedModule(isExpanded ? null : module.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`
                        p-3 rounded-lg
                        ${moduleProgress === 100 ? 'bg-green-100 dark:bg-green-950' :
                          moduleProgress > 0 ? 'bg-blue-100 dark:bg-blue-950' :
                          'bg-gray-100 dark:bg-gray-800'}
                      `}>
                        {isLocked ? (
                          <Lock className="h-6 w-6 text-gray-500" />
                        ) : moduleProgress === 100 ? (
                          <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                        ) : moduleProgress > 0 ? (
                          <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <BookOpen className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Module {module.number}</Badge>
                          {moduleProgress === 100 && (
                            <Badge className="bg-green-600">Completed</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl mb-2">{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {module.estimatedHours} hours
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {module.lessons.length} lessons
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            {completedLessons}/{module.lessons.length} completed
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold mb-2">
                        {Math.round(moduleProgress)}%
                      </div>
                      <Progress value={moduleProgress} className="w-32 h-2" />
                      <ChevronRight className={`
                        h-5 w-5 mt-3 transition-transform
                        ${isExpanded ? 'rotate-90' : ''}
                      `} />
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent>
                    <div className="space-y-2">
                      {module.lessons.map((lesson) => {
                        const isCompleted = progress.completedLessons.has(lesson.id);
                        const isCurrent = lesson.id === progress.currentLesson;
                        const Icon = getLessonIcon(lesson.type);

                        return (
                          <Link
                            key={lesson.id}
                            href={isLocked ? "#" : `/curriculum/${module.id}/${lesson.id}`}
                            className={isLocked ? "cursor-not-allowed" : ""}
                          >
                            <div className={`
                              flex items-center space-x-3 p-4 rounded-lg border transition-all
                              ${!isLocked && 'hover:bg-accent hover:shadow-md'}
                              ${isCurrent ? 'bg-primary/5 border-primary' : ''}
                              ${isCompleted ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900' : ''}
                            `}>
                              <div className={`p-2 rounded ${getLessonTypeColor(lesson.type)}`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium">{lesson.title}</p>
                                  {isCompleted && (
                                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                  )}
                                  {isCurrent && !isCompleted && (
                                    <Badge variant="default" className="text-xs">Current</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{lesson.description}</p>
                                <div className="flex items-center gap-3 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {lesson.type}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {lesson.estimatedMinutes} min
                                  </span>
                                  {lesson.type === 'quiz' && progress.quizScores.has(lesson.id) && (
                                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                      Score: {progress.quizScores.get(lesson.id)}%
                                    </span>
                                  )}
                                </div>
                              </div>
                              {!isLocked && (
                                <Button
                                  variant={isCompleted ? "outline" : "default"}
                                  size="sm"
                                >
                                  {isCompleted ? "Review" : isCurrent ? "Continue" : "Start"}
                                </Button>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Module Actions */}
                    {!isLocked && (
                      <div className="flex gap-3 mt-6 pt-6 border-t">
                        <Link href={`/curriculum/${module.id}`}>
                          <Button>
                            View Module Details
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                        {module.checkpointQuiz && (
                          <Button variant="outline">
                            Take Checkpoint Quiz
                            <Trophy className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Learning Path Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-12"
      >
        <Card>
          <CardHeader>
            <CardTitle>Learning Path Summary</CardTitle>
            <CardDescription>
              Your overall progress through the curriculum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {curriculum.modules.filter(m =>
                    getModuleProgress(m.id) === 100
                  ).length}/{curriculum.modules.length}
                </div>
                <p className="text-sm text-muted-foreground">Modules Completed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {progress.completedLessons.size}
                </div>
                <p className="text-sm text-muted-foreground">Lessons Completed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(progress.totalLearningTime / 60)}h
                </div>
                <p className="text-sm text-muted-foreground">Total Learning Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { curriculumV2 as curriculum } from "@/data/curriculum-v2";
import { useProgress } from "@/hooks/use-progress";
import TheoryViewer from "@/components/lessons/TheoryViewer";
import QuizComponent from "@/components/lessons/QuizComponent";
import AIQuizComponent from "@/components/lessons/AIQuizComponent";
import ExerciseComponent from "@/components/lessons/ExerciseComponent";
import PlaygroundComponent from "@/components/lessons/PlaygroundComponent";
import TableOfContents from "@/components/lessons/TableOfContents";
import ChatWidget from "@/components/lessons/ChatWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen, Brain, Code, Zap } from "lucide-react";
import Link from "next/link";

interface LessonPageProps {
  params: Promise<{
    moduleId: string;
    lessonId: string;
  }>;
}

export default function LessonPage({ params }: LessonPageProps) {
  const { moduleId, lessonId } = use(params);
  const router = useRouter();
  const { progress, markLessonComplete, updateCurrentPosition } = useProgress();
  const [mounted, setMounted] = useState(false);

  const module = curriculum.modules.find(m => m.id === moduleId);
  const lesson = module?.lessons.find(l => l.id === lessonId);
  const lessonIndex = module?.lessons.findIndex(l => l.id === lessonId) ?? -1;

  const previousLesson = lessonIndex > 0 ? module?.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < (module?.lessons.length ?? 0) - 1
    ? module?.lessons[lessonIndex + 1]
    : null;

  // Find next module if this is the last lesson
  const moduleIndex = curriculum.modules.findIndex(m => m.id === moduleId);
  const nextModule = !nextLesson && moduleIndex < curriculum.modules.length - 1
    ? curriculum.modules[moduleIndex + 1]
    : null;

  useEffect(() => {
    setMounted(true);
    if (module && lesson) {
      updateCurrentPosition(module.id, lesson.id);
    }
  }, [module, lesson, updateCurrentPosition]);

  if (!mounted) return null;

  if (!module || !lesson) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The lesson you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link href="/curriculum">
              <Button>Back to Curriculum</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCompleted = progress.completedLessons.has(lesson.id);

  const handleComplete = () => {
    markLessonComplete(lesson.id);
    if (nextLesson) {
      router.push(`/curriculum/${module.id}/${nextLesson.id}`);
    } else if (nextModule) {
      router.push(`/curriculum/${nextModule.id}`);
    } else {
      router.push('/curriculum');
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "theory": return BookOpen;
      case "quiz": return Brain;
      case "exercise": return Code;
      case "playground": return Zap;
      default: return BookOpen;
    }
  };

  const Icon = getLessonIcon(lesson.type);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link href={`/curriculum/${module.id}`}>
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to {module.title}
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Module {module.number}
            </Badge>
            <Badge variant="outline">
              Lesson {lessonIndex + 1} of {module.lessons.length}
            </Badge>
            {isCompleted && (
              <Badge className="bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{lesson.title}</CardTitle>
                <p className="text-muted-foreground mt-1">{lesson.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Estimated time</p>
                <p className="font-semibold">{lesson.estimatedMinutes} minutes</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Lesson Content with Sidebar */}
      <div className="mb-8 relative">
        <div className={lesson.type === 'theory' ? 'lg:pr-80' : ''}>
          {lesson.type === 'theory' && (
            <TheoryViewer
              content={lesson.content || ''}
              interactiveQuestions={lesson.interactiveQuestions}
              onComplete={handleComplete}
              isCompleted={isCompleted}
            />
          )}
          {lesson.type === 'quiz' && (
            lesson.aiQuestions ? (
              <AIQuizComponent
                questions={lesson.aiQuestions}
                lessonId={lesson.id}
                onComplete={handleComplete}
                isCompleted={isCompleted}
              />
            ) : (
              <QuizComponent
                questions={lesson.questions || []}
                lessonId={lesson.id}
                onComplete={handleComplete}
                isCompleted={isCompleted}
              />
            )
          )}
          {lesson.type === 'exercise' && (
            <ExerciseComponent
              lesson={lesson}
              onComplete={handleComplete}
              isCompleted={isCompleted}
            />
          )}
          {lesson.type === 'playground' && (
            <PlaygroundComponent
              config={lesson.playgroundConfig}
              onComplete={handleComplete}
              isCompleted={isCompleted}
            />
          )}
        </div>
        {/* Floating Sidebar for Theory Lessons */}
        {lesson.type === 'theory' && (
          <TableOfContents content={lesson.content || ''} />
        )}
      </div>

      {/* Navigation Footer */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              {previousLesson ? (
                <Link href={`/curriculum/${module.id}/${previousLesson.id}`}>
                  <Button variant="outline">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous: {previousLesson.title}
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" disabled>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  First Lesson
                </Button>
              )}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Module Progress</p>
              <Progress
                value={(module.lessons.filter(l =>
                  progress.completedLessons.has(l.id)
                ).length / module.lessons.length) * 100}
                className="w-32 h-2"
              />
            </div>

            <div>
              {nextLesson ? (
                <Link href={`/curriculum/${module.id}/${nextLesson.id}`}>
                  <Button>
                    Next: {nextLesson.title}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              ) : nextModule ? (
                <Link href={`/curriculum/${nextModule.id}`}>
                  <Button>
                    Next Module: {nextModule.title}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" disabled>
                  Final Lesson
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Chat Widget */}
      <ChatWidget
        lessonTitle={lesson.title}
        lessonContent={lesson.content}
        moduleTitle={module.title}
      />
    </div>
  );
}
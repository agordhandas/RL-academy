"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Home,
  BookOpen,
  Code,
  Trophy,
  Settings,
  ChevronRight
} from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { overallProgress } = useProgress();

  const navItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/curriculum", icon: BookOpen, label: "Curriculum" },
    { href: "/playground", icon: Code, label: "Playground" },
    { href: "/achievements", icon: Trophy, label: "Achievements" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              RL Academy
            </span>
          </Link>
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-48">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Progress</span>
              <span className="font-semibold text-foreground">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
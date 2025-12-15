"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScrollText, Hash } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from markdown content
    const extractHeadings = () => {
      const headingRegex = /^(#{1,3})\s+(.+)$/gm;
      const extractedHeadings: Heading[] = [];
      let match;

      while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");

        extractedHeadings.push({ id, text, level });
      }

      setHeadings(extractedHeadings);
    };

    extractHeadings();
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -70% 0%" }
    );

    // Wait for the DOM to be ready
    setTimeout(() => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.observe(element);
        }
      });
    }, 100);

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementTop - offset,
        behavior: "smooth",
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="hidden lg:block fixed right-8 top-32 w-72 max-h-[calc(100vh-10rem)] overflow-y-auto">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ScrollText className="h-4 w-4" />
            Table of Contents
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <nav className="space-y-1">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={cn(
                  "w-full text-left px-3 py-1.5 text-sm rounded-md transition-all duration-200 hover:bg-muted/50",
                  heading.level === 1 && "font-semibold",
                  heading.level === 2 && "pl-6",
                  heading.level === 3 && "pl-9 text-xs",
                  activeId === heading.id && "bg-primary/10 text-primary border-l-2 border-primary"
                )}
              >
                <span className="flex items-center gap-1">
                  {heading.level === 1 && <Hash className="h-3 w-3 opacity-50" />}
                  {heading.text}
                </span>
              </button>
            ))}
          </nav>
        </CardContent>
      </Card>

      {/* Quick Actions Section */}
      <Card className="mt-4 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Key Points</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <ul className="text-xs space-y-2 text-muted-foreground">
            <li>• States represent every possible situation</li>
            <li>• Actions are what the agent can do</li>
            <li>• Policy maps states to actions</li>
            <li>• Rewards provide feedback signals</li>
            <li>• Value functions estimate future returns</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
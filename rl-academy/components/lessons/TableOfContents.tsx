"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollText, Hash, PanelRightClose, PanelRight } from "lucide-react";

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarStyle, setSidebarStyle] = useState<{ top: number; maxHeight: number }>({ top: 0, maxHeight: 500 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Calculate sidebar position to stay within content boundaries
  useEffect(() => {
    const calculatePosition = () => {
      // Find the content container and navigation footer
      const contentContainer = document.querySelector('[data-content-start]');
      const navigationFooter = document.querySelector('[data-navigation-footer]');

      if (contentContainer && navigationFooter) {
        const contentRect = contentContainer.getBoundingClientRect();
        const footerRect = navigationFooter.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate the top position (below the header card)
        const contentTop = contentRect.top + window.scrollY;
        const footerTop = footerRect.top + window.scrollY;

        // Calculate available space
        const scrollY = window.scrollY;
        const topBoundary = Math.max(contentTop - scrollY + 16, 100); // 16px padding, min 100px from top
        const bottomBoundary = footerTop - scrollY - 16; // 16px padding from footer
        const availableHeight = bottomBoundary - topBoundary;

        setSidebarStyle({
          top: topBoundary,
          maxHeight: Math.max(availableHeight, 200) // Minimum height of 200px
        });
      }
    };

    calculatePosition();
    window.addEventListener('scroll', calculatePosition);
    window.addEventListener('resize', calculatePosition);

    return () => {
      window.removeEventListener('scroll', calculatePosition);
      window.removeEventListener('resize', calculatePosition);
    };
  }, []);

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
    <>
      {/* Toggle button - always visible */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex fixed right-4 z-50 shadow-md"
        style={{ top: sidebarStyle.top }}
        title={isCollapsed ? "Show Table of Contents" : "Hide Table of Contents"}
      >
        {isCollapsed ? <PanelRight className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
      </Button>

      {/* Sidebar content */}
      <div
        ref={containerRef}
        className={cn(
          "hidden lg:block fixed right-8 w-72 transition-all duration-300 overflow-y-auto",
          isCollapsed && "opacity-0 pointer-events-none translate-x-4"
        )}
        style={{
          top: sidebarStyle.top,
          maxHeight: sidebarStyle.maxHeight
        }}
      >
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ScrollText className="h-4 w-4" />
                Table of Contents
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsCollapsed(true)}
                title="Hide sidebar"
              >
                <PanelRightClose className="h-3 w-3" />
              </Button>
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
    </>
  );
}
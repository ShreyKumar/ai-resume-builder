"use client";

import { type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuestionWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  showBack?: boolean;
  showNext?: boolean;
  nextDisabled?: boolean;
  className?: string;
}

export function QuestionWrapper({
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextLabel = "Continue",
  backLabel = "Back",
  showBack = true,
  showNext = true,
  nextDisabled = false,
  className,
}: QuestionWrapperProps) {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center px-4 py-12",
        className
      )}
    >
      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="space-y-6">{children}</div>

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          {showBack && onBack ? (
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {backLabel}
            </Button>
          ) : (
            <div />
          )}
          {showNext && onNext && (
            <Button
              onClick={onNext}
              disabled={nextDisabled}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {nextLabel}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

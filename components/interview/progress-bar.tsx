"use client";

import { useInterview } from "@/lib/interview-context";

export function ProgressBar() {
  const { progress, currentSection } = useInterview();

  if (currentSection === "welcome" || currentSection === "complete") {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

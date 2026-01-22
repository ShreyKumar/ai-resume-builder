"use client";

import React from "react"

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  type ResumeData,
  type InterviewSection,
  defaultResumeData,
} from "./resume-types";

interface InterviewContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  currentSection: InterviewSection;
  setCurrentSection: (section: InterviewSection) => void;
  progress: number;
  generatedResume: string;
  setGeneratedResume: (resume: string) => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(
  undefined
);

const sectionOrder: InterviewSection[] = [
  "welcome",
  "contact",
  "summary",
  "experience",
  "opensource",
  "awards",
  "education",
  "certifications",
  "skills",
  "review",
  "generating",
  "complete",
];

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [currentSection, setCurrentSection] =
    useState<InterviewSection>("welcome");
  const [generatedResume, setGeneratedResume] = useState("");

  const progress =
    (sectionOrder.indexOf(currentSection) / (sectionOrder.length - 1)) * 100;

  return (
    <InterviewContext.Provider
      value={{
        resumeData,
        setResumeData,
        currentSection,
        setCurrentSection,
        progress,
        generatedResume,
        setGeneratedResume,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  return context;
}

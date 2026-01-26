"use client";

import { useInterview } from "@/lib/interview-context";
import { QuestionWrapper } from "../question-wrapper";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useCopyToResumeData } from "@/lib/use-copy-to-resume-data";

export function SummarySection() {
  const { resumeData: initialResumeData, setCurrentSection } = useInterview();
  const [resumeData, setResumeData] = useState(initialResumeData);

  useCopyToResumeData(resumeData);

  // useEffect(() => {
  //   console.log("Resume data changed: ", resumeData)
  // }, [resumeData]);

  return (
    <QuestionWrapper
      title="Tell us about yourself"
      subtitle="Write a brief professional summary. What makes you unique? What are your career goals? This will appear at the top of your resume."
      onNext={() => setCurrentSection("experience")}
      onBack={() => setCurrentSection("contact")}
    >
      <div className="grid gap-4">
        <Label htmlFor="summary" className="text-foreground">
          Professional Summary
        </Label>
        <Textarea
          id="summary"
          placeholder="Passionate software engineer with 5+ years of experience building scalable web applications. Skilled in React, Node.js, and cloud technologies. Known for driving product improvements and mentoring junior developers..."
          value={resumeData.summary}
          onChange={(e) =>
            setResumeData((prev) => ({ ...prev, summary: e.target.value }))
            // setResumeData(e.target.value)
          }
          className="min-h-[200px] bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
        />
        <p className="text-sm text-muted-foreground">
          Tip: Keep it concise, around 3-4 sentences. Focus on your key strengths and what you bring to the table.
        </p>
      </div>
    </QuestionWrapper>
  );
}

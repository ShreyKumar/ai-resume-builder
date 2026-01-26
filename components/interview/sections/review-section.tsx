"use client";

import { useInterview } from "@/lib/interview-context";
import { QuestionWrapper } from "../question-wrapper";
import { ResumePreview } from "../resume-preview";

export function ReviewSection() {
  const { setCurrentSection } = useInterview();

  return (
    <QuestionWrapper
      title="Ready to download your resume?"
      subtitle="Isn't this neat? No more revisions needed. Just generate and download your resume in PDF or Markdown format."
      onBack={() => setCurrentSection("skills")}
      nextLabel="Generate Resume"
      nextDownloadLink
    >
      <ResumePreview fullWidth />
    </QuestionWrapper>
  );
}

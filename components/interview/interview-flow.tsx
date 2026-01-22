"use client";

import { useInterview } from "@/lib/interview-context";
import { ProgressBar } from "./progress-bar";
import { WelcomeSection } from "./sections/welcome-section";
import { ContactSection } from "./sections/contact-section";
import { SummarySection } from "./sections/summary-section";
import { ExperienceSection } from "./sections/experience-section";
import { OpenSourceSection } from "./sections/opensource-section";
import { AwardsSection } from "./sections/awards-section";
import { EducationSection } from "./sections/education-section";
import { CertificationsSection } from "./sections/certifications-section";
import { SkillsSection } from "./sections/skills-section";
import { ReviewSection } from "./sections/review-section";
import { GeneratingSection } from "./sections/generating-section";
import { CompleteSection } from "./sections/complete-section";

export function InterviewFlow() {
  const { currentSection } = useInterview();

  const renderSection = () => {
    switch (currentSection) {
      case "welcome":
        return <WelcomeSection />;
      case "contact":
        return <ContactSection />;
      case "summary":
        return <SummarySection />;
      case "experience":
        return <ExperienceSection />;
      case "opensource":
        return <OpenSourceSection />;
      case "awards":
        return <AwardsSection />;
      case "education":
        return <EducationSection />;
      case "certifications":
        return <CertificationsSection />;
      case "skills":
        return <SkillsSection />;
      case "review":
        return <ReviewSection />;
      case "generating":
        return <GeneratingSection />;
      case "complete":
        return <CompleteSection />;
      default:
        return <WelcomeSection />;
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <ProgressBar />
      {renderSection()}
    </main>
  );
}

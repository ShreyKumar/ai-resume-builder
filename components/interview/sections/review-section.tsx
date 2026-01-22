"use client";

import { useInterview } from "@/lib/interview-context";
import { QuestionWrapper } from "../question-wrapper";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Briefcase,
  Github,
  Trophy,
  GraduationCap,
  Award,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { ResumePreview } from "@/components/resume/resume-preview";

export function ReviewSection() {
  const { resumeData, setCurrentSection } = useInterview();
  const [showPreview, setShowPreview] = useState(false);

  const sections = [
    {
      icon: User,
      title: "Contact Information",
      status: resumeData.contact.fullName ? "complete" : "incomplete",
      details: resumeData.contact.fullName
        ? `${resumeData.contact.fullName} • ${resumeData.contact.email}`
        : "Not provided",
    },
    {
      icon: Sparkles,
      title: "Professional Summary",
      status: resumeData.summary ? "complete" : "optional",
      details: resumeData.summary
        ? `${resumeData.summary.slice(0, 100)}...`
        : "No summary provided",
    },
    {
      icon: Briefcase,
      title: "Work Experience",
      status: resumeData.experiences.length > 0 ? "complete" : "optional",
      details:
        resumeData.experiences.length > 0
          ? `${resumeData.experiences.length} position(s) added`
          : "No experience added",
    },
    {
      icon: Github,
      title: "Open Source Contributions",
      status: resumeData.openSource.length > 0 ? "complete" : "optional",
      details:
        resumeData.openSource.length > 0
          ? `${resumeData.openSource.length} contribution(s) added`
          : "No contributions added",
    },
    {
      icon: Trophy,
      title: "Awards",
      status: resumeData.awards.length > 0 ? "complete" : "optional",
      details:
        resumeData.awards.length > 0
          ? `${resumeData.awards.length} award(s) added`
          : "No awards added",
    },
    {
      icon: GraduationCap,
      title: "Education",
      status: resumeData.education.length > 0 ? "complete" : "optional",
      details:
        resumeData.education.length > 0
          ? `${resumeData.education.length} education entry(s) added`
          : "No education added",
    },
    {
      icon: Award,
      title: "Certifications",
      status: resumeData.certifications.length > 0 ? "complete" : "optional",
      details:
        resumeData.certifications.length > 0
          ? `${resumeData.certifications.length} certification(s) added`
          : "No certifications added",
    },
    {
      icon: Sparkles,
      title: "Skills",
      status: resumeData.skills.length > 0 ? "complete" : "optional",
      details:
        resumeData.skills.length > 0
          ? `${resumeData.skills.length} skill(s) added`
          : "No skills added",
    },
  ];

  return (
    <QuestionWrapper
      title="Ready to generate your resume?"
      subtitle="Here's a summary of the information you've provided. Preview your resume or proceed to generate the final version."
      onNext={() => setCurrentSection("generating")}
      onBack={() => setCurrentSection("skills")}
      nextLabel="Generate Resume"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="border-border text-foreground hover:bg-secondary bg-transparent"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview Resume
              </>
            )}
          </Button>
        </div>

        {showPreview && (
          <div className="mb-6">
            <ResumePreview data={resumeData} />
          </div>
        )}

        <div className="space-y-4">
          {sections.map((section) => (
            <Card
              key={section.title}
              className="p-4 bg-card border-border flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  section.status === "complete"
                    ? "bg-primary/10"
                    : "bg-secondary"
                }`}
              >
                <section.icon
                  className={`w-5 h-5 ${
                    section.status === "complete"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground">
                    {section.title}
                  </h3>
                  {section.status === "complete" && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {section.details}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </QuestionWrapper>
  );
}

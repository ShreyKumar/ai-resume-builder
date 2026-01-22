"use client";

import { useEffect } from "react";
import { useInterview } from "@/lib/interview-context";
import { Loader2, Sparkles } from "lucide-react";

export function GeneratingSection() {
  const { resumeData, setCurrentSection, setGeneratedResume } = useInterview();

  useEffect(() => {
    const generateResume = async () => {
      try {
        const response = await fetch("/api/generate-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resumeData),
        });

        if (!response.ok) {
          throw new Error("Failed to generate resume");
        }

        const data = await response.json();
        setGeneratedResume(data.resume);
        setCurrentSection("complete");
      } catch (error) {
        console.error("[v0] Error generating resume:", error);
        // Fallback: generate a basic resume structure
        const fallbackResume = generateFallbackResume(resumeData);
        setGeneratedResume(fallbackResume);
        setCurrentSection("complete");
      }
    };

    generateResume();
  }, [resumeData, setCurrentSection, setGeneratedResume]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center animate-in fade-in duration-500">
        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-8">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div className="relative w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Crafting Your Resume
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Our AI is analyzing your information and creating a polished, professional resume...
        </p>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>This usually takes a few seconds</span>
        </div>
      </div>
    </div>
  );
}

function generateFallbackResume(data: typeof import("@/lib/resume-types").defaultResumeData): string {
  let resume = "";

  // Header
  resume += `# ${data.contact.fullName || "Your Name"}\n\n`;
  
  const contactParts = [];
  if (data.contact.email) contactParts.push(data.contact.email);
  if (data.contact.phone) contactParts.push(data.contact.phone);
  if (data.contact.location) contactParts.push(data.contact.location);
  if (contactParts.length > 0) {
    resume += contactParts.join(" | ") + "\n\n";
  }

  const links = [];
  if (data.contact.linkedin) links.push(`LinkedIn: ${data.contact.linkedin}`);
  if (data.contact.website) links.push(`Portfolio: ${data.contact.website}`);
  if (links.length > 0) {
    resume += links.join(" | ") + "\n\n";
  }

  // Summary
  if (data.summary) {
    resume += `## Professional Summary\n\n${data.summary}\n\n`;
  }

  // Experience
  if (data.experiences.length > 0) {
    resume += `## Work Experience\n\n`;
    for (const exp of data.experiences) {
      resume += `### ${exp.position} at ${exp.company}\n`;
      resume += `*${exp.startDate} - ${exp.current ? "Present" : exp.endDate}*\n\n`;
      if (exp.description) resume += `${exp.description}\n\n`;
      if (exp.achievements.length > 0) {
        resume += "**Key Achievements:**\n";
        for (const achievement of exp.achievements) {
          resume += `- ${achievement}\n`;
        }
        resume += "\n";
      }
    }
  }

  // Open Source
  if (data.openSource.length > 0) {
    resume += `## Open Source Contributions\n\n`;
    for (const contrib of data.openSource) {
      resume += `### ${contrib.projectName}`;
      if (contrib.role) resume += ` - ${contrib.role}`;
      resume += "\n";
      if (contrib.description) resume += `${contrib.description}\n`;
      if (contrib.technologies.length > 0) {
        resume += `Technologies: ${contrib.technologies.join(", ")}\n`;
      }
      if (contrib.link) resume += `Link: ${contrib.link}\n`;
      resume += "\n";
    }
  }

  // Education
  if (data.education.length > 0) {
    resume += `## Education\n\n`;
    for (const edu of data.education) {
      resume += `### ${edu.degree}`;
      if (edu.field) resume += ` in ${edu.field}`;
      resume += `\n${edu.institution}\n`;
      resume += `*${edu.startDate} - ${edu.endDate}*`;
      if (edu.gpa) resume += ` | GPA: ${edu.gpa}`;
      resume += "\n\n";
    }
  }

  // Certifications
  if (data.certifications.length > 0) {
    resume += `## Certifications\n\n`;
    for (const cert of data.certifications) {
      resume += `- **${cert.name}** - ${cert.issuer}`;
      if (cert.date) resume += ` (${cert.date})`;
      resume += "\n";
    }
    resume += "\n";
  }

  // Awards
  if (data.awards.length > 0) {
    resume += `## Awards & Recognition\n\n`;
    for (const award of data.awards) {
      resume += `- **${award.title}** - ${award.issuer}`;
      if (award.date) resume += ` (${award.date})`;
      resume += "\n";
    }
    resume += "\n";
  }

  // Skills
  if (data.skills.length > 0) {
    resume += `## Skills\n\n`;
    resume += data.skills.join(" • ") + "\n";
  }

  return resume;
}

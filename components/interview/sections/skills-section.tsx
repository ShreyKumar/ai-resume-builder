"use client";

import { useState } from "react";
import { useInterview } from "@/lib/interview-context";
import { QuestionWrapper } from "../question-wrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";

const suggestedSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "SQL",
  "AWS",
  "Docker",
  "Git",
  "Agile",
  "Leadership",
  "Communication",
  "Problem Solving",
  "Project Management",
];

export function SkillsSection() {
  const { resumeData, setResumeData, setCurrentSection } = useInterview();
  const [newSkill, setNewSkill] = useState("");

  const addSkill = (skill: string) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const availableSuggestions = suggestedSkills.filter(
    (skill) => !resumeData.skills.includes(skill)
  );

  return (
    <QuestionWrapper
      title="What are your key skills?"
      subtitle="List your technical and soft skills. These help recruiters find you and match you to the right roles."
      onNext={() => setCurrentSection("review")}
      onBack={() => setCurrentSection("certifications")}
    >
      <div className="space-y-6">
        <div className="grid gap-2">
          <Label className="text-foreground">Add a Skill</Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Machine Learning, Public Speaking..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill(newSkill);
                }
              }}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
            <Button
              onClick={() => addSkill(newSkill)}
              className="bg-primary text-primary-foreground"
            >
              Add
            </Button>
          </div>
        </div>

        {resumeData.skills.length > 0 && (
          <div className="space-y-2">
            <Label className="text-foreground">Your Skills</Label>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-primary/60 hover:text-primary ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {availableSuggestions.length > 0 && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              Suggested Skills
            </Label>
            <div className="flex flex-wrap gap-2">
              {availableSuggestions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill)}
                  className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 border border-border rounded-full text-sm text-secondary-foreground transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </QuestionWrapper>
  );
}

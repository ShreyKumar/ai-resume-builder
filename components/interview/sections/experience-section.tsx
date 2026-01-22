"use client";

import { useState } from "react";
import { useInterview } from "@/lib/interview-context";
import { QuestionWrapper } from "../question-wrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Briefcase, Building2, Calendar, X } from "lucide-react";
import type { JobExperience } from "@/lib/resume-types";

export function ExperienceSection() {
  const { resumeData, setResumeData, setCurrentSection } = useInterview();
  const [isAdding, setIsAdding] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Partial<JobExperience>>({
    achievements: [],
  });
  const [newAchievement, setNewAchievement] = useState("");

  const addExperience = () => {
    if (currentExperience.company && currentExperience.position) {
      const newExp: JobExperience = {
        id: Date.now().toString(),
        company: currentExperience.company || "",
        position: currentExperience.position || "",
        startDate: currentExperience.startDate || "",
        endDate: currentExperience.endDate || "",
        current: currentExperience.current || false,
        description: currentExperience.description || "",
        achievements: currentExperience.achievements || [],
      };
      setResumeData((prev) => ({
        ...prev,
        experiences: [...prev.experiences, newExp],
      }));
      setCurrentExperience({ achievements: [] });
      setIsAdding(false);
    }
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setCurrentExperience((prev) => ({
        ...prev,
        achievements: [...(prev.achievements || []), newAchievement.trim()],
      }));
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    setCurrentExperience((prev) => ({
      ...prev,
      achievements: prev.achievements?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <QuestionWrapper
      title="Tell us about your work experience"
      subtitle="Add your relevant job experiences. Start with your most recent position."
      onNext={() => setCurrentSection("opensource")}
      onBack={() => setCurrentSection("summary")}
      nextLabel={resumeData.experiences.length === 0 ? "Skip for now" : "Continue"}
    >
      <div className="space-y-6">
        {resumeData.experiences.map((exp) => (
          <Card key={exp.id} className="p-4 bg-card border-border">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{exp.position}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeExperience(exp.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}

        {isAdding ? (
          <Card className="p-6 bg-card border-border space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="flex items-center gap-2 text-foreground">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  Company *
                </Label>
                <Input
                  placeholder="Acme Inc."
                  value={currentExperience.company || ""}
                  onChange={(e) =>
                    setCurrentExperience((prev) => ({ ...prev, company: e.target.value }))
                  }
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label className="flex items-center gap-2 text-foreground">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  Position *
                </Label>
                <Input
                  placeholder="Senior Software Engineer"
                  value={currentExperience.position || ""}
                  onChange={(e) =>
                    setCurrentExperience((prev) => ({ ...prev, position: e.target.value }))
                  }
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Start Date
                </Label>
                <Input
                  placeholder="Jan 2020"
                  value={currentExperience.startDate || ""}
                  onChange={(e) =>
                    setCurrentExperience((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  End Date
                </Label>
                <Input
                  placeholder="Dec 2023"
                  value={currentExperience.endDate || ""}
                  onChange={(e) =>
                    setCurrentExperience((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  disabled={currentExperience.current}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="current"
                checked={currentExperience.current}
                onCheckedChange={(checked) =>
                  setCurrentExperience((prev) => ({ ...prev, current: !!checked }))
                }
              />
              <Label htmlFor="current" className="text-sm text-foreground cursor-pointer">
                I currently work here
              </Label>
            </div>

            <div className="grid gap-2">
              <Label className="text-foreground">Job Description</Label>
              <Textarea
                placeholder="Describe your role and responsibilities..."
                value={currentExperience.description || ""}
                onChange={(e) =>
                  setCurrentExperience((prev) => ({ ...prev, description: e.target.value }))
                }
                className="min-h-[100px] bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-foreground">Key Achievements</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Led a team of 5 engineers..."
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
                <Button type="button" onClick={addAchievement} variant="secondary">
                  Add
                </Button>
              </div>
              {currentExperience.achievements && currentExperience.achievements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentExperience.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm text-secondary-foreground"
                    >
                      <span className="truncate max-w-[200px]">{achievement}</span>
                      <button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={addExperience} className="bg-primary text-primary-foreground">
                Save Experience
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setCurrentExperience({ achievements: [] });
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        ) : (
          <Button
            variant="outline"
            className="w-full border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary bg-transparent"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Work Experience
          </Button>
        )}
      </div>
    </QuestionWrapper>
  );
}

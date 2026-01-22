"use client";

import { useState } from "react";
import { useInterview } from "@/lib/interview-context";
import { QuestionWrapper } from "../question-wrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, GraduationCap, Building2, Calendar, X } from "lucide-react";
import type { Education } from "@/lib/resume-types";

export function EducationSection() {
  const { resumeData, setResumeData, setCurrentSection } = useInterview();
  const [isAdding, setIsAdding] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<Partial<Education>>({
    achievements: [],
  });
  const [newAchievement, setNewAchievement] = useState("");

  const addEducation = () => {
    if (currentEducation.institution && currentEducation.degree) {
      const newEdu: Education = {
        id: Date.now().toString(),
        institution: currentEducation.institution || "",
        degree: currentEducation.degree || "",
        field: currentEducation.field || "",
        startDate: currentEducation.startDate || "",
        endDate: currentEducation.endDate || "",
        gpa: currentEducation.gpa || "",
        achievements: currentEducation.achievements || [],
      };
      setResumeData((prev) => ({
        ...prev,
        education: [...prev.education, newEdu],
      }));
      setCurrentEducation({ achievements: [] });
      setIsAdding(false);
    }
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setCurrentEducation((prev) => ({
        ...prev,
        achievements: [...(prev.achievements || []), newAchievement.trim()],
      }));
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    setCurrentEducation((prev) => ({
      ...prev,
      achievements: prev.achievements?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <QuestionWrapper
      title="Where did you study?"
      subtitle="Add your educational background. Include degrees, bootcamps, or relevant courses."
      onNext={() => setCurrentSection("certifications")}
      onBack={() => setCurrentSection("awards")}
      nextLabel={resumeData.education.length === 0 ? "Skip for now" : "Continue"}
    >
      <div className="space-y-6">
        {resumeData.education.map((edu) => (
          <Card key={edu.id} className="p-4 bg-card border-border">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground">
                    {edu.institution}
                    {edu.field && ` • ${edu.field}`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {edu.startDate} - {edu.endDate}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeEducation(edu.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}

        {isAdding ? (
          <Card className="p-6 bg-card border-border space-y-4">
            <div className="grid gap-2">
              <Label className="flex items-center gap-2 text-foreground">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Institution *
              </Label>
              <Input
                placeholder="Stanford University"
                value={currentEducation.institution || ""}
                onChange={(e) =>
                  setCurrentEducation((prev) => ({ ...prev, institution: e.target.value }))
                }
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="flex items-center gap-2 text-foreground">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  Degree *
                </Label>
                <Input
                  placeholder="Bachelor of Science"
                  value={currentEducation.degree || ""}
                  onChange={(e) =>
                    setCurrentEducation((prev) => ({ ...prev, degree: e.target.value }))
                  }
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Field of Study</Label>
                <Input
                  placeholder="Computer Science"
                  value={currentEducation.field || ""}
                  onChange={(e) =>
                    setCurrentEducation((prev) => ({ ...prev, field: e.target.value }))
                  }
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Start Date
                </Label>
                <Input
                  placeholder="Sep 2016"
                  value={currentEducation.startDate || ""}
                  onChange={(e) =>
                    setCurrentEducation((prev) => ({ ...prev, startDate: e.target.value }))
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
                  placeholder="May 2020"
                  value={currentEducation.endDate || ""}
                  onChange={(e) =>
                    setCurrentEducation((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">GPA</Label>
                <Input
                  placeholder="3.8"
                  value={currentEducation.gpa || ""}
                  onChange={(e) =>
                    setCurrentEducation((prev) => ({ ...prev, gpa: e.target.value }))
                  }
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-foreground">Achievements / Activities</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Dean's List, Honors Society..."
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
                <Button type="button" onClick={addAchievement} variant="secondary">
                  Add
                </Button>
              </div>
              {currentEducation.achievements && currentEducation.achievements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentEducation.achievements.map((achievement, index) => (
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
              <Button onClick={addEducation} className="bg-primary text-primary-foreground">
                Save Education
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setCurrentEducation({ achievements: [] });
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
            Add Education
          </Button>
        )}
      </div>
    </QuestionWrapper>
  );
}

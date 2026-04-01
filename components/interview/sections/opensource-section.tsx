"use client";

import { useState } from "react";
import { useInterview } from "@/lib/interview-context";
import { QuestionWrapper } from "../question-wrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Github, Link, X } from "lucide-react";
import type { OpenSourceContribution } from "@/lib/resume-types";
import { AiSuggestion } from "../ai-suggestion";

export function OpenSourceSection() {
  const { resumeData, setResumeData, setCurrentSection } = useInterview();
  const [isAdding, setIsAdding] = useState(false);
  const [currentContribution, setCurrentContribution] = useState<Partial<OpenSourceContribution>>({
    technologies: [],
  });
  const [newTech, setNewTech] = useState("");

  const addContribution = () => {
    if (currentContribution.projectName) {
      const newContrib: OpenSourceContribution = {
        id: crypto.randomUUID(),
        projectName: currentContribution.projectName || "",
        role: currentContribution.role || "",
        description: currentContribution.description || "",
        technologies: currentContribution.technologies || [],
        link: currentContribution.link || "",
      };
      setResumeData((prev) => ({
        ...prev,
        openSource: [...prev.openSource, newContrib],
      }));
      setCurrentContribution({ technologies: [] });
      setIsAdding(false);
    }
  };

  const removeContribution = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      openSource: prev.openSource.filter((c) => c.id !== id),
    }));
  };

  const addTech = () => {
    if (newTech.trim()) {
      setCurrentContribution((prev) => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTech.trim()],
      }));
      setNewTech("");
    }
  };

  const removeTech = (index: number) => {
    setCurrentContribution((prev) => ({
      ...prev,
      technologies: prev.technologies?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <QuestionWrapper
      title="Any open source contributions?"
      subtitle="Share your contributions to the open source community. This shows your passion and collaboration skills."
      onNext={() => setCurrentSection("awards")}
      onBack={() => setCurrentSection("experience")}
      nextLabel={resumeData.openSource.length === 0 ? "Skip for now" : "Continue"}
    >
      <div className="space-y-6">
        {resumeData.openSource.map((contrib) => (
          <Card key={contrib.id} className="p-4 bg-card border-border">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Github className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{contrib.projectName}</h3>
                  <p className="text-sm text-muted-foreground">{contrib.role}</p>
                  {contrib.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {contrib.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-secondary rounded text-xs text-secondary-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeContribution(contrib.id)}
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
                  <Github className="w-4 h-4 text-muted-foreground" />
                  Project Name *
                </Label>
                <Input
                  placeholder="React.js"
                  value={currentContribution.projectName || ""}
                  onChange={(e) =>
                    setCurrentContribution((prev) => ({ ...prev, projectName: e.target.value }))
                  }
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Your Role</Label>
                <Input
                  placeholder="Contributor"
                  value={currentContribution.role || ""}
                  onChange={(e) =>
                    setCurrentContribution((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="flex items-center gap-2 text-foreground">
                <Link className="w-4 h-4 text-muted-foreground" />
                Project Link
              </Label>
              <Input
                placeholder="https://github.com/..."
                value={currentContribution.link || ""}
                onChange={(e) =>
                  setCurrentContribution((prev) => ({ ...prev, link: e.target.value }))
                }
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-foreground">Description</Label>
              <Textarea
                placeholder="Describe your contributions..."
                value={currentContribution.description || ""}
                onChange={(e) =>
                  setCurrentContribution((prev) => ({ ...prev, description: e.target.value }))
                }
                className="min-h-[80px] bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-foreground">Technologies Used</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="TypeScript"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
                <Button type="button" onClick={addTech} variant="secondary">
                  Add
                </Button>
              </div>
              {currentContribution.technologies && currentContribution.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentContribution.technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm text-secondary-foreground"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTech(index)}
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
              <Button onClick={addContribution} className="bg-primary text-primary-foreground">
                Save Contribution
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setCurrentContribution({ technologies: [] });
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
            Add Open Source Contribution
          </Button>
        )}
      </div>
    </QuestionWrapper>
  );
}

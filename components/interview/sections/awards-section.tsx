"use client";

import { useState } from "react";
import { useInterview } from "@/lib/interview-context";
import { QuestionWrapper } from "../question-wrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Trophy, Building2, Calendar } from "lucide-react";
import type { Award } from "@/lib/resume-types";

export function AwardsSection() {
  const { resumeData, setResumeData, setCurrentSection } = useInterview();
  const [isAdding, setIsAdding] = useState(false);
  const [currentAward, setCurrentAward] = useState<Partial<Award>>({});

  const addAward = () => {
    if (currentAward.title) {
      const newAward: Award = {
        id: Date.now().toString(),
        title: currentAward.title || "",
        issuer: currentAward.issuer || "",
        date: currentAward.date || "",
        description: currentAward.description || "",
      };
      setResumeData((prev) => ({
        ...prev,
        awards: [...prev.awards, newAward],
      }));
      setCurrentAward({});
      setIsAdding(false);
    }
  };

  const removeAward = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      awards: prev.awards.filter((a) => a.id !== id),
    }));
  };

  return (
    <QuestionWrapper
      title="Have you received any awards?"
      subtitle="Recognitions and awards demonstrate your excellence and stand out to employers."
      onNext={() => setCurrentSection("education")}
      onBack={() => setCurrentSection("opensource")}
      nextLabel={resumeData.awards.length === 0 ? "Skip for now" : "Continue"}
    >
      <div className="space-y-6">
        {resumeData.awards.map((award) => (
          <Card key={award.id} className="p-4 bg-card border-border">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{award.title}</h3>
                  <p className="text-sm text-muted-foreground">{award.issuer}</p>
                  {award.date && (
                    <p className="text-xs text-muted-foreground mt-1">{award.date}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeAward(award.id)}
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
                <Trophy className="w-4 h-4 text-muted-foreground" />
                Award Title *
              </Label>
              <Input
                placeholder="Employee of the Year"
                value={currentAward.title || ""}
                onChange={(e) =>
                  setCurrentAward((prev) => ({ ...prev, title: e.target.value }))
                }
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="flex items-center gap-2 text-foreground">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  Issuing Organization
                </Label>
                <Input
                  placeholder="Acme Inc."
                  value={currentAward.issuer || ""}
                  onChange={(e) =>
                    setCurrentAward((prev) => ({ ...prev, issuer: e.target.value }))
                  }
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Date Received
                </Label>
                <Input
                  placeholder="December 2023"
                  value={currentAward.date || ""}
                  onChange={(e) =>
                    setCurrentAward((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-foreground">Description</Label>
              <Textarea
                placeholder="Describe what you did to earn this award..."
                value={currentAward.description || ""}
                onChange={(e) =>
                  setCurrentAward((prev) => ({ ...prev, description: e.target.value }))
                }
                className="min-h-[80px] bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={addAward} className="bg-primary text-primary-foreground">
                Save Award
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setCurrentAward({});
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
            Add Award
          </Button>
        )}
      </div>
    </QuestionWrapper>
  );
}

"use client";

import { useState } from "react";
import { useInterview } from "@/lib/interview-context";
import { QuestionWrapper } from "../question-wrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Award, Building2, Calendar, Link } from "lucide-react";
import type { Certification } from "@/lib/resume-types";

export function CertificationsSection() {
  const { resumeData, setResumeData, setCurrentSection } = useInterview();
  const [isAdding, setIsAdding] = useState(false);
  const [currentCert, setCurrentCert] = useState<Partial<Certification>>({});

  const addCertification = () => {
    if (currentCert.name) {
      const newCert: Certification = {
        id: Date.now().toString(),
        name: currentCert.name || "",
        issuer: currentCert.issuer || "",
        date: currentCert.date || "",
        expirationDate: currentCert.expirationDate || "",
        credentialId: currentCert.credentialId || "",
        link: currentCert.link || "",
      };
      setResumeData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCert],
      }));
      setCurrentCert({});
      setIsAdding(false);
    }
  };

  const removeCertification = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  };

  return (
    <QuestionWrapper
      title="Do you have any certifications?"
      subtitle="Professional certifications validate your expertise and commitment to learning."
      onNext={() => setCurrentSection("skills")}
      onBack={() => setCurrentSection("education")}
      nextLabel={resumeData.certifications.length === 0 ? "Skip for now" : "Continue"}
    >
      <div className="space-y-6">
        {resumeData.certifications.map((cert) => (
          <Card key={cert.id} className="p-4 bg-card border-border">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  {cert.date && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Issued: {cert.date}
                      {cert.expirationDate && ` • Expires: ${cert.expirationDate}`}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCertification(cert.id)}
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
                <Award className="w-4 h-4 text-muted-foreground" />
                Certification Name *
              </Label>
              <Input
                placeholder="AWS Solutions Architect"
                value={currentCert.name || ""}
                onChange={(e) =>
                  setCurrentCert((prev) => ({ ...prev, name: e.target.value }))
                }
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid gap-2">
              <Label className="flex items-center gap-2 text-foreground">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Issuing Organization
              </Label>
              <Input
                placeholder="Amazon Web Services"
                value={currentCert.issuer || ""}
                onChange={(e) =>
                  setCurrentCert((prev) => ({ ...prev, issuer: e.target.value }))
                }
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Issue Date
                </Label>
                <Input
                  placeholder="January 2024"
                  value={currentCert.date || ""}
                  onChange={(e) =>
                    setCurrentCert((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Expiration Date
                </Label>
                <Input
                  placeholder="January 2027"
                  value={currentCert.expirationDate || ""}
                  onChange={(e) =>
                    setCurrentCert((prev) => ({ ...prev, expirationDate: e.target.value }))
                  }
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-foreground">Credential ID</Label>
                <Input
                  placeholder="ABC123XYZ"
                  value={currentCert.credentialId || ""}
                  onChange={(e) =>
                    setCurrentCert((prev) => ({ ...prev, credentialId: e.target.value }))
                  }
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label className="flex items-center gap-2 text-foreground">
                  <Link className="w-4 h-4 text-muted-foreground" />
                  Credential URL
                </Label>
                <Input
                  placeholder="https://..."
                  value={currentCert.link || ""}
                  onChange={(e) =>
                    setCurrentCert((prev) => ({ ...prev, link: e.target.value }))
                  }
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={addCertification} className="bg-primary text-primary-foreground">
                Save Certification
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setCurrentCert({});
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
            Add Certification
          </Button>
        )}
      </div>
    </QuestionWrapper>
  );
}

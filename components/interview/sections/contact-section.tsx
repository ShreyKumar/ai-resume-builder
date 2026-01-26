"use client";

import { useState } from "react";
import { useInterview } from "@/lib/interview-context";
import { QuestionWrapper } from "../question-wrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Linkedin, Globe, BriefcaseBusiness } from "lucide-react";
import { defaultResumeData } from "@/lib/resume-types";
import { useCopyToResumeData } from "@/lib/use-copy-to-resume-data";

export function ContactSection() {
  const { resumeData: initialResumeData, setCurrentSection } = useInterview();
  const [resumeData, setResumeData] = useState(initialResumeData);

  const updateContact = (field: keyof typeof resumeData.contact, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const updateSocials = (field: keyof typeof resumeData.contact.socials, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        socials: { ...prev.contact.socials, [field]: value },
      },
    }));
  };

  useCopyToResumeData(resumeData);

  const isValid = resumeData.contact.fullName && resumeData.contact.socials.email;

  return (
    <QuestionWrapper
      title="Let's start with your contact information"
      subtitle="How can employers reach you? We'll make sure your resume has all the essential details."
      onNext={() => setCurrentSection("summary")}
      onBack={() => setCurrentSection("welcome")}
      nextDisabled={!isValid}
    >
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="fullName" className="flex items-center gap-2 text-foreground">
            <User className="w-4 h-4 text-muted-foreground" />
            Full Name *
          </Label>
          <Input
            id="fullName"
            placeholder="John Smith"
            value={resumeData.contact.fullName}
            onChange={(e) => updateContact("fullName", e.target.value)}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="targetRoles" className="flex items-center gap-2 text-foreground">
            <BriefcaseBusiness className="w-4 h-4 text-muted-foreground" />
            Target Roles *
          </Label>
          <Input
            id="targetRoles"
            placeholder="Senior Software Engineer, Backend Developer (comma separated)"
            value={resumeData.contact.targetRoles}
            onChange={(e) => updateContact("targetRoles", e.target.value)}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-foreground">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={resumeData.contact.socials.email}
              onChange={(e) => updateSocials("email", e.target.value)}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-foreground">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={resumeData.contact.socials.phone}
              onChange={(e) => updateSocials("phone", e.target.value)}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="location" className="flex items-center gap-2 text-foreground">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            Location
          </Label>
          <Input
            id="location"
            placeholder="San Francisco, CA"
            value={resumeData.contact.socials.location}
            onChange={(e) => updateSocials("location", e.target.value)}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="linkedin" className="flex items-center gap-2 text-foreground">
              <Linkedin className="w-4 h-4 text-muted-foreground" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              placeholder="linkedin.com/in/johnsmith"
              value={resumeData.contact.socials.linkedin}
              onChange={(e) => updateSocials("linkedin", e.target.value)}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="website" className="flex items-center gap-2 text-foreground">
              <Globe className="w-4 h-4 text-muted-foreground" />
              Website / Portfolio
            </Label>
            <Input
              id="website"
              placeholder="johnsmith.dev"
              value={resumeData.contact.socials.website}
              onChange={(e) => updateSocials("website", e.target.value)}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>
    </QuestionWrapper>
  );
}

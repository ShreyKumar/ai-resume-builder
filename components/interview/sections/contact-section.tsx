"use client";

import { useState, useEffect } from "react";
import { useInterview } from "@/lib/interview-context";
import { QuestionWrapper } from "../question-wrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Linkedin, Globe, BriefcaseBusiness, Check, ChevronsUpDown } from "lucide-react";
import { useDebouncedResumeSync } from "@/lib/use-debounced-resume-sync";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { contactSchema, type ContactErrors } from "@/lib/validations";

export function ContactSection() {
  const { resumeData: initialResumeData, setCurrentSection } = useInterview();
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [isValid, setIsValid] = useState(false);

  // Autocomplete state
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<string[]>([]);
  const [isLocLoading, setIsLocLoading] = useState(false);

  useEffect(() => {
    if (!locationQuery || locationQuery.length < 2) {
      setLocationResults([]);
      setIsLocLoading(false);
      return;
    }
    setIsLocLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/location-search?q=${encodeURIComponent(locationQuery)}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setLocationResults(data as string[]);
        }
      } catch (e) {
        console.error("Location autocomplete error:", e);
      } finally {
        setIsLocLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [locationQuery]);

  useEffect(() => {
    const validate = () => {
      const result = contactSchema.safeParse({
        fullName: resumeData.contact.fullName,
        targetRoles: resumeData.contact.targetRoles,
        socials: {
          email: resumeData.contact.socials.email,
          phone: resumeData.contact.socials.phone,
          location: resumeData.contact.socials.location,
          linkedin: resumeData.contact.socials.linkedin,
          website: resumeData.contact.socials.website,
        }
      });

      let allErrors: ContactErrors = {};
      let isBasicValid = false;

      if (!result.success) {
        for (const issue of result.error.issues) {
          const path = issue.path[issue.path.length - 1];
          if (typeof path === "string") {
            allErrors[path as keyof ContactErrors] = issue.message;
          }
        }
      } else {
        isBasicValid = true;
      }

      setErrors(allErrors);
      setIsValid(isBasicValid);
    };

    const timeoutId = setTimeout(validate, 600);

    return () => clearTimeout(timeoutId);
  }, [resumeData.contact]);

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

  useDebouncedResumeSync(resumeData);

  return (
    <QuestionWrapper
      title="Let's start with your contact information"
      subtitle="How can employers reach you? We'll make sure your resume has all the essential details."
      onNext={() => setCurrentSection("summary")}
      onBack={() => setCurrentSection("welcome")}
      nextDisabled={!isValid}
    >
      <div className="grid gap-6 pb-20">
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
          {errors.fullName && resumeData.contact.fullName.length > 0 && (
            <span className="text-xs text-red-500">{errors.fullName}</span>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="targetRoles" className="flex items-center gap-2 text-foreground">
            <BriefcaseBusiness className="w-4 h-4 text-muted-foreground" />
            Target Roles *
          </Label>
          <p className="text-xs text-muted-foreground mb-1">
            Comma separate the target roles if there are multiple (e.g. "Software Engineer, Product Manager").
          </p>
          <Input
            id="targetRoles"
            placeholder="Senior Software Engineer, Backend Developer"
            value={resumeData.contact.targetRoles}
            onChange={(e) => updateContact("targetRoles", e.target.value)}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
          {errors.targetRoles && resumeData.contact.targetRoles.length > 0 && (
            <span className="text-xs text-red-500">{errors.targetRoles}</span>
          )}
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
            {errors.email && resumeData.contact.socials.email.length > 0 && (
              <span className="text-xs text-red-500">{errors.email}</span>
            )}
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
            {errors.phone && resumeData.contact.socials.phone.length > 0 && (
              <span className="text-xs text-red-500">{errors.phone}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 items-start w-full">
          <Label htmlFor="location" className="flex items-center gap-2 text-foreground mb-1">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            Location
          </Label>
          <Popover open={locationOpen} onOpenChange={setLocationOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={locationOpen}
                className={cn(
                  "w-full justify-between bg-input border-border font-normal hover:bg-input hover:text-current",
                  !resumeData.contact.socials.location && "text-muted-foreground"
                )}
              >
                <div className="truncate text-left w-full overflow-hidden">
                  {resumeData.contact.socials.location || "Search location or 'Remote'..."}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
              align="start"
            >
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Type to search..."
                  value={locationQuery}
                  onValueChange={setLocationQuery}
                />
                <CommandList>
                  {!isLocLoading && locationResults.length === 0 && locationQuery.length > 1 && (
                    <CommandEmpty>No location found.</CommandEmpty>
                  )}
                  {isLocLoading && (
                    <div className="py-6 text-center text-sm">Searching...</div>
                  )}
                  <CommandGroup>
                    {/* Always allow Remote option */}
                    <CommandItem
                      value="Remote"
                      onSelect={() => {
                        updateSocials("location", "Remote");
                        setLocationOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          resumeData.contact.socials.location === "Remote" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Remote
                    </CommandItem>

                    {locationResults.map((loc) => (
                      <CommandItem
                        key={loc}
                        value={loc}
                        onSelect={(currentValue) => {
                          updateSocials("location", loc);
                          setLocationOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 shrink-0 h-4 w-4",
                            resumeData.contact.socials.location === loc ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="truncate">{loc}</div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.location && resumeData.contact.socials.location.length > 0 && (
            <span className="text-xs text-red-500">{errors.location}</span>
          )}
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
            {errors.linkedin && resumeData.contact.socials.linkedin.length > 0 && (
              <span className="text-xs text-red-500">{errors.linkedin}</span>
            )}
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
            {errors.website && resumeData.contact.socials.website.length > 0 && (
              <span className="text-xs text-red-500">{errors.website}</span>
            )}
          </div>
        </div>
      </div>
    </QuestionWrapper>
  );
}



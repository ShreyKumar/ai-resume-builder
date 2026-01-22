"use client";

import { useInterview } from "@/lib/interview-context";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, Clock, Shield } from "lucide-react";

export function WelcomeSection() {
  const { setCurrentSection } = useInterview();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Build Your Professional Resume
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {"Let's create a standout resume together. I'll guide you through a series of questions to understand your experience and craft a compelling story."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-card border border-border">
            <Sparkles className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">AI-Powered</h3>
            <p className="text-sm text-muted-foreground">
              Smart suggestions and professional phrasing powered by AI
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <Clock className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Quick & Easy</h3>
            <p className="text-sm text-muted-foreground">
              Complete your resume in about 10-15 minutes
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <Shield className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Private</h3>
            <p className="text-sm text-muted-foreground">
              Your data stays secure and is never shared
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={() => setCurrentSection("contact")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
          >
            {"Let's Get Started"}
          </Button>
        </div>
      </div>
    </div>
  );
}

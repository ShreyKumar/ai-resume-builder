"use client";

import { useInterview } from "@/lib/interview-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Download,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  FileType,
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ResumePreview } from "@/components/resume/resume-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CompleteSection() {
  const { generatedResume, resumeData, setCurrentSection, setGeneratedResume } =
    useInterview();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"pdf" | "markdown">("pdf");

  const handleStartOver = () => {
    setGeneratedResume("");
    setCurrentSection("welcome");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([generatedResume], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resumeData.contact.fullName || "resume"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-12">
      <div className="max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">
            Your Resume is Ready!
          </h1>
          <p className="text-lg text-muted-foreground">
            Preview and download your AI-generated resume in PDF or Markdown
            format.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "pdf" | "markdown")}
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <TabsList className="bg-secondary">
              <TabsTrigger
                value="pdf"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <FileType className="w-4 h-4 mr-2" />
                PDF Preview
              </TabsTrigger>
              <TabsTrigger
                value="markdown"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <FileText className="w-4 h-4 mr-2" />
                Markdown
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStartOver}
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            </div>
          </div>

          <TabsContent value="pdf" className="mt-0">
            <ResumePreview data={resumeData} />
          </TabsContent>

          <TabsContent value="markdown" className="mt-0">
            <div className="flex flex-wrap gap-4 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="border-border text-foreground hover:bg-secondary bg-transparent"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
              <Button
                onClick={handleDownloadMarkdown}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Markdown
              </Button>
            </div>

            <Card className="p-8 bg-card border-border">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-foreground mb-2 border-b border-border pb-4">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-medium text-foreground mt-4 mb-2">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => (
                      <li className="text-muted-foreground">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-foreground font-semibold">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="text-muted-foreground italic">
                        {children}
                      </em>
                    ),
                  }}
                >
                  {generatedResume}
                </ReactMarkdown>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

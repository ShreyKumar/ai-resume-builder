"use client";

import { useState, useEffect } from "react";
import { PDFViewer, PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { ResumePDFDocument } from "./resume-pdf-document";
import type { ResumeData } from "@/lib/resume-types";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Eye, EyeOff, Maximize2, Minimize2 } from "lucide-react";

interface ResumePreviewProps {
  data: ResumeData;
  className?: string;
}

export function ResumePreview({ data, className = "" }: ResumePreviewProps) {
  const [isClient, setIsClient] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDownload = async () => {
    setIsGeneratingPdf(true);
    try {
      const blob = await pdf(<ResumePDFDocument data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.contact.fullName || "resume"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center h-96 bg-secondary/30 rounded-lg ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={`${className} ${isFullscreen ? "fixed inset-0 z-50 bg-background p-4" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="border-border text-foreground hover:bg-secondary bg-transparent"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show Preview
              </>
            )}
          </Button>
          {showPreview && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="border-border text-foreground hover:bg-secondary bg-transparent"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4 mr-2" />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Fullscreen
                </>
              )}
            </Button>
          )}
        </div>
        <Button
          onClick={handleDownload}
          disabled={isGeneratingPdf}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </>
          )}
        </Button>
      </div>

      {showPreview && (
        <div
          className={`rounded-lg overflow-hidden border border-border bg-card ${
            isFullscreen ? "h-[calc(100vh-120px)]" : "h-[600px]"
          }`}
        >
          <PDFViewer width="100%" height="100%" showToolbar={false}>
            <ResumePDFDocument data={data} />
          </PDFViewer>
        </div>
      )}
    </div>
  );
}

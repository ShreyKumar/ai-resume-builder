"use client";

import { Document, Page, View, Text, PDFViewer } from "@react-pdf/renderer";
import { useInterview } from "@/lib/interview-context";
import { MyResume, resumeStyles } from "./my-resume";

export function ResumePreview({ fullWidth }: { fullWidth?: boolean }) {
  const { resumeData } = useInterview();

  const isEmpty =
    !resumeData.contact.fullName &&
    !resumeData.summary &&
    resumeData.experiences.length === 0;

  // Key off experience IDs so PDFViewer re-mounts (and regenerates the PDF)
  // whenever an experience is saved or removed. @react-pdf/renderer's PDFViewer
  // does not reliably pick up prop-change re-renders in React 19 / Next.js 16,
  // so forcing a remount is the safest way to guarantee the preview stays in sync.
  const experiencesKey =
    resumeData.experiences.map((e) => e.id).join("-") || "empty";

  const viewerStyle = {
    width: fullWidth ? "100%" : "50%",
    height: "100vh",
    marginRight: fullWidth ? "auto" : "0",
    marginLeft: fullWidth ? "auto" : "0",
  };

  return (
    <PDFViewer key={experiencesKey} style={viewerStyle}>
      {isEmpty ? (
        <Document>
          <Page size="LETTER" style={resumeStyles.page}>
            <View style={resumeStyles.header}>
              <Text style={resumeStyles.name}>Your Name Here</Text>
              <Text style={resumeStyles.contactInfo}>
                Your resume contacts will appear here!
              </Text>
            </View>
          </Page>
        </Document>
      ) : (
        <MyResume resumeData={resumeData} />
      )}
    </PDFViewer>
  );
}

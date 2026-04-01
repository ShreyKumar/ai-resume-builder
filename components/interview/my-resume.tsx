"use client";

import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "@/lib/resume-types";

export const resumeStyles = StyleSheet.create({
  page: {
    padding: "0.5in",
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  contactInfo: {
    fontSize: 9,
    marginBottom: 4,
  },
  titleHeader: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  summary: {
    fontSize: 9,
    lineHeight: 1.3,
    textAlign: "justify",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
    borderBottom: "1 solid #000",
    paddingBottom: 2,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 0,
  },
  companyLine: {
    flexDirection: "row",
    fontSize: 10,
  },
  company: {
    fontWeight: "bold",
  },
  dates: {
    fontSize: 9,
  },
  jobTitle: {
    fontSize: 9,
    fontStyle: "italic",
    marginBottom: 4,
  },
  description: {
    fontSize: 9,
    lineHeight: 1.3,
  },
  bullet: {
    fontSize: 9,
    lineHeight: 1.3,
    marginBottom: 2,
  },
  skillsText: {
    fontSize: 9,
    lineHeight: 1.3,
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
});

export function MyResume({ resumeData }: { resumeData: ResumeData }) {
  const s = resumeStyles;

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.name}>{resumeData.contact.fullName}</Text>
          <Text style={s.contactInfo}>
            {[
              resumeData.contact.socials.email,
              resumeData.contact.socials.phone,
              resumeData.contact.socials.location,
              resumeData.contact.socials.linkedin,
              resumeData.contact.socials.website,
            ]
              .filter(Boolean)
              .join(" | ")}
          </Text>
          <Text style={s.titleHeader}>
            {resumeData.contact.targetRoles
              .split(",")
              .map((role) => role.trim())
              .join(" | ")}
          </Text>
          <Text style={s.summary}>{resumeData.summary}</Text>
        </View>

        {/* Awards & Recognition */}
        {resumeData.awards.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>AWARDS & RECOGNITION</Text>
            {resumeData.awards.map((award, index) => (
              <Text key={index} style={s.bullet}>
                • {award.description}
              </Text>
            ))}
          </View>
        )}

        {/* Technical Skills */}
        {resumeData.skills.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>TECHNICAL SKILLS</Text>
            <Text style={s.skillsText}>{resumeData.skills.join(" • ")}</Text>
          </View>
        )}

        {/* Professional Experience */}
        {resumeData.experiences.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
            {resumeData.experiences.map((exp, index) => (
              <View key={index}>
                <View style={s.jobHeader}>
                  <Text style={s.companyLine}>
                    <Text style={s.company}>{exp.company}</Text>
                  </Text>
                  <Text style={s.dates}>
                    {exp.startDate}
                    {exp.startDate ? " – " : ""}
                    {exp.current ? "Present" : exp.endDate}
                  </Text>
                </View>
                <Text style={s.jobTitle}>{exp.position}</Text>
                <Text style={s.description}>{exp.description}</Text>
                {exp.achievements.map((achiev, i) => (
                  <Text key={i} style={s.bullet}>
                    • {achiev}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Open Source Contributions */}
        {resumeData.openSource.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>OPEN SOURCE CONTRIBUTIONS</Text>
            {resumeData.openSource.map((proj, index) => (
              <View key={index}>
                <View style={s.jobHeader}>
                  <Text style={s.companyLine}>
                    <Text style={s.company}>{proj.projectName}</Text>
                  </Text>
                </View>
                <Text style={s.description}>{proj.description}</Text>
                {proj.technologies.length > 0 && (
                  <Text style={s.description}>
                    {proj.technologies.join(" • ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education & Certifications */}
        {(resumeData.education.length > 0 ||
          resumeData.certifications.length > 0) && (
          <View>
            <Text style={s.sectionTitle}>EDUCATION & CERTIFICATIONS</Text>
            {resumeData.education.map((edu, index) => (
              <View key={index} style={{ ...s.jobHeader, margin: 0 }}>
                <Text style={[s.description, s.bold]}>
                  {edu.degree} | {edu.institution}
                  {edu.gpa ? ` • GPA: ${edu.gpa}` : ""}
                </Text>
                <Text style={s.dates}>
                  {edu.startDate}
                  {edu.startDate && edu.endDate ? " – " : ""}
                  {edu.endDate}
                </Text>
              </View>
            ))}
            {resumeData.certifications.map((cert, index) => (
              <Text key={index} style={s.description}>
                {cert.name}, {cert.issuer}
                {cert.date ? ` (${cert.date})` : ""}
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}

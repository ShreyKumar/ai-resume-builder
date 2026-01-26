"use client";

import { InterviewProvider, useInterview } from "@/lib/interview-context";
import { ResumeData } from "@/lib/resume-types";
import { Document, Page, View, Text, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import exp from "constants";

const styles = StyleSheet.create({
  page: {
    padding: '0.5in',
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  contactInfo: {
    fontSize: 9,
    marginBottom: 4,
  },
  titleHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  summary: {
    fontSize: 9,
    lineHeight: 1.3,
    textAlign: 'justify',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    borderBottom: '1 solid #000',
    paddingBottom: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 0,
  },
  companyLine: {
    flexDirection: 'row',
    fontSize: 10,
  },
  company: {
    fontWeight: 'bold',
  },
  location: {
    fontSize: 9,
  },
  dates: {
    fontSize: 9,
  },
  jobTitle: {
    fontSize: 9,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  jobTitleBold: {
    fontSize: 9,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 2,
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
    fontWeight: 'bold',
  },
  viewer: {
    width: '100%',
    height: '100vh',
  },
});

export const ResumePreview = ({ fullWidth }: { fullWidth?: boolean }) => {
  const { resumeData } = useInterview();

  return (
    <PDFViewer style={
      {
        width: fullWidth ? "100%" : "50%",
        height: "100vh",
        marginRight: fullWidth ? "auto" : "0",
        marginLeft: fullWidth ? "auto" : "0",
      }
    }>
      <MyResume resumeData={resumeData} />
    </PDFViewer>
  )
}

export const MyResume = ({ resumeData }: { resumeData: ResumeData }) => {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{resumeData.contact.fullName}</Text>
          <Text style={styles.contactInfo}>
            {Object.values(resumeData.contact.socials).filter(Boolean).join(" | ")}
          </Text>
          <Text style={styles.titleHeader}>
            {resumeData.contact.targetRoles.split(",").map(role => role.trim()).join(" | ")}
          </Text>
          <Text style={styles.summary}>
            {resumeData.summary}
          </Text>
        </View>

        {/* Awards & Recognition */}
        {
          resumeData.awards.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>AWARDS & RECOGNITION</Text>
              {
                resumeData.awards.map((award, index) => (
                  <Text key={index} style={styles.bullet}>• {award.description}</Text>
                ))
              }
            </View>
          )
        }

        {/* Technical Skills */}
        {
          resumeData.skills.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>TECHNICAL SKILLS</Text>
              <Text style={styles.skillsText}>
                {resumeData.skills.join(" • ")}
              </Text>
            </View>
          )
        }

        {/* Professional Experience */}
        {
          resumeData.experiences.length > 0 && (
            (
              <View>
                <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
                {
                  resumeData.experiences.map((exp, index) => (
                    <View key={index}>
                      <View style={styles.jobHeader}>
                        <Text style={styles.companyLine}>
                          <Text style={styles.company}>{exp.company}</Text>
                          <Text style={styles.location}> • REMOTE</Text>
                        </Text>
                        <Text style={styles.dates}>{exp.startDate} – {exp.endDate}</Text>
                      </View>
                      <Text style={styles.jobTitle}>{exp.position}</Text>
                      <Text style={styles.description}>{exp.description}</Text>
                      {
                        exp.achievements.map((achiev, respIndex) => (
                          <Text key={respIndex} style={styles.bullet}>• {achiev}</Text>
                        ))
                      }
                    </View>
                  ))
                }
              </View>
            )
          )
        }

        {/* Open Source contributions */}
        {
          resumeData.openSource.length > 0 && (
            (
              <View>
                <Text style={styles.sectionTitle}>OPEN SOURCE CONTRIBUTIONS</Text>
                {
                  resumeData.openSource.map((proj, index) => (
                    <View key={index}>
                      <View style={styles.jobHeader}>
                        <Text style={styles.companyLine}>
                          <Text style={styles.company}>{proj.projectName}</Text>
                        </Text>
                      </View>
                      {/* <Text style={styles.jobTitle}>{proj.position}</Text> */}
                      <Text style={styles.description}>{proj.description}</Text>
                      <Text>
                        {
                          proj.technologies.join(" • ")
                        }
                      </Text>
                    </View>
                  ))
                }
              </View>
            )
          )
        }

        {/* Education & Certifications */}
        {
          (resumeData.education.length > 0 || resumeData.certifications.length > 0) && (
            <View>
              <Text style={styles.sectionTitle}>EDUCATION & CERTIFICATIONS</Text>
              {
                resumeData.education.length > 0 && resumeData.education.map((edu, index) => (
                  <View key={index} style={{...styles.jobHeader, margin: 0}}>
                    <Text key={index} style={[styles.description, styles.bold]}>{edu.degree} | {edu.institution} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}</Text>
                    <Text style={styles.dates}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}</Text>
                  </View>
                ))
              }
              <Text style={styles.description}>
                {
                  resumeData.certifications.map((cert, index) => (
                    <Text key={index}>
                      {(index + 1) % 2 === 0 ? ' • ' : ''}
                      {cert.name}, {cert.issuer} ({cert.date}){(index+1) % 2 === 0 ? '\n' : ''}</Text>
                  ))
                }
              </Text>
            </View>
          )
        }
        
      </Page>
    </Document>
  )
}

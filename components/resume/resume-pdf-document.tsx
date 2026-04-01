"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/lib/resume-types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#0d9488",
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0f172a",
    fontFamily: "Helvetica-Bold",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  contactItem: {
    fontSize: 9,
    color: "#475569",
  },
  contactLink: {
    fontSize: 9,
    color: "#0d9488",
    textDecoration: "none",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0d9488",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Helvetica-Bold",
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#334155",
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  company: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
    fontFamily: "Helvetica-Bold",
  },
  dates: {
    fontSize: 9,
    color: "#64748b",
  },
  position: {
    fontSize: 10,
    color: "#475569",
    marginBottom: 4,
    fontFamily: "Helvetica-Oblique",
  },
  description: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.4,
    marginBottom: 4,
  },
  achievementsList: {
    marginLeft: 10,
  },
  achievement: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 2,
    lineHeight: 1.4,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skill: {
    fontSize: 9,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: "#334155",
  },
  educationItem: {
    marginBottom: 10,
  },
  institution: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
    fontFamily: "Helvetica-Bold",
  },
  degree: {
    fontSize: 10,
    color: "#475569",
    fontFamily: "Helvetica-Oblique",
  },
  certItem: {
    marginBottom: 8,
  },
  certName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
    fontFamily: "Helvetica-Bold",
  },
  certIssuer: {
    fontSize: 9,
    color: "#475569",
  },
  awardItem: {
    marginBottom: 8,
  },
  awardTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
    fontFamily: "Helvetica-Bold",
  },
  awardIssuer: {
    fontSize: 9,
    color: "#475569",
  },
  openSourceItem: {
    marginBottom: 10,
  },
  projectName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
    fontFamily: "Helvetica-Bold",
  },
  projectRole: {
    fontSize: 9,
    color: "#0d9488",
    fontFamily: "Helvetica-Oblique",
  },
  techStack: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
  },
  tech: {
    fontSize: 8,
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    color: "#0369a1",
  },
  twoColumn: {
    flexDirection: "row",
    gap: 20,
  },
  column: {
    flex: 1,
  },
  bullet: {
    width: 10,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
});

interface ResumePDFDocumentProps {
  data: ResumeData;
}

export function ResumePDFDocument({ data }: ResumePDFDocumentProps) {
  const hasContact = data.contact.fullName || data.contact.socials.email;
  const hasExperience = data.experiences.length > 0;
  const hasEducation = data.education.length > 0;
  const hasSkills = data.skills.length > 0;
  const hasOpenSource = data.openSource.length > 0;
  const hasAwards = data.awards.length > 0;
  const hasCertifications = data.certifications.length > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        {hasContact && (
          <View style={styles.header}>
            <Text style={styles.name}>{data.contact.fullName}</Text>
            <View style={styles.contactRow}>
              {data.contact.socials.email && (
                <Text style={styles.contactItem}>{data.contact.socials.email}</Text>
              )}
              {data.contact.socials.phone && (
                <Text style={styles.contactItem}>| {data.contact.socials.phone}</Text>
              )}
              {data.contact.socials.location && (
                <Text style={styles.contactItem}>| {data.contact.socials.location}</Text>
              )}
              {data.contact.socials.linkedin && (
                <Link src={data.contact.socials.linkedin} style={styles.contactLink}>
                  | LinkedIn
                </Link>
              )}
              {data.contact.socials.website && (
                <Link src={data.contact.socials.website} style={styles.contactLink}>
                  | Portfolio
                </Link>
              )}
            </View>
          </View>
        )}

        {/* Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {hasExperience && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {data.experiences.map((exp) => (
              <View key={exp.id} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.company}>{exp.company}</Text>
                  <Text style={styles.dates}>
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </Text>
                </View>
                <Text style={styles.position}>{exp.position}</Text>
                {exp.description && (
                  <Text style={styles.description}>{exp.description}</Text>
                )}
                {exp.achievements.length > 0 && (
                  <View style={styles.achievementsList}>
                    {exp.achievements.map((achievement, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.achievement}>{achievement}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {hasEducation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={styles.educationItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.institution}>{edu.institution}</Text>
                  <Text style={styles.dates}>
                    {edu.startDate} - {edu.endDate}
                  </Text>
                </View>
                <Text style={styles.degree}>
                  {edu.degree} in {edu.field}
                  {edu.gpa && ` | GPA: ${edu.gpa}`}
                </Text>
                {edu.achievements.length > 0 && (
                  <View style={styles.achievementsList}>
                    {edu.achievements.map((achievement, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.achievement}>{achievement}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {hasSkills && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {data.skills.map((skill, idx) => (
                <Text key={idx} style={styles.skill}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Open Source */}
        {hasOpenSource && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Open Source Contributions</Text>
            {data.openSource.map((project) => (
              <View key={project.id} style={styles.openSourceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.projectName}>{project.projectName}</Text>
                  <Text style={styles.projectRole}>{project.role}</Text>
                </View>
                {project.description && (
                  <Text style={styles.description}>{project.description}</Text>
                )}
                {project.technologies.length > 0 && (
                  <View style={styles.techStack}>
                    {project.technologies.map((tech, idx) => (
                      <Text key={idx} style={styles.tech}>
                        {tech}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {hasCertifications && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {data.certifications.map((cert) => (
              <View key={cert.id} style={styles.certItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.dates}>{cert.date}</Text>
                </View>
                <Text style={styles.certIssuer}>
                  {cert.issuer}
                  {cert.credentialId && ` | ID: ${cert.credentialId}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Awards */}
        {hasAwards && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Awards & Recognition</Text>
            {data.awards.map((award) => (
              <View key={award.id} style={styles.awardItem}>
                <Text style={styles.description}>{award.description}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}

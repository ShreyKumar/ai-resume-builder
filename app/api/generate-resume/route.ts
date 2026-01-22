import { generateText } from "ai";
import { gateway } from "@ai-sdk/gateway";
import type { ResumeData } from "@/lib/resume-types";

export async function POST(request: Request) {
  try {
    const resumeData: ResumeData = await request.json();

    const prompt = buildPrompt(resumeData);

    const { text } = await generateText({
      model: gateway("openai/gpt-4o-mini"),
      prompt,
    });

    return Response.json({ resume: text });
  } catch (error) {
    console.error("[v0] Error generating resume:", error);
    return Response.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}

function buildPrompt(data: ResumeData): string {
  return `You are an expert resume writer. Create a polished, professional resume in Markdown format based on the following information. Make it ATS-friendly while also being engaging to read. Use strong action verbs and quantify achievements where possible.

CONTACT INFORMATION:
- Full Name: ${data.contact.fullName || "Not provided"}
- Email: ${data.contact.email || "Not provided"}
- Phone: ${data.contact.phone || "Not provided"}
- Location: ${data.contact.location || "Not provided"}
- LinkedIn: ${data.contact.linkedin || "Not provided"}
- Website: ${data.contact.website || "Not provided"}

PROFESSIONAL SUMMARY:
${data.summary || "Not provided"}

WORK EXPERIENCE:
${
  data.experiences.length > 0
    ? data.experiences
        .map(
          (exp) => `
- Company: ${exp.company}
  Position: ${exp.position}
  Duration: ${exp.startDate} - ${exp.current ? "Present" : exp.endDate}
  Description: ${exp.description}
  Achievements: ${exp.achievements.join(", ") || "None listed"}
`
        )
        .join("\n")
    : "No work experience provided"
}

OPEN SOURCE CONTRIBUTIONS:
${
  data.openSource.length > 0
    ? data.openSource
        .map(
          (contrib) => `
- Project: ${contrib.projectName}
  Role: ${contrib.role}
  Description: ${contrib.description}
  Technologies: ${contrib.technologies.join(", ")}
  Link: ${contrib.link}
`
        )
        .join("\n")
    : "No open source contributions provided"
}

EDUCATION:
${
  data.education.length > 0
    ? data.education
        .map(
          (edu) => `
- Institution: ${edu.institution}
  Degree: ${edu.degree}
  Field: ${edu.field}
  Duration: ${edu.startDate} - ${edu.endDate}
  GPA: ${edu.gpa || "Not provided"}
  Achievements: ${edu.achievements.join(", ") || "None listed"}
`
        )
        .join("\n")
    : "No education provided"
}

CERTIFICATIONS:
${
  data.certifications.length > 0
    ? data.certifications
        .map(
          (cert) => `
- Name: ${cert.name}
  Issuer: ${cert.issuer}
  Date: ${cert.date}
  Expiration: ${cert.expirationDate || "No expiration"}
  Credential ID: ${cert.credentialId || "Not provided"}
`
        )
        .join("\n")
    : "No certifications provided"
}

AWARDS:
${
  data.awards.length > 0
    ? data.awards
        .map(
          (award) => `
- Title: ${award.title}
  Issuer: ${award.issuer}
  Date: ${award.date}
  Description: ${award.description}
`
        )
        .join("\n")
    : "No awards provided"
}

SKILLS:
${data.skills.length > 0 ? data.skills.join(", ") : "No skills provided"}

Please generate a professional resume in Markdown format with the following structure:
1. Name as H1 header with contact info below
2. Professional Summary section (enhance and polish if provided, or create one based on experience)
3. Work Experience section with bullet points for responsibilities and achievements
4. Open Source Contributions section (if provided)
5. Education section
6. Certifications section (if provided)
7. Awards section (if provided)
8. Skills section

Make sure to:
- Use strong action verbs
- Highlight accomplishments over responsibilities
- Keep it concise but impactful
- Format consistently throughout
- Only include sections where data was provided`;
}

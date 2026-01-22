export interface ContactDetails {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface JobExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface OpenSourceContribution {
  id: string;
  projectName: string;
  role: string;
  description: string;
  technologies: string[];
  link: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  achievements: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expirationDate: string;
  credentialId: string;
  link: string;
}

export interface ResumeData {
  contact: ContactDetails;
  summary: string;
  experiences: JobExperience[];
  openSource: OpenSourceContribution[];
  awards: Award[];
  education: Education[];
  certifications: Certification[];
  skills: string[];
}

export const defaultResumeData: ResumeData = {
  contact: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
  },
  summary: "",
  experiences: [],
  openSource: [],
  awards: [],
  education: [],
  certifications: [],
  skills: [],
};

export type InterviewSection =
  | "welcome"
  | "contact"
  | "summary"
  | "experience"
  | "opensource"
  | "awards"
  | "education"
  | "certifications"
  | "skills"
  | "review"
  | "generating"
  | "complete";

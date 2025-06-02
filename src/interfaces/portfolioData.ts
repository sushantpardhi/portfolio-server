export interface PortfolioData {
  personalInfo: {
    name: string;
    title: string;
    bio: string;
    email: string;
    github: string;
    linkedin: string;
    portfolio: string;
  };
  about: {
    description: string;
    skills: {
      frontend: Skill;
      backend: Skill;
      tools: Skill;
    };
    interests: {
      coding: Interest;
      learning: Interest;
      problemSolving: Interest;
      collaboration: Interest;
    };
    currentFocus: string;
    education: {
      degree: string;
      university: string;
      graduationYear: string;
    };
    funFacts: string[];
  };
  experience: Experience[];
  projects: Project[];
  certifications: {
    programming: Certification[];
    Framework: Certification[];
  };
}

interface Skill {
  title: string;
  description: string;
  technologies: string[];
}

interface Interest {
  title: string;
  description: string;
}

interface Experience {
  id: number;
  position: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  duration: string;
  summary: string;
  achievements: string[];
  impact: {
    maintained?: string;
    automation?: string;
    [key: string]: string | undefined;
  };
  technologies: string[];
}

interface Project {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  image: string[];
  category: string;
  tech: string[];
  features: string[];
  challenges: string[];
  solutions: string[];
  github: string;
  live: string;
  status: "in-development" | "completed";
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  credential_url?: string;
  status?: string;
}

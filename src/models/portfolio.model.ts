import mongoose, { Schema, Document } from 'mongoose';
import { PortfolioData } from '../interfaces/portfolioData';

export interface IPortfolio extends Document, PortfolioData {}

const SkillSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
});

const InterestSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const ExperienceSchema = new Schema({
  id: { type: Number, required: true },
  position: { type: String, required: true },
  company: { type: String, required: true },
  logo: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  duration: { type: String, required: true },
  summary: { type: String, required: true },
  achievements: [{ type: String }],
  impact: { type: Map, of: String },
  technologies: [{ type: String }],
});

const ProjectSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  image: [{ type: String }],
  category: { type: String, required: true },
  tech: [{ type: String }],
  features: [{ type: String }],
  challenges: [{ type: String }],
  solutions: [{ type: String }],
  github: { type: String, required: true },
  live: { type: String, required: true },
  status: { type: String, enum: ['in-development', 'completed'], required: true },
});

const CertificationSchema = new Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  credential_url: { type: String },
  status: { type: String },
});

const PortfolioSchema = new Schema(
  {
    personalInfo: {
      name: { type: String, required: true },
      title: { type: String, required: true },
      bio: { type: String, required: true },
      email: { type: String, required: true },
      github: { type: String, required: true },
      linkedin: { type: String, required: true },
      portfolio: { type: String, required: true },
    },
    about: {
      description: { type: String, required: true },
      skills: {
        frontend: SkillSchema,
        backend: SkillSchema,
        tools: SkillSchema,
      },
      interests: {
        coding: InterestSchema,
        learning: InterestSchema,
        problemSolving: InterestSchema,
        collaboration: InterestSchema,
      },
      currentFocus: { type: String, required: true },
      education: {
        degree: { type: String, required: true },
        university: { type: String, required: true },
        graduationYear: { type: String, required: true },
      },
      funFacts: [{ type: String }],
    },
    experience: [ExperienceSchema],
    projects: [ProjectSchema],
    certifications: {
      programming: [CertificationSchema],
      Framework: [CertificationSchema],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);

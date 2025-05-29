import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/appError';

const portfolioSchema = Joi.object({
  personalInfo: Joi.object({
    name: Joi.string().required(),
    title: Joi.string().required(),
    bio: Joi.string().required(),
    email: Joi.string().email().required(),
    github: Joi.string().uri().required(),
    linkedin: Joi.string().uri().required(),
    portfolio: Joi.string().uri().required(),
  }).required(),
  about: Joi.object({
    description: Joi.string().required(),
    skills: Joi.object({
      frontend: Joi.object({
        title: Joi.string().required(),
        icon: Joi.string().required(),
        description: Joi.string().required(),
        technologies: Joi.array().items(Joi.string()).required(),
      }).required(),
      backend: Joi.object({
        title: Joi.string().required(),
        icon: Joi.string().required(),
        description: Joi.string().required(),
        technologies: Joi.array().items(Joi.string()).required(),
      }).required(),
      tools: Joi.object({
        title: Joi.string().required(),
        icon: Joi.string().required(),
        description: Joi.string().required(),
        technologies: Joi.array().items(Joi.string()).required(),
      }).required(),
    }).required(),
    interests: Joi.object({
      coding: Joi.object({
        icon: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
      }).required(),
      learning: Joi.object({
        icon: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
      }).required(),
      problemSolving: Joi.object({
        icon: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
      }).required(),
      collaboration: Joi.object({
        icon: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
      }).required(),
    }).required(),
    currentFocus: Joi.string().required(),
    education: Joi.object({
      degree: Joi.string().required(),
      university: Joi.string().required(),
      graduationYear: Joi.string().required(),
    }).required(),
    funFacts: Joi.array().items(Joi.string()).required(),
  }).required(),
  experience: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required(),
        position: Joi.string().required(),
        company: Joi.string().required(),
        logo: Joi.string().required(),
        location: Joi.string().required(),
        type: Joi.string().required(),
        duration: Joi.string().required(),
        summary: Joi.string().required(),
        achievements: Joi.array().items(Joi.string()).required(),
        impact: Joi.object().pattern(Joi.string(), Joi.string()),
        technologies: Joi.array().items(Joi.string()).required(),
      })
    )
    .required(),
  projects: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        shortDescription: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.array().items(Joi.string()).required(),
        category: Joi.string().required(),
        tech: Joi.array().items(Joi.string()).required(),
        features: Joi.array().items(Joi.string()).required(),
        challenges: Joi.array().items(Joi.string()).required(),
        solutions: Joi.array().items(Joi.string()).required(),
        github: Joi.string().uri().required(),
        live: Joi.string().uri().required(),
        status: Joi.string().valid('in-development', 'completed').required(),
      })
    )
    .required(),
  certifications: Joi.object({
    programming: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          issuer: Joi.string().required(),
          date: Joi.string().required(),
          credential_url: Joi.string().uri().optional(),
          status: Joi.string().optional(),
        })
      )
      .required(),
    Framework: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          issuer: Joi.string().required(),
          date: Joi.string().required(),
          credential_url: Joi.string().uri().optional(),
          status: Joi.string().optional(),
        })
      )
      .required(),
  }).required(),
});

export const validatePortfolio = (req: Request, _res: Response, next: NextFunction) => {
  const { error } = portfolioSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }

  next();
};

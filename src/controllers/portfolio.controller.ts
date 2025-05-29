import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import logger from '../utils/logger';
import Portfolio from '../models/portfolio.model';
import { PortfolioData } from '../interfaces/portfolioData';

export const getPortfolio = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return next(new AppError('Portfolio not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: portfolio,
    });
  } catch (error) {
    logger.error('Error getting portfolio:', error);
    next(error);
  }
};

export const updatePortfolio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateData = req.body;
    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!portfolio) {
      return next(new AppError('Portfolio not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: portfolio,
    });
  } catch (error) {
    logger.error('Error updating portfolio:', error);
    next(error);
  }
};

export const createPortfolio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const portfolioData: PortfolioData = req.body;
    const existingPortfolio = await Portfolio.findOne();

    if (existingPortfolio) {
      return next(new AppError('Portfolio already exists. Use update instead.', 400));
    }

    const portfolio = await Portfolio.create(portfolioData);
    res.status(201).json({
      status: 'success',
      data: portfolio,
    });
  } catch (error) {
    logger.error('Error creating portfolio:', error);
    next(error);
  }
};

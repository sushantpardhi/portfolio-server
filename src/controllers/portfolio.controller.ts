import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import logger from "../utils/logger";
import Portfolio from "../models/portfolio.model";
import { PortfolioData } from "../interfaces/portfolioData";
import { setCacheData, getCacheData, clearCache } from "../utils/redis";

const CACHE_KEY = `${process.env.NODE_ENV}-portfolio_data`;
const CACHE_EXPIRATION = 3600; // 1 hour

export const getPortfolio = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Try to get data from cache first
    const cachedData = await getCacheData<PortfolioData>(CACHE_KEY);
    if (cachedData) {
      return res.status(200).json({
        status: "success",
        data: cachedData,
        source: "cache",
      });
    }

    // If not in cache, get from database
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return next(new AppError("Portfolio not found", 404));
    }

    // Store in cache
    await setCacheData(CACHE_KEY, portfolio, CACHE_EXPIRATION);

    res.status(200).json({
      status: "success",
      data: portfolio,
      source: "database",
    });
  } catch (error) {
    logger.error("Error getting portfolio:", error);
    next(error);
  }
};

export const updatePortfolio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      return next(new AppError("Portfolio not found", 404));
    }

    // Clear the cache after update
    await clearCache(CACHE_KEY);
    // Set new cache data
    await setCacheData(CACHE_KEY, portfolio, CACHE_EXPIRATION);

    res.status(200).json({
      status: "success",
      data: portfolio,
    });
  } catch (error) {
    logger.error("Error updating portfolio:", error);
    next(error);
  }
};

export const createPortfolio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const portfolioData: PortfolioData = req.body;
    const existingPortfolio = await Portfolio.findOne();

    if (existingPortfolio) {
      return next(
        new AppError("Portfolio already exists. Use update instead.", 400)
      );
    }

    const portfolio = await Portfolio.create(portfolioData);

    // Set cache for the new portfolio
    await setCacheData(CACHE_KEY, portfolio, CACHE_EXPIRATION);

    res.status(201).json({
      status: "success",
      data: portfolio,
    });
  } catch (error) {
    logger.error("Error creating portfolio:", error);
    next(error);
  }
};

import { Request, Response } from "express";
import { HealthCheck } from "../interfaces/health";
import { dbConnection } from "../config/database";
import logger from "../utils/logger";
import os from "os";
import { execSync } from "child_process";

let requestCount = 0;
const serverStartTime = new Date();

export const getHealthStatus = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const startTime = process.hrtime();
  requestCount++;

  // Get disk space info (cross-platform)
  let diskSpace = { free: "N/A", total: "N/A" };
  try {
    if (process.platform === "win32") {
      const diskInfo = execSync(
        "wmic logicaldisk get size,freespace,caption"
      ).toString();
      const systemDrive = diskInfo
        .split("\n")
        .find((line) => line.includes("C:"));
      if (systemDrive) {
        const [, free, total] = systemDrive.match(/\d+/g) || [];
        if (free && total) {
          diskSpace = {
            free: `${Math.round(parseInt(free) / 1024 / 1024 / 1024)}GB`,
            total: `${Math.round(parseInt(total) / 1024 / 1024 / 1024)}GB`,
          };
        }
      }
    } else {
      // Unix/Linux systems
      const diskInfo = execSync("df -k / --output=size,avail").toString();
      const [, total, free] = diskInfo.match(/(\d+)\s+(\d+)/) || [];
      if (free && total) {
        diskSpace = {
          free: `${Math.round(parseInt(free) / 1024 / 1024)}GB`,
          total: `${Math.round(parseInt(total) / 1024 / 1024)}GB`,
        };
      }
    }
  } catch (err) {
    logger.error("Error getting disk space info:", err);
  }

  // Calculate response time
  const diff = process.hrtime(startTime);
  const responseTime = (diff[0] * 1e9 + diff[1]) / 1e6; // Convert to milliseconds

  const healthCheck: HealthCheck = {
    status: "success",
    timestamp: new Date(),
    responseTime: `${responseTime.toFixed(2)}ms`,
    uptime: {
      server: `${Math.floor(process.uptime())} seconds`,
      since: serverStartTime,
    },
    environment: process.env.NODE_ENV,
    server: {
      nodeVersion: process.version,
      apiVersion: "1.0.0",
      port: process.env.PORT || 8080,
      platform: process.platform,
      arch: process.arch,
    },
    system: {
      cpus: {
        count: os.cpus().length,
        model: os.cpus()[0].model,
        speed: `${os.cpus()[0].speed}MHz`,
      },
      loadAverage: os.loadavg(),
      totalMemory: `${Math.round(os.totalmem() / 1024 / 1024)}MB`,
      freeMemory: `${Math.round(os.freemem() / 1024 / 1024)}MB`,
      diskSpace,
    },
    performance: {
      memory: {
        heapUsed: `${Math.round(
          process.memoryUsage().heapUsed / 1024 / 1024
        )}MB`,
        heapTotal: `${Math.round(
          process.memoryUsage().heapTotal / 1024 / 1024
        )}MB`,
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
        external: `${Math.round(
          process.memoryUsage().external / 1024 / 1024
        )}MB`,
      },
      requestCount,
      rateLimit: {
        windowMs: process.env.RATE_LIMIT_WINDOW_MS || 3600000,
        maxRequests: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
      },
    },
    database: {
      status: "checking",
      uri:
        process.env.NODE_ENV === "development"
          ? process.env.MONGODB_URI?.replace(/\/\/(.+?)@/, "//****:****@")
          : undefined,
    },
  };

  try {
    await dbConnection();
    healthCheck.database.status = "connected";
  } catch (error) {
    healthCheck.database.status = "disconnected";
    healthCheck.status = "warning";
  }

  // Add headers for monitoring and caching
  res.set({
    "Cache-Control": "no-cache",
    "X-Response-Time": `${responseTime.toFixed(2)}ms`,
    "X-Server-Uptime": `${Math.floor(process.uptime())}s`,
  });

  res.status(200).json(healthCheck);
};

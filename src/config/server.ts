import { Application } from "express";
import { dbConnection } from "./database";
import http from "http";

async function serverConnection(app: Application): Promise<http.Server> {
  const port = process.env.PORT || 8800;
  const server = http.createServer(app);

  return new Promise((resolve, reject) => {
    server
      .listen(port)
      .on("listening", () => {
        console.log(`✅ Server is running on port ${port}`);
        resolve(server);
      })
      .on("error", (error: NodeJS.ErrnoException) => {
        if (error.syscall !== "listen") {
          reject(error);
        }

        switch (error.code) {
          case "EACCES":
            reject(new Error(`Port ${port} requires elevated privileges`));
            break;
          case "EADDRINUSE":
            reject(new Error(`Port ${port} is already in use`));
            break;
          default:
            reject(error);
        }
      });
  });
}

export async function startServer(app: Application): Promise<void> {
  try {
    const server = await serverConnection(app);
    await dbConnection();

    // Graceful shutdown handlers
    const shutdownGracefully = async () => {
      console.log("🔄 Shutting down gracefully...");

      server.close(() => {
        console.log("👋 HTTP server closed");
        process.exit(0);
      });

      // If server hasn't closed in 10 seconds, force shutdown
      setTimeout(() => {
        console.error(
          "⚠️ Could not close connections in time, forcefully shutting down"
        );
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", shutdownGracefully);
    process.on("SIGINT", shutdownGracefully);

    // Handle uncaught exceptions and rejections
    process.on("uncaughtException", (error) => {
      console.error("❌ Uncaught Exception:", error);
      shutdownGracefully();
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
      shutdownGracefully();
    });
  } catch (error) {
    console.error("❌ Error starting the server:", error);
    process.exit(1);
  }
}

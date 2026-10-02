import dns from 'node:dns';
import { createApp } from './app.js';
import { connectDB } from './config/database.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const startServer = async () => {
  // Connect to Database
  await connectDB();

  const app = createApp();

  const server = app.listen(config.port, () => {
    logger.info(`🚀 E-Commerce API Server running in [${config.env}] mode on port ${config.port}`);
    logger.info(`🔗 Base API URL: http://localhost:${config.port}${config.apiPrefix}`);
    logger.info(`🩺 Health Check: http://localhost:${config.port}/health`);
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason: any) => {
    logger.error('UNHANDLED REJECTION! 💥', reason);
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error('UNCAUGHT EXCEPTION! 💥', error);
    process.exit(1);
  });
};

startServer();

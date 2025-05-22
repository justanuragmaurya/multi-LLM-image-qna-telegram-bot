import { startBot } from './services/telegram';
import { validateConfig } from './config';
import { logger } from './utils/logger';

async function main() {
  try {
    // Validate configuration
    validateConfig();

    // Start the Telegram bot
    await startBot();

    logger.info('Application started successfully!');
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled promise rejection:', reason);
  process.exit(1);
});

// Run the main function
main();

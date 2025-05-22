import { Telegraf, Context, session } from 'telegraf';
import { message } from 'telegraf/filters';
import { config } from '../config';
import { handleStart, handleHelp, handlePhoto, handleText } from '../bot/handlers';
import { logger } from '../utils/logger';
import { UserSessionData } from '../types';
import { Update } from 'telegraf/types';

declare module 'telegraf' {
  interface Context {
    session: UserSessionData;
  }
}

// Initialize the bot
export const bot = new Telegraf<Context>(config.telegram.botToken);

// Use session middleware
bot.use(session());

// Set initial session state
bot.use((ctx, next) => {
  if (!ctx.session) {
    ctx.session = {
      processingImage: false,
    };
  }
  return next();
});

// Command handlers
bot.start(handleStart);
bot.help(handleHelp);

// Handle photos
bot.on('photo', handlePhoto);

// Handle text messages
bot.on('text', handleText);

// Error handler
bot.catch((err, ctx) => {
  logger.error(`Error in bot:`, err);
  ctx.reply('Sorry, something went wrong. Please try again later.');
});

// Start the bot
export async function startBot(): Promise<void> {
  try {
    await bot.launch();
    logger.info('Bot started successfully!');
    logger.info(`Bot username: @${bot.botInfo?.username}`);
    
    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  } catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  }
}

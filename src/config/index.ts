import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../../.env') });

export const config = {
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  },
  llm: {
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      model: 'claude-opus-4-20250514', // You can adjust the model based on your needs
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: 'gpt-4.1-2025-04-14', 
    },
    google: {
      apiKey: process.env.GOOGLE_API_KEY || '',
      model: 'gemini-2.5-flash-preview-04-17',
    },
  },
  logging: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
};

export const validateConfig = (): void => {
  const requiredConfigs = [
    { key: 'telegram.botToken', value: config.telegram.botToken },
    { key: 'llm.anthropic.apiKey', value: config.llm.anthropic.apiKey },
    { key: 'llm.openai.apiKey', value: config.llm.openai.apiKey },
    { key: 'llm.google.apiKey', value: config.llm.google.apiKey },
  ];

  const missingConfigs = requiredConfigs
    .filter(({ value }) => !value)
    .map(({ key }) => key);

  if (missingConfigs.length > 0) {
    console.error(
      `Error: Missing required configuration: ${missingConfigs.join(', ')}`
    );
    console.error('Please check your .env file and ensure all required variables are set.');
    process.exit(1);
  }
};

export default config;

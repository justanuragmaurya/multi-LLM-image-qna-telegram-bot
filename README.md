# MultiLLM Telegram Bot for Image Question/Answering

This Telegram bot can receive images containing questions, extract the questions, and answer them using multiple large language models:

- Claude (Anthropic)
- GPT-4o (OpenAI)
- Gemini (Google)
- Deepseek-r1-distill-llama-70b via Groq

## Features

- Send images containing questions to get automatic answers
- Extract questions directly from image content
- Get multiple perspectives from different AI models
- Ask follow-up questions about previously sent images
- Robust error handling and session management

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- pnpm package manager
- Telegram Bot Token (from [@BotFather](https://t.me/BotFather))
- API keys for:
  - OpenAI
  - Anthropic
  - Google Generative AI

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your API keys:
     ```
     TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
     ANTHROPIC_API_KEY=your_anthropic_api_key_here
     OPENAI_API_KEY=your_openai_api_key_here
     GOOGLE_API_KEY=your_google_api_key_here
     ```

4. Build and run the bot:
   ```bash
   pnpm dev
   ```

### Testing LLM Integration

Before running the full bot, you can test if your API keys are working correctly:

1. Add your API keys to the `.env` file
2. Build the project:
   ```bash
   pnpm build
   ```
3. Run the test script:
   ```bash
   node scripts/test-llms.js
   ```

This will test each LLM with a simple question and show the responses.

## Usage

1. Start a chat with your bot in Telegram
2. Send an image that contains a question (text visible in the image)
3. The bot will automatically extract and answer the question from the image
4. Alternatively, add a caption with your specific question
5. You can also send a follow-up question after sending an image
6. The bot will respond with answers from all three AI models

## Commands

- `/start` - Start the bot
- `/help` - Show help information

## Documentation

For more detailed information, check out these guides:

- [Getting Started Guide](./docs/GETTING_STARTED.md) - Quick setup instructions
- [Testing Guide](./docs/TESTING.md) - How to test the bot and troubleshoot issues
- [Supported Models](./docs/MODELS.md) - Information about the LLM models and how to configure them

## Project Structure

```
├── src/
│   ├── bot/
│   │   ├── handlers.ts       # Telegram bot command & message handlers
│   │   ├── index.ts          # Bot module exports
│   ├── config/
│   │   ├── index.ts          # Configuration management
│   ├── services/
│   │   ├── llm/
│   │   │   ├── claude.ts     # Anthropic Claude integration
│   │   │   ├── gemini.ts     # Google Gemini integration 
│   │   │   ├── gpt4.ts       # OpenAI GPT-4o integration
│   │   │   ├── index.ts      # LLM service aggregation
│   │   ├── telegram.ts       # Telegram bot initialization
│   ├── types/
│   │   ├── index.ts          # TypeScript type definitions
│   ├── utils/
│   │   ├── image-processing.ts # Image handling utilities
│   │   ├── logger.ts         # Logging utility
│   ├── index.ts              # Application entry point
├── docs/
│   ├── GETTING_STARTED.md    # Quick setup instructions
│   ├── TESTING.md            # Testing and troubleshooting guide
│   ├── MODELS.md             # LLM model information
```

## License

ISC

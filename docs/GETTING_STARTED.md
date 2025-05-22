# Getting Started Guide

This guide will help you get the MultiLLM Telegram Bot for Image Q/A up and running quickly.

## Step 1: Set up your Telegram bot

1. Open Telegram and search for `@BotFather`
2. Start a conversation and send `/newbot`
3. Follow the instructions to create a new bot
4. BotFather will give you a token - copy it for later use

## Step 2: Get API keys for LLMs

You'll need API keys for the following services:

1. **Anthropic Claude**: Sign up at https://console.anthropic.com/ 
2. **OpenAI**: Sign up at https://platform.openai.com/
3. **Google AI**: Get an API key from https://ai.google.dev/

## Step 3: Configure your environment

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your API keys:
   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here
   ```

## Step 4: Install dependencies

Run the following command to install all required packages:

```bash
pnpm install
```

## Step 5: Test LLM integrations

Before running the full bot, test if your LLM connections work:

```bash
pnpm build
node scripts/test-llms.js
```

You should see responses from all three LLM services.

## Step 6: Run the bot

Start the bot with:

```bash
pnpm dev
```

The bot should now be running and connected to Telegram.

## Step 7: Start using your bot

1. Open Telegram and find your bot (by the name you gave it)
2. Start a conversation by sending `/start`
3. Send an image containing a question (text visible in the image)
4. The bot will automatically extract the question from the image and answer it
5. Alternatively, you can add a specific question in the caption
6. You can also send a follow-up question about a previously sent image

## Troubleshooting

If you encounter any issues:

- Check the console logs for error messages
- Verify all API keys are correct in the `.env` file
- Make sure your Telegram bot token is valid
- See the `docs/TESTING.md` file for more detailed troubleshooting

## Next Steps

- Explore different LLM models (see `docs/MODELS.md`)
- Customize the bot's responses by editing the handlers
- Deploy the bot to a server for 24/7 availability

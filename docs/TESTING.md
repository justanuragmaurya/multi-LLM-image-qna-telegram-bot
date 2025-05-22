# Testing Guide for MultiLLM Telegram Bot

This document provides instructions on how to test the various components of the MultiLLM Telegram Bot.

## 1. Setting Up for Testing

Before running any tests, make sure you have:

1. Created a `.env` file with all required API keys
2. Built the TypeScript project with `pnpm build`

## 2. Testing LLM Integration

The project includes a script to test connections to all three LLM providers:

```bash
node scripts/test-llms.js
```

This script will:
- Send a simple text prompt to each LLM (Claude, GPT-4o, and Gemini)
- Display the responses and timing information
- Help verify that your API keys are working correctly

### Expected Output

If everything is working correctly, you should see responses from all four models and no error messages.

## 3. Manual Testing with the Bot

After verifying that the LLM integrations work, you can test the full bot functionality:

1. Start the bot:
   ```bash
   pnpm dev
   ```

2. Open Telegram and start a conversation with your bot

3. Testing scenarios:

   a. Basic commands:
      - Send `/start` - Should receive a welcome message
      - Send `/help` - Should receive help instructions
   
   b. Image analysis:
      - Send an image containing a question - Should extract and answer the question automatically
      - Send an image with caption - Should analyze using all LLMs with the caption as the question
      - Send text after an image - Should analyze the previous image with the new question
   
   c. Error handling:
      - Send text without any previous image - Should inform you to send an image first
      - Send a new question while processing is ongoing - Should ask to wait

## 4. Common Issues and Solutions

### LLM API Issues

- **Claude API errors**: Check your Anthropic API key and ensure you have access to the Claude model specified in config
- **GPT-4o errors**: Verify your OpenAI API key and billing status
- **Gemini errors**: Confirm your Google API key is active and has access to Gemini models
- **Groq errors**: Make sure your Groq API key is valid and you have access to the Deepseek model

### Telegram Bot Issues

- **Bot not responding**: Make sure you've set the correct TELEGRAM_BOT_TOKEN in your .env file
- **Image download failures**: Check your network connection and Telegram API status

### Troubleshooting

- Check the console logs for detailed error information
- Verify that all API keys are correctly formatted in the .env file
- Ensure Node.js version is 16 or higher

## 5. Performance Considerations

- LLM response times vary based on model complexity and server load
- Expect Claude and GPT-4o to typically take 2-5 seconds for responses
- Processing large or complex images may take longer
- Running all three LLMs in parallel ensures faster overall response time

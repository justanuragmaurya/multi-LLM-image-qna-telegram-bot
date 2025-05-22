# Supported LLM Models

This document outlines the LLM models supported by the MultiLLM Telegram Bot and how to configure them.

## Currently Supported Models

### Anthropic Claude

Default model: `claude-3-opus-20240229`

Alternative options:
- `claude-3-sonnet-20240229` (faster, slightly less capable)
- `claude-3-haiku-20240307` (fastest, less capable)

### OpenAI GPT

Default model: `gpt-4o`

Alternative options:
- `gpt-4-vision-preview` (older vision model)
- `gpt-4-turbo` (non-vision model)

### Google Gemini

Default model: `gemini-1.5-pro`

Alternative options:
- `gemini-1.0-pro-vision` (older vision model)
- When available: `gemini-2.5-pro`

## How to Change Models

To change which model is used, edit the configuration in `src/config/index.ts`:

```typescript
export const config = {
  // ...other config
  llm: {
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      model: 'claude-3-opus-20240229', // Change this line
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: 'gpt-4o', // Change this line
    },
    google: {
      apiKey: process.env.GOOGLE_API_KEY || '',
      model: 'gemini-1.5-pro', // Change this line
    },
    groq: {
      apiKey: process.env.GROQ_API_KEY || '',
      model: 'deepseek-r1-distill-llama-70b', // Change this line
    },
  },
  // ...other config
};
```

## Model Capabilities

### Claude
- Strong reasoning capabilities
- Good at detailed visual analysis
- Excellent at following complex instructions

### GPT-4o
- Very detailed visual scene descriptions
- Strong text recognition in images
- Good at answering questions about image content

### Gemini
- Fast processing time
- Good at recognizing objects in images
- Competitive with other models for general visual tasks

### Deepseek via Groq
- Strong reasoning and language understanding
- Limited to text-only interactions (no image input)
- Very fast inference due to Groq's optimized hardware
- Good for complex text reasoning tasks

## Costs and Quotas

Be aware that using these models will incur costs based on the API provider's pricing:

- Anthropic: Charges based on input and output tokens
- OpenAI: Charges based on input tokens (including image tokens) and output tokens
- Google: May have free tier quotas but charges after exceeding limits
- Groq: Currently offers free usage tier, but may have rate limits or introduce pricing

Always monitor your usage to avoid unexpected charges.

## Recommended Configurations

### For best quality analysis
- Claude: `claude-3-opus-20240229`
- OpenAI: `gpt-4o`
- Google: `gemini-1.5-pro`
- Groq: `deepseek-r1-distill-llama-70b`

### For faster responses (balanced)
- Claude: `claude-3-sonnet-20240229`
- OpenAI: `gpt-4o`
- Google: `gemini-1.5-pro`
- Groq: `deepseek-r1-distill-llama-70b` (very fast inference)

### For lower cost
- Claude: `claude-3-haiku-20240307`
- OpenAI: `gpt-4-vision-preview`
- Google: `gemini-1.0-pro-vision`
- Groq: `mixtral-8x7b-32768` (smaller model)

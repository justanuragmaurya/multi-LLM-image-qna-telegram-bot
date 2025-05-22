import { LLMOptions, LLMResponse } from '../../types';
import { calculateResponseTime } from '../../utils/image-processing';
import { logger } from '../../utils/logger';
import { config } from '../../config';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: config.llm.anthropic.apiKey,
});

export async function processWithClaude(options: LLMOptions): Promise<LLMResponse> {
  const { prompt, imageBase64 } = options;
  const startTime = Date.now();

  try {
    logger.info('Processing with Claude');

    const messages: Anthropic.MessageParam[] = [];
    
    // Add the image if available
    if (imageBase64) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      });
    } else {
      messages.push({
        role: 'user',
        content: prompt,
      });
    }

    const response = await anthropic.messages.create({
      model: config.llm.anthropic.model,
      max_tokens: 1000,
      messages,
    });

    // Handle response content safely
    const responseText = response.content[0].type === 'text' 
      ? response.content[0].text 
      : 'No text response received from Claude';

    return {
      text: responseText,
      model: config.llm.anthropic.model,
      provider: 'claude',
      latency: calculateResponseTime(startTime),
    };
  } catch (error) {
    logger.error('Error with Claude API:', error);
    return {
      text: 'Sorry, there was an error processing your request with Claude.',
      model: config.llm.anthropic.model,
      provider: 'claude',
      latency: calculateResponseTime(startTime),
    };
  }
}

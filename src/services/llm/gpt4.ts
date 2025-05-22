import { LLMOptions, LLMResponse } from '../../types';
import { calculateResponseTime } from '../../utils/image-processing';
import { logger } from '../../utils/logger';
import { config } from '../../config';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: config.llm.openai.apiKey,
});

export async function processWithGPT(options: LLMOptions): Promise<LLMResponse> {
  const { prompt, imageBase64 } = options;
  const startTime = Date.now();

  try {
    logger.info('Processing with GPT-4o');

    const messages: any[] = [];
    
    // Add the image if available
    if (imageBase64) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
            },
          },
        ],
      });
    } else {
      messages.push({
        role: 'user',
        content: prompt,
      });
    }

    const response = await openai.chat.completions.create({
      model: config.llm.openai.model,
      messages,
      max_tokens: 1000,
    });

    const responseText = response.choices[0]?.message?.content || '';

    return {
      text: responseText,
      model: config.llm.openai.model,
      provider: 'gpt',
      latency: calculateResponseTime(startTime),
    };
  } catch (error) {
    logger.error('Error with OpenAI API:', error);
    return {
      text: 'Sorry, there was an error processing your request with GPT-4o.',
      model: config.llm.openai.model,
      provider: 'gpt',
      latency: calculateResponseTime(startTime),
    };
  }
}

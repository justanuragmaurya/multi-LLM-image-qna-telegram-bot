import { LLMOptions, LLMResponse, ImageProcessingResult } from '../../types';
import { processWithClaude } from './claude';
import { processWithGPT } from './gpt4';
import { processWithGemini } from './gemini';
import { aggregateResponses } from '../../utils/image-processing';
import { logger } from '../../utils/logger';

export async function processImageWithAllLLMs(
  options: LLMOptions
): Promise<ImageProcessingResult> {
  logger.info('Processing image with all LLMs');

  try {
    // Process with all LLMs in parallel
    const [claudeResponse, gptResponse, geminiResponse] = await Promise.all([
      processWithClaude(options).catch((error: Error) => {
        logger.error('Claude API failed:', error);
        return {
          text: 'Claude API unavailable at this time.',
          model: 'claude-unavailable',
          provider: 'claude',
          latency: 0,
        };
      }),
      processWithGPT(options).catch((error: Error) => {
        logger.error('OpenAI API failed:', error);
        return {
          text: 'OpenAI API unavailable at this time.',
          model: 'openai-unavailable',
          provider: 'gpt',
          latency: 0,
        };
      }),
      processWithGemini(options).catch((error: Error) => {
        logger.error('Gemini API failed:', error);
        return {
          text: 'Gemini API unavailable at this time.',
          model: 'gemini-unavailable',
          provider: 'gemini',
          latency: 0,
        };
      }),
    ]);

    const llmResponses = [claudeResponse, gptResponse, geminiResponse].filter(
      response => !response.model.includes('unavailable')
    );

    // If all APIs failed, provide a meaningful error message
    if (llmResponses.length === 0) {
      return {
        llmResponses: [],
        aggregatedResponse: 'All LLM APIs are currently unavailable. Please try again later.',
        error: 'All LLM services failed to respond',
      };
    }

    // Create an aggregated response
    const aggregatedResponse = aggregateResponses(llmResponses);

    return {
      llmResponses: llmResponses as LLMResponse[],
      aggregatedResponse,
    };
  } catch (error) {
    logger.error('Error processing image with LLMs:', error);
    return {
      llmResponses: [],
      aggregatedResponse: 'Sorry, an error occurred while processing your image.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

import { LLMOptions, LLMResponse } from '../../types';
import { calculateResponseTime } from '../../utils/image-processing';
import { logger } from '../../utils/logger';
import { config } from '../../config';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(config.llm.google.apiKey);

export async function processWithGemini(options: LLMOptions): Promise<LLMResponse> {
  const { prompt, imageBase64 } = options;
  const startTime = Date.now();

  try {
    logger.info('Processing with Gemini');

    // Create a generative model
    const model = genAI.getGenerativeModel({
      model: config.llm.google.model,
      generationConfig: {
        maxOutputTokens: 1000,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    let result;

    if (imageBase64) {
      const imageParts = [{
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg"
        }
      }];

      result = await model.generateContent([
        ...imageParts,
        prompt
      ]);
    } else {
      result = await model.generateContent(prompt);
    }

    const response = result.response;
    const responseText = response.text();

    return {
      text: responseText,
      model: config.llm.google.model,
      provider: 'gemini',
      latency: calculateResponseTime(startTime),
    };
  } catch (error) {
    logger.error('Error with Gemini API:', error);
    return {
      text: 'Sorry, there was an error processing your request with Gemini.',
      model: config.llm.google.model,
      provider: 'gemini',
      latency: calculateResponseTime(startTime),
    };
  }
}

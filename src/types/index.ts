export interface LLMResponse {
  text: string;
  model: string;
  provider: 'claude' | 'gpt' | 'gemini';
  latency: number; // in milliseconds
}

export interface ImageProcessingResult {
  llmResponses: LLMResponse[];
  aggregatedResponse: string;
  error?: string;
}

export interface LLMOptions {
  prompt: string;
  imageUrl?: string;
  imageBase64?: string;
}

// Type for storing user state in Telegram session
export interface UserSessionData {
  processingImage: boolean;
  lastImageUrl?: string;
  lastQuery?: string;
}

import axios from 'axios';

export async function downloadImage(url: string): Promise<Buffer> {
  try {
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'arraybuffer',
    });
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('Failed to download image');
  }
}

export function imageBufferToBase64(buffer: Buffer): string {
  return buffer.toString('base64');
}

export function calculateResponseTime(startTime: number): number {
  return Date.now() - startTime;
}

export function aggregateResponses(responses: Array<{ text: string; provider: string }>): string {
  // Check if this is a question extraction task
  const isQuestionExtraction = responses.some(({ text }) => 
    text.includes('Question:') && text.includes('Answer:'));
  
  if (isQuestionExtraction) {
    let extractedQuestion = '';
    let result = 'I found a question in your image. Here are answers from multiple AI models:\n\n';
    
    // Try to find the extracted question from any of the models
    for (const { text } of responses) {
      const questionMatch = text.match(/Question:\s*(.*?)(\n|$)/);
      if (questionMatch && questionMatch[1] && !extractedQuestion) {
        extractedQuestion = questionMatch[1].trim();
      }
    }
    
    // Add the extracted question at the top if found
    if (extractedQuestion) {
      result = `📝 Extracted Question: "${extractedQuestion}"\n\nHere are the answers from multiple AI models:\n\n`;
    }
    
    // Add each model's answer
    responses.forEach(({ text, provider }, index) => {
      // Try to extract just the answer part
      let answer = text;
      const answerMatch = text.match(/Answer:\s*([\s\S]*?)$/);
      if (answerMatch && answerMatch[1]) {
        answer = answerMatch[1].trim();
      }
      
      result += `🤖 ${provider.toUpperCase()}:\n${answer}\n\n`;
      
      // Add a separator between responses, but not after the last one
      if (index < responses.length - 1) {
        result += '---\n\n';
      }
    });
    
    return result;
  } else {
    // Regular image analysis response format
    let result = 'Here are the analyses from multiple AI models:\n\n';
    
    responses.forEach(({ text, provider }, index) => {
      result += `🤖 ${provider.toUpperCase()}:\n${text}\n\n`;
      
      // Add a separator between responses, but not after the last one
      if (index < responses.length - 1) {
        result += '---\n\n';
      }
    });
    
    return result;
  }
}

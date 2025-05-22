import { Context } from 'telegraf';
import { Message } from 'telegraf/types';
import { downloadImage, imageBufferToBase64 } from '../utils/image-processing';
import { processImageWithAllLLMs } from '../services/llm';
import { logger } from '../utils/logger';
import { UserSessionData } from '../types';

// Start command handler
export async function handleStart(ctx: Context): Promise<void> {
  await ctx.reply(
    `👋 Welcome to the MultiLLM Image Q/A Bot!\n\n` +
    `Send me an image containing a question, and I'll extract and answer it using multiple AI models:\n` +
    `- Claude (Anthropic)\n` +
    `- GPT-4o (OpenAI)\n` +
    `- Gemini (Google)\n\n` +
    `You can also add a specific question in the caption or send a follow-up question.\n\n` +
    `Type /help for more information.`
  );
}

// Help command handler
export async function handleHelp(ctx: Context): Promise<void> {
  await ctx.reply(
    `📋 MultiLLM Image Q/A Bot Help:\n\n` +
    `1️⃣ Send an image containing a question - I'll automatically extract and answer it\n` +
    `2️⃣ Or add a caption with your specific question\n` +
    `3️⃣ You can also send a follow-up question about a previously sent image\n\n` +
    `The bot will process your image using multiple AI models and provide answers from each.\n\n` +
    `Commands:\n` +
    `/start - Start the bot\n` +
    `/help - Show this help message`
  );
}

// Photo handler
export async function handlePhoto(
  ctx: Context & { session: UserSessionData; message: Message.PhotoMessage }
): Promise<void> {
  try {
    await ctx.reply('🖼 I received your image. Processing...');
    
    // Mark that we're processing an image
    ctx.session.processingImage = true;
    
    // Get the largest available photo
    const photoSizes = ctx.message.photo;
    const largestPhoto = photoSizes[photoSizes.length - 1];
    
    // Get file URL
    const fileLink = await ctx.telegram.getFileLink(largestPhoto.file_id);
    const imageUrl = fileLink.href;
    
    // Store image URL in session
    ctx.session.lastImageUrl = imageUrl;
    
    // Get caption if exists
    const caption = ctx.message.caption;
    
    // Download the image
    const imageBuffer = await downloadImage(imageUrl);
    const imageBase64 = imageBufferToBase64(imageBuffer);
    
    if (caption) {
      // If there's a caption, process it as a question
      await ctx.reply('🔍 Analyzing image with the question in your caption...');
      
      // Store the question in session
      ctx.session.lastQuery = caption;
      
      // Process with LLMs
      const result = await processImageWithAllLLMs({
        prompt: `Analyze this image and answer the following question: ${caption}`,
        imageBase64,
      });
      
      // Send the response
      await ctx.reply(result.aggregatedResponse);
    } else {
      // No caption provided - extract and answer the question from the image directly
      await ctx.reply('🔍 Extracting and answering the question in your image...');
      
      // Process with LLMs - note the specific prompt to extract and answer questions from the image
      const result = await processImageWithAllLLMs({
        prompt: `This image contains a question. Please: 1) Extract the question from the image, 2) Answer the question thoroughly. Format your response as "Answer: [your answer]" and only answer from the provided options (if any) answer in very brief`,
        imageBase64,
      });
      
      // Send the response
      await ctx.reply(result.aggregatedResponse);
    }
    
    // Reset processing flag
    ctx.session.processingImage = false;
    
  } catch (error) {
    logger.error('Error in handlePhoto:', error);
    await ctx.reply('Sorry, there was an error processing your image. Please try again.');
    
    // Reset processing flag
    ctx.session.processingImage = false;
  }
}

// Text message handler
export async function handleText(
  ctx: Context & { session: UserSessionData; message: Message.TextMessage }
): Promise<void> {
  try {
    // Skip if it's a command
    if (ctx.message.text.startsWith('/')) {
      return;
    }
    
    // If we have a stored image and we're not already processing
    if (ctx.session.lastImageUrl && !ctx.session.processingImage) {
      ctx.session.processingImage = true;
      await ctx.reply('🔍 Analyzing the previous image with your new question...');
      
      // Store the question
      ctx.session.lastQuery = ctx.message.text;
      
      // Download the image
      const imageBuffer = await downloadImage(ctx.session.lastImageUrl);
      const imageBase64 = imageBufferToBase64(imageBuffer);
      
      // Process with LLMs
      const result = await processImageWithAllLLMs({
        prompt: `Analyze this image and answer the following question: ${ctx.message.text}`,
        imageBase64,
      });
      
      // Send the response
      await ctx.reply(result.aggregatedResponse);
      
      // Reset processing flag
      ctx.session.processingImage = false;
    } else if (ctx.session.processingImage) {
      await ctx.reply(
        'I\'m still processing your image. Please wait a moment.'
      );
    } else {
      await ctx.reply(
        'Please send me an image containing a question or send an image first, then ask a question about it.'
      );
    }
  } catch (error) {
    logger.error('Error in handleText:', error);
    await ctx.reply('Sorry, there was an error processing your request. Please try again.');
    
    // Reset processing flag
    ctx.session.processingImage = false;
  }
}

#!/usr/bin/env node

/**
 * This is a simple test script to verify that your API keys are working correctly.
 * It does not require a real image or Telegram setup, just the LLM API keys.
 * 
 * Run with: node test-llms.js
 */

require('dotenv').config();
const { processWithClaude } = require('../dist/services/llm/claude');
const { processWithGPT } = require('../dist/services/llm/gpt4');
const { processWithGemini } = require('../dist/services/llm/gemini');

async function testAllLLMs() {
  console.log('Testing LLM connections...');
  console.log('-------------------------');
  
  const testPrompt = 'What is the capital of France? Please give a brief answer.';
  
  try {
    // Test Claude
    console.log('Testing Claude API...');
    const claudeResult = await processWithClaude({ prompt: testPrompt });
    console.log(`Claude response (${claudeResult.latency}ms):`);
    console.log(claudeResult.text);
    console.log('-------------------------');
    
    // Test GPT-4o
    console.log('Testing GPT-4o API...');
    const gptResult = await processWithGPT({ prompt: testPrompt });
    console.log(`GPT-4o response (${gptResult.latency}ms):`);
    console.log(gptResult.text);
    console.log('-------------------------');
    
    // Test Gemini
    console.log('Testing Gemini API...');
    const geminiResult = await processWithGemini({ prompt: testPrompt });
    console.log(`Gemini response (${geminiResult.latency}ms):`);
    console.log(geminiResult.text);
    console.log('-------------------------');
    
    console.log('All LLM tests completed successfully!');
    
  } catch (error) {
    console.error('Error during LLM tests:', error);
    console.error('Note: Individual model failures will be handled gracefully in the bot.');
    console.error('You can still use the bot even if one or more models are unavailable.');
  }
}

testAllLLMs();

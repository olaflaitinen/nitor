const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('⚠️  Warning: Gemini API key not found. AI features will be disabled.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

async function refineText(text) {
  if (!genAI) {
    throw new Error('Gemini API not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `You are an academic writing assistant. Refine the following text to improve clarity, conciseness, and academic tone. Preserve ALL LaTeX math formulas EXACTLY as they appear (including $ and $$ delimiters). Only improve the prose.

Text to refine:
${text}

Return ONLY the refined text, nothing else.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function generateAbstract(title, notes) {
  if (!genAI) {
    throw new Error('Gemini API not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `You are an academic writing assistant. Generate a structured abstract (150-250 words) for a research article based on the title and notes below.

Title: ${title}

Notes/Draft Content:
${notes}

The abstract should include:
1. Context and motivation
2. Methodology
3. Key findings
4. Implications

Return ONLY the abstract text, no labels or extra formatting.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function enhanceBio(text, context) {
  if (!genAI) {
    throw new Error('Gemini API not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const contextPrompts = {
    bio: 'Rewrite this professional bio to be more impactful and concise (max 150 words). Use action verbs and highlight achievements.',
    experience: 'Enhance this job description using action verbs, quantitative metrics, and clear impact statements.',
    project: 'Improve this project description to highlight technical skills, challenges overcome, and measurable outcomes.'
  };

  const systemPrompt = contextPrompts[context] || contextPrompts.bio;

  const prompt = `${systemPrompt}

Original text:
${text}

Return ONLY the enhanced text, nothing else.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

module.exports = {
  refineText,
  generateAbstract,
  enhanceBio
};

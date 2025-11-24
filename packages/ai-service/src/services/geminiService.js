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

  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

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

  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

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

  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

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

// 1. Plain language summary for non-experts
async function plainLanguageSummary(text) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Convert this academic text into plain language that a general audience can understand. Avoid jargon and explain complex concepts simply.

Text:
${text}

Return ONLY the plain language summary.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 2. Multi-level summaries
async function multiLevelSummary(text, level) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const levelPrompts = {
    'one-sentence': 'one sentence (max 30 words)',
    'short': 'short paragraph (50-100 words)',
    'medium': 'medium summary (150-250 words)',
    'long': 'detailed summary (300-500 words)'
  };

  const prompt = `Create a ${levelPrompts[level]} summary of this academic text:

${text}

Return ONLY the summary.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 3. Article skeleton extraction
async function extractArticleSkeleton(text) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Extract and structure the key components of this article into: Introduction, Methods, Findings, and Discussion sections.

${text}

Return in JSON format: {"introduction": "...", "methods": "...", "findings": "...", "discussion": "..."}`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 4. Argument consistency checking
async function checkArgumentConsistency(text) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Analyze this text for logical consistency and coherence. Identify any contradictions, gaps in reasoning, or unclear arguments.

${text}

Return a list of issues found with specific examples.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 5. Repetitive sentence detection
async function detectRepetitiveSentences(text) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Identify repetitive or redundant sentences in this text. Flag sections that repeat the same ideas or use similar wording.

${text}

List the repetitive sections and suggest consolidations.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 6. Citation needed detection
async function detectCitationNeeded(text) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Identify statements in this text that need citations or references. Flag claims that require supporting evidence.

${text}

List each statement that needs citation with explanation.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 7. Methods clarity assistant
async function improveMethods(text) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Improve the clarity and reproducibility of this methods section. Ensure all steps are clear, detailed, and in logical order.

${text}

Return the improved methods section.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 8. Limitations suggestions
async function suggestLimitations(text) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Based on this research text, suggest potential limitations that should be discussed. Consider methodological, sample, scope, and generalizability limitations.

${text}

List 5-7 key limitations with brief explanations.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 9. Figure/table caption writer
async function generateCaption(description, type) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Write a professional academic ${type} caption based on this description:

${description}

Follow standard academic formatting. Include what is shown, key findings, and any necessary explanatory notes.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 10. Different audience title variants
async function generateTitleVariants(originalTitle, context) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Generate 5 alternative titles for different audiences (academic, general public, press release, social media, conference) based on:

Original Title: ${originalTitle}
Context: ${context}

Return in JSON array format.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 11. Research question clarification
async function clarifyResearchQuestion(question) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Refine and clarify this research question to be more specific, measurable, and academically rigorous:

${question}

Provide the improved question and brief explanation of changes.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 12. Reviewer response letter generator
async function generateReviewerResponse(reviewComment, yourResponse) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Generate a professional response to this peer review comment:

Reviewer Comment: ${reviewComment}
Your Draft Response: ${yourResponse}

Format as a polite, detailed response that addresses the concern thoroughly.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 13. Poster text compression
async function compressForPoster(text, targetWords) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Compress this text to approximately ${targetWords} words for a research poster. Maintain key findings and clarity.

${text}

Return ONLY the compressed text.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 14. Presentation slide skeleton
async function generateSlideOutline(topic, duration) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Create a presentation slide outline for a ${duration}-minute talk on:

${topic}

Include slide titles, key bullet points, and suggested timing for each slide.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 15. Tone softening
async function softenTone(text) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Rewrite this text with a softer, more diplomatic tone while maintaining the core message:

${text}

Return ONLY the softened version.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 16. Key contributions list
async function extractKeyContributions(text) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Extract and list the key contributions/novelty of this research in bullet points:

${text}

List 3-5 main contributions clearly and concisely.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 17. Research statement draft
async function generateResearchStatement(background, interests, goals) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Write a research statement (500-750 words) based on:

Background: ${background}
Research Interests: ${interests}
Future Goals: ${goals}

Follow standard academic job application format.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 18. Teaching statement draft
async function generateTeachingStatement(experience, philosophy, approach) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Write a teaching statement (500-750 words) based on:

Teaching Experience: ${experience}
Teaching Philosophy: ${philosophy}
Pedagogical Approach: ${approach}

Follow standard academic format with specific examples.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 19. Diversity & Inclusion statement draft
async function generateDiversityStatement(experiences, commitment, plans) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Write a diversity and inclusion statement (500-750 words) based on:

Relevant Experiences: ${experiences}
Commitment to DEI: ${commitment}
Future Plans: ${plans}

Follow best practices for academic DEI statements.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 20. CV version targeting
async function tailorCV(cvContent, jobDescription) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Suggest how to tailor this CV content for this specific job:

CV Content: ${cvContent}
Job Description: ${jobDescription}

Provide specific recommendations for emphasis and reordering.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 21. Skill extraction
async function extractSkills(text) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Extract technical skills, methodological skills, and soft skills from this text:

${text}

Return categorized lists of skills.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 22. Role summaries
async function summarizeRole(roleDescription) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Create a concise, impactful summary (2-3 sentences) of this role for a CV:

${roleDescription}

Focus on achievements and impact.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 23. Gap explanations
async function explainCareerGap(gapDetails) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Write a brief, positive explanation for this career gap:

${gapDetails}

Frame it constructively, focusing on any learning or development.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 24. Recommendation letter drafts
async function draftRecommendationLetter(candidateInfo, relationship, position) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Draft a recommendation letter for:

Candidate: ${candidateInfo}
Your Relationship: ${relationship}
Position Applied For: ${position}

Follow standard academic recommendation letter format.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 25. Bio models
async function generateBio(info, length, context) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Generate a ${length}-word professional bio for ${context} based on:

${info}

Match the tone and style appropriate for the context.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 26. Interdisciplinary connections
async function findInterdisciplinaryConnections(research1, research2) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Identify potential interdisciplinary connections between these research areas:

Area 1: ${research1}
Area 2: ${research2}

Suggest collaboration opportunities and shared methodologies.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 27. Weekly summaries
async function generateWeeklySummary(activities) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Create a concise weekly research summary from these activities:

${activities}

Highlight progress, challenges, and next steps.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 28. Reading list curation
async function curateReadingList(topic, level) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Suggest a curated reading list for ${level} level on:

${topic}

Include key papers, books, and resources in order of importance.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 29. Reference suggestions
async function suggestReferences(context) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Suggest relevant types of references that should be cited for:

${context}

List categories of papers/sources that would strengthen this work.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 30. Trend explanations
async function explainResearchTrend(trend) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Explain this current research trend, its importance, and implications:

${trend}

Provide context and why it matters to the field.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 31. Comment draft suggestions
async function suggestCommentDraft(postContent, context) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Suggest a thoughtful, professional comment for this post:

Post: ${postContent}
Context: ${context}

Provide an engaging, constructive comment.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 32. Question classification
async function classifyQuestion(question) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Classify this research question by type (exploratory, descriptive, explanatory, predictive, etc.) and suggest appropriate methodologies:

${question}

Provide classification and methodology recommendations.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 33. Discussion health signals
async function analyzeDiscussionHealth(discussionText) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Analyze the health and quality of this academic discussion:

${discussionText}

Rate engagement, constructiveness, and identify any concerns.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 34. Meeting agenda summaries
async function summarizeMeetingAgenda(notes) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Create a structured meeting agenda from these notes:

${notes}

Include topics, time allocations, and action items.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 35. Collaboration call texts
async function generateCollaborationProposal(topic, partner, goal) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Write a collaboration proposal email:

Topic: ${topic}
Potential Partner: ${partner}
Goal: ${goal}

Make it professional, clear, and compelling.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 36. Different expertise level modes
async function explainForExpertiseLevel(content, level) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Explain this content for a ${level} audience (undergraduate, graduate, expert, public):

${content}

Adjust terminology and depth appropriately.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 37. Peer-review feedback structuring
async function structureReviewFeedback(feedback) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Structure this peer review feedback into organized categories (major concerns, minor issues, suggestions, strengths):

${feedback}

Provide clear, actionable organization.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 38. Self-review checklists
async function generateSelfReviewChecklist(paperType) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Create a comprehensive self-review checklist for a ${paperType} paper.

Include sections for structure, clarity, citations, methodology, and presentation.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 39. Interview Q&A generation
async function generateInterviewQA(topic, role) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Generate potential interview questions and suggested answers for a ${role} position related to:

${topic}

Include technical, behavioral, and research-focused questions.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 40. Figure/table descriptions
async function describeVisual(visualDescription) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Create an accessible, detailed text description of this figure/table for readers who cannot view it:

${visualDescription}

Include all key information and patterns.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 41. Result interpretation variants
async function interpretResults(data, context) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Provide multiple interpretations of these research results:

Data: ${data}
Context: ${context}

Suggest conservative, moderate, and bold interpretations.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 42. Statistical reporting templates
async function formatStatisticalResults(results, testType) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Format these ${testType} results according to APA style:

${results}

Provide proper statistical reporting format.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 43. Code of conduct summaries
async function summarizeCodeOfConduct(fullText) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Create a clear, concise summary of this code of conduct:

${fullText}

Highlight key expectations and consequences.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 44. Onboarding wizards
async function generateOnboardingGuide(role, institution) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Create an onboarding guide for a new ${role} at ${institution}.

Include key steps, important contacts, and first-week priorities.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 45. Lab manifesto drafts
async function draftLabManifesto(values, goals, culture) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Draft a lab manifesto based on:

Values: ${values}
Research Goals: ${goals}
Lab Culture: ${culture}

Create an inspiring, clear statement of principles.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 46. Event descriptions
async function generateEventDescription(eventDetails) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Write an engaging event description for:

${eventDetails}

Include key information, learning outcomes, and call to action.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 47. Bilingual posts
async function translateToSecondLanguage(text, targetLanguage) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Translate this academic text to ${targetLanguage}, maintaining professional tone and technical accuracy:

${text}

Provide natural, field-appropriate translation.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 48. Terminology alignment
async function alignTerminology(text, targetField) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Adjust terminology in this text to align with ${targetField} conventions:

${text}

Replace terms with field-standard equivalents.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 49. Tone adjustment
async function adjustTone(text, targetTone) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Rewrite this text with a ${targetTone} tone (formal, conversational, enthusiastic, cautious, etc.):

${text}

Maintain the core message while adjusting style.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 50. Prioritized notification summaries
async function prioritizeNotifications(notifications) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Analyze and prioritize these notifications by importance and urgency:

${notifications}

Provide categorized summary with action priorities.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

// 51. Grant proposal feedback
async function reviewGrantProposal(proposal, grantType) {
  if (!genAI) throw new Error('Gemini API not configured');
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

  const prompt = `Review this ${grantType} grant proposal and provide constructive feedback:

${proposal}

Focus on clarity, impact, feasibility, and alignment with grant goals.`;

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

module.exports = {
  refineText,
  generateAbstract,
  enhanceBio,
  plainLanguageSummary,
  multiLevelSummary,
  extractArticleSkeleton,
  checkArgumentConsistency,
  detectRepetitiveSentences,
  detectCitationNeeded,
  improveMethods,
  suggestLimitations,
  generateCaption,
  generateTitleVariants,
  clarifyResearchQuestion,
  generateReviewerResponse,
  compressForPoster,
  generateSlideOutline,
  softenTone,
  extractKeyContributions,
  generateResearchStatement,
  generateTeachingStatement,
  generateDiversityStatement,
  tailorCV,
  extractSkills,
  summarizeRole,
  explainCareerGap,
  draftRecommendationLetter,
  generateBio,
  findInterdisciplinaryConnections,
  generateWeeklySummary,
  curateReadingList,
  suggestReferences,
  explainResearchTrend,
  suggestCommentDraft,
  classifyQuestion,
  analyzeDiscussionHealth,
  summarizeMeetingAgenda,
  generateCollaborationProposal,
  explainForExpertiseLevel,
  structureReviewFeedback,
  generateSelfReviewChecklist,
  generateInterviewQA,
  describeVisual,
  interpretResults,
  formatStatisticalResults,
  summarizeCodeOfConduct,
  generateOnboardingGuide,
  draftLabManifesto,
  generateEventDescription,
  translateToSecondLanguage,
  alignTerminology,
  adjustTone,
  prioritizeNotifications,
  reviewGrantProposal
};

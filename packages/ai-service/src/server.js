const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const geminiService = require('./services/geminiService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'nitor-ai-service' });
});

// Original AI Endpoints
app.post('/api/ai/refine-text', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    const refinedText = await geminiService.refineText(text);
    res.json({ refinedText });
  } catch (error) {
    console.error('Error refining text:', error);
    res.status(500).json({ error: 'Failed to refine text' });
  }
});

app.post('/api/ai/generate-abstract', async (req, res) => {
  try {
    const { title, notes } = req.body;
    if (!title || !notes) {
      return res.status(400).json({ error: 'Title and notes are required' });
    }
    const abstract = await geminiService.generateAbstract(title, notes);
    res.json({ abstract });
  } catch (error) {
    console.error('Error generating abstract:', error);
    res.status(500).json({ error: 'Failed to generate abstract' });
  }
});

app.post('/api/ai/enhance-bio', async (req, res) => {
  try {
    const { text, context } = req.body;
    if (!text || !context) {
      return res.status(400).json({ error: 'Text and context are required' });
    }
    const enhancedText = await geminiService.enhanceBio(text, context);
    res.json({ enhancedText });
  } catch (error) {
    console.error('Error enhancing bio:', error);
    res.status(500).json({ error: 'Failed to enhance bio' });
  }
});

// 1. Plain language summary
app.post('/api/ai/plain-language-summary', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const summary = await geminiService.plainLanguageSummary(text);
    res.json({ summary });
  } catch (error) {
    console.error('Error generating plain language summary:', error);
    res.status(500).json({ error: 'Failed to generate plain language summary' });
  }
});

// 2. Multi-level summaries
app.post('/api/ai/multi-level-summary', async (req, res) => {
  try {
    const { text, level } = req.body;
    if (!text || !level) return res.status(400).json({ error: 'Text and level are required' });
    const summary = await geminiService.multiLevelSummary(text, level);
    res.json({ summary });
  } catch (error) {
    console.error('Error generating multi-level summary:', error);
    res.status(500).json({ error: 'Failed to generate multi-level summary' });
  }
});

// 3. Article skeleton extraction
app.post('/api/ai/extract-skeleton', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const skeleton = await geminiService.extractArticleSkeleton(text);
    res.json({ skeleton });
  } catch (error) {
    console.error('Error extracting article skeleton:', error);
    res.status(500).json({ error: 'Failed to extract article skeleton' });
  }
});

// 4. Argument consistency checking
app.post('/api/ai/check-consistency', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const analysis = await geminiService.checkArgumentConsistency(text);
    res.json({ analysis });
  } catch (error) {
    console.error('Error checking consistency:', error);
    res.status(500).json({ error: 'Failed to check consistency' });
  }
});

// 5. Repetitive sentence detection
app.post('/api/ai/detect-repetition', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const analysis = await geminiService.detectRepetitiveSentences(text);
    res.json({ analysis });
  } catch (error) {
    console.error('Error detecting repetition:', error);
    res.status(500).json({ error: 'Failed to detect repetition' });
  }
});

// 6. Citation needed detection
app.post('/api/ai/detect-citation-needed', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const analysis = await geminiService.detectCitationNeeded(text);
    res.json({ analysis });
  } catch (error) {
    console.error('Error detecting citation needs:', error);
    res.status(500).json({ error: 'Failed to detect citation needs' });
  }
});

// 7. Methods clarity assistant
app.post('/api/ai/improve-methods', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const improved = await geminiService.improveMethods(text);
    res.json({ improved });
  } catch (error) {
    console.error('Error improving methods:', error);
    res.status(500).json({ error: 'Failed to improve methods' });
  }
});

// 8. Limitations suggestions
app.post('/api/ai/suggest-limitations', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const limitations = await geminiService.suggestLimitations(text);
    res.json({ limitations });
  } catch (error) {
    console.error('Error suggesting limitations:', error);
    res.status(500).json({ error: 'Failed to suggest limitations' });
  }
});

// 9. Generate caption
app.post('/api/ai/generate-caption', async (req, res) => {
  try {
    const { description, type } = req.body;
    if (!description || !type) return res.status(400).json({ error: 'Description and type are required' });
    const caption = await geminiService.generateCaption(description, type);
    res.json({ caption });
  } catch (error) {
    console.error('Error generating caption:', error);
    res.status(500).json({ error: 'Failed to generate caption' });
  }
});

// 10. Generate title variants
app.post('/api/ai/generate-title-variants', async (req, res) => {
  try {
    const { originalTitle, context } = req.body;
    if (!originalTitle) return res.status(400).json({ error: 'Original title is required' });
    const variants = await geminiService.generateTitleVariants(originalTitle, context);
    res.json({ variants });
  } catch (error) {
    console.error('Error generating title variants:', error);
    res.status(500).json({ error: 'Failed to generate title variants' });
  }
});

// 11. Clarify research question
app.post('/api/ai/clarify-research-question', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });
    const clarified = await geminiService.clarifyResearchQuestion(question);
    res.json({ clarified });
  } catch (error) {
    console.error('Error clarifying research question:', error);
    res.status(500).json({ error: 'Failed to clarify research question' });
  }
});

// 12. Generate reviewer response
app.post('/api/ai/generate-reviewer-response', async (req, res) => {
  try {
    const { reviewComment, yourResponse } = req.body;
    if (!reviewComment || !yourResponse) return res.status(400).json({ error: 'Review comment and your response are required' });
    const response = await geminiService.generateReviewerResponse(reviewComment, yourResponse);
    res.json({ response });
  } catch (error) {
    console.error('Error generating reviewer response:', error);
    res.status(500).json({ error: 'Failed to generate reviewer response' });
  }
});

// 13. Compress for poster
app.post('/api/ai/compress-for-poster', async (req, res) => {
  try {
    const { text, targetWords } = req.body;
    if (!text || !targetWords) return res.status(400).json({ error: 'Text and target words are required' });
    const compressed = await geminiService.compressForPoster(text, targetWords);
    res.json({ compressed });
  } catch (error) {
    console.error('Error compressing for poster:', error);
    res.status(500).json({ error: 'Failed to compress for poster' });
  }
});

// 14. Generate slide outline
app.post('/api/ai/generate-slide-outline', async (req, res) => {
  try {
    const { topic, duration } = req.body;
    if (!topic || !duration) return res.status(400).json({ error: 'Topic and duration are required' });
    const outline = await geminiService.generateSlideOutline(topic, duration);
    res.json({ outline });
  } catch (error) {
    console.error('Error generating slide outline:', error);
    res.status(500).json({ error: 'Failed to generate slide outline' });
  }
});

// 15. Soften tone
app.post('/api/ai/soften-tone', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const softened = await geminiService.softenTone(text);
    res.json({ softened });
  } catch (error) {
    console.error('Error softening tone:', error);
    res.status(500).json({ error: 'Failed to soften tone' });
  }
});

// 16. Extract key contributions
app.post('/api/ai/extract-contributions', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const contributions = await geminiService.extractKeyContributions(text);
    res.json({ contributions });
  } catch (error) {
    console.error('Error extracting contributions:', error);
    res.status(500).json({ error: 'Failed to extract contributions' });
  }
});

// 17. Generate research statement
app.post('/api/ai/generate-research-statement', async (req, res) => {
  try {
    const { background, interests, goals } = req.body;
    if (!background || !interests || !goals) return res.status(400).json({ error: 'Background, interests, and goals are required' });
    const statement = await geminiService.generateResearchStatement(background, interests, goals);
    res.json({ statement });
  } catch (error) {
    console.error('Error generating research statement:', error);
    res.status(500).json({ error: 'Failed to generate research statement' });
  }
});

// 18. Generate teaching statement
app.post('/api/ai/generate-teaching-statement', async (req, res) => {
  try {
    const { experience, philosophy, approach } = req.body;
    if (!experience || !philosophy || !approach) return res.status(400).json({ error: 'Experience, philosophy, and approach are required' });
    const statement = await geminiService.generateTeachingStatement(experience, philosophy, approach);
    res.json({ statement });
  } catch (error) {
    console.error('Error generating teaching statement:', error);
    res.status(500).json({ error: 'Failed to generate teaching statement' });
  }
});

// 19. Generate diversity statement
app.post('/api/ai/generate-diversity-statement', async (req, res) => {
  try {
    const { experiences, commitment, plans } = req.body;
    if (!experiences || !commitment || !plans) return res.status(400).json({ error: 'Experiences, commitment, and plans are required' });
    const statement = await geminiService.generateDiversityStatement(experiences, commitment, plans);
    res.json({ statement });
  } catch (error) {
    console.error('Error generating diversity statement:', error);
    res.status(500).json({ error: 'Failed to generate diversity statement' });
  }
});

// 20. Tailor CV
app.post('/api/ai/tailor-cv', async (req, res) => {
  try {
    const { cvContent, jobDescription } = req.body;
    if (!cvContent || !jobDescription) return res.status(400).json({ error: 'CV content and job description are required' });
    const recommendations = await geminiService.tailorCV(cvContent, jobDescription);
    res.json({ recommendations });
  } catch (error) {
    console.error('Error tailoring CV:', error);
    res.status(500).json({ error: 'Failed to tailor CV' });
  }
});

// 21. Extract skills
app.post('/api/ai/extract-skills', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const skills = await geminiService.extractSkills(text);
    res.json({ skills });
  } catch (error) {
    console.error('Error extracting skills:', error);
    res.status(500).json({ error: 'Failed to extract skills' });
  }
});

// 22. Summarize role
app.post('/api/ai/summarize-role', async (req, res) => {
  try {
    const { roleDescription } = req.body;
    if (!roleDescription) return res.status(400).json({ error: 'Role description is required' });
    const summary = await geminiService.summarizeRole(roleDescription);
    res.json({ summary });
  } catch (error) {
    console.error('Error summarizing role:', error);
    res.status(500).json({ error: 'Failed to summarize role' });
  }
});

// 23. Explain career gap
app.post('/api/ai/explain-career-gap', async (req, res) => {
  try {
    const { gapDetails } = req.body;
    if (!gapDetails) return res.status(400).json({ error: 'Gap details are required' });
    const explanation = await geminiService.explainCareerGap(gapDetails);
    res.json({ explanation });
  } catch (error) {
    console.error('Error explaining career gap:', error);
    res.status(500).json({ error: 'Failed to explain career gap' });
  }
});

// 24. Draft recommendation letter
app.post('/api/ai/draft-recommendation-letter', async (req, res) => {
  try {
    const { candidateInfo, relationship, position } = req.body;
    if (!candidateInfo || !relationship || !position) return res.status(400).json({ error: 'Candidate info, relationship, and position are required' });
    const letter = await geminiService.draftRecommendationLetter(candidateInfo, relationship, position);
    res.json({ letter });
  } catch (error) {
    console.error('Error drafting recommendation letter:', error);
    res.status(500).json({ error: 'Failed to draft recommendation letter' });
  }
});

// 25. Generate bio
app.post('/api/ai/generate-bio', async (req, res) => {
  try {
    const { info, length, context } = req.body;
    if (!info || !length || !context) return res.status(400).json({ error: 'Info, length, and context are required' });
    const bio = await geminiService.generateBio(info, length, context);
    res.json({ bio });
  } catch (error) {
    console.error('Error generating bio:', error);
    res.status(500).json({ error: 'Failed to generate bio' });
  }
});

// 26. Find interdisciplinary connections
app.post('/api/ai/find-interdisciplinary-connections', async (req, res) => {
  try {
    const { research1, research2 } = req.body;
    if (!research1 || !research2) return res.status(400).json({ error: 'Both research areas are required' });
    const connections = await geminiService.findInterdisciplinaryConnections(research1, research2);
    res.json({ connections });
  } catch (error) {
    console.error('Error finding interdisciplinary connections:', error);
    res.status(500).json({ error: 'Failed to find interdisciplinary connections' });
  }
});

// 27. Generate weekly summary
app.post('/api/ai/generate-weekly-summary', async (req, res) => {
  try {
    const { activities } = req.body;
    if (!activities) return res.status(400).json({ error: 'Activities are required' });
    const summary = await geminiService.generateWeeklySummary(activities);
    res.json({ summary });
  } catch (error) {
    console.error('Error generating weekly summary:', error);
    res.status(500).json({ error: 'Failed to generate weekly summary' });
  }
});

// 28. Curate reading list
app.post('/api/ai/curate-reading-list', async (req, res) => {
  try {
    const { topic, level } = req.body;
    if (!topic || !level) return res.status(400).json({ error: 'Topic and level are required' });
    const readingList = await geminiService.curateReadingList(topic, level);
    res.json({ readingList });
  } catch (error) {
    console.error('Error curating reading list:', error);
    res.status(500).json({ error: 'Failed to curate reading list' });
  }
});

// 29. Suggest references
app.post('/api/ai/suggest-references', async (req, res) => {
  try {
    const { context } = req.body;
    if (!context) return res.status(400).json({ error: 'Context is required' });
    const suggestions = await geminiService.suggestReferences(context);
    res.json({ suggestions });
  } catch (error) {
    console.error('Error suggesting references:', error);
    res.status(500).json({ error: 'Failed to suggest references' });
  }
});

// 30. Explain research trend
app.post('/api/ai/explain-research-trend', async (req, res) => {
  try {
    const { trend } = req.body;
    if (!trend) return res.status(400).json({ error: 'Trend is required' });
    const explanation = await geminiService.explainResearchTrend(trend);
    res.json({ explanation });
  } catch (error) {
    console.error('Error explaining research trend:', error);
    res.status(500).json({ error: 'Failed to explain research trend' });
  }
});

// 31. Suggest comment draft
app.post('/api/ai/suggest-comment-draft', async (req, res) => {
  try {
    const { postContent, context } = req.body;
    if (!postContent) return res.status(400).json({ error: 'Post content is required' });
    const comment = await geminiService.suggestCommentDraft(postContent, context);
    res.json({ comment });
  } catch (error) {
    console.error('Error suggesting comment draft:', error);
    res.status(500).json({ error: 'Failed to suggest comment draft' });
  }
});

// 32. Classify question
app.post('/api/ai/classify-question', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });
    const classification = await geminiService.classifyQuestion(question);
    res.json({ classification });
  } catch (error) {
    console.error('Error classifying question:', error);
    res.status(500).json({ error: 'Failed to classify question' });
  }
});

// 33. Analyze discussion health
app.post('/api/ai/analyze-discussion-health', async (req, res) => {
  try {
    const { discussionText } = req.body;
    if (!discussionText) return res.status(400).json({ error: 'Discussion text is required' });
    const analysis = await geminiService.analyzeDiscussionHealth(discussionText);
    res.json({ analysis });
  } catch (error) {
    console.error('Error analyzing discussion health:', error);
    res.status(500).json({ error: 'Failed to analyze discussion health' });
  }
});

// 34. Summarize meeting agenda
app.post('/api/ai/summarize-meeting-agenda', async (req, res) => {
  try {
    const { notes } = req.body;
    if (!notes) return res.status(400).json({ error: 'Notes are required' });
    const agenda = await geminiService.summarizeMeetingAgenda(notes);
    res.json({ agenda });
  } catch (error) {
    console.error('Error summarizing meeting agenda:', error);
    res.status(500).json({ error: 'Failed to summarize meeting agenda' });
  }
});

// 35. Generate collaboration proposal
app.post('/api/ai/generate-collaboration-proposal', async (req, res) => {
  try {
    const { topic, partner, goal } = req.body;
    if (!topic || !partner || !goal) return res.status(400).json({ error: 'Topic, partner, and goal are required' });
    const proposal = await geminiService.generateCollaborationProposal(topic, partner, goal);
    res.json({ proposal });
  } catch (error) {
    console.error('Error generating collaboration proposal:', error);
    res.status(500).json({ error: 'Failed to generate collaboration proposal' });
  }
});

// 36. Explain for expertise level
app.post('/api/ai/explain-for-expertise-level', async (req, res) => {
  try {
    const { content, level } = req.body;
    if (!content || !level) return res.status(400).json({ error: 'Content and level are required' });
    const explanation = await geminiService.explainForExpertiseLevel(content, level);
    res.json({ explanation });
  } catch (error) {
    console.error('Error explaining for expertise level:', error);
    res.status(500).json({ error: 'Failed to explain for expertise level' });
  }
});

// 37. Structure review feedback
app.post('/api/ai/structure-review-feedback', async (req, res) => {
  try {
    const { feedback } = req.body;
    if (!feedback) return res.status(400).json({ error: 'Feedback is required' });
    const structured = await geminiService.structureReviewFeedback(feedback);
    res.json({ structured });
  } catch (error) {
    console.error('Error structuring review feedback:', error);
    res.status(500).json({ error: 'Failed to structure review feedback' });
  }
});

// 38. Generate self-review checklist
app.post('/api/ai/generate-self-review-checklist', async (req, res) => {
  try {
    const { paperType } = req.body;
    if (!paperType) return res.status(400).json({ error: 'Paper type is required' });
    const checklist = await geminiService.generateSelfReviewChecklist(paperType);
    res.json({ checklist });
  } catch (error) {
    console.error('Error generating self-review checklist:', error);
    res.status(500).json({ error: 'Failed to generate self-review checklist' });
  }
});

// 39. Generate interview Q&A
app.post('/api/ai/generate-interview-qa', async (req, res) => {
  try {
    const { topic, role } = req.body;
    if (!topic || !role) return res.status(400).json({ error: 'Topic and role are required' });
    const qa = await geminiService.generateInterviewQA(topic, role);
    res.json({ qa });
  } catch (error) {
    console.error('Error generating interview Q&A:', error);
    res.status(500).json({ error: 'Failed to generate interview Q&A' });
  }
});

// 40. Describe visual
app.post('/api/ai/describe-visual', async (req, res) => {
  try {
    const { visualDescription } = req.body;
    if (!visualDescription) return res.status(400).json({ error: 'Visual description is required' });
    const description = await geminiService.describeVisual(visualDescription);
    res.json({ description });
  } catch (error) {
    console.error('Error describing visual:', error);
    res.status(500).json({ error: 'Failed to describe visual' });
  }
});

// 41. Interpret results
app.post('/api/ai/interpret-results', async (req, res) => {
  try {
    const { data, context } = req.body;
    if (!data || !context) return res.status(400).json({ error: 'Data and context are required' });
    const interpretation = await geminiService.interpretResults(data, context);
    res.json({ interpretation });
  } catch (error) {
    console.error('Error interpreting results:', error);
    res.status(500).json({ error: 'Failed to interpret results' });
  }
});

// 42. Format statistical results
app.post('/api/ai/format-statistical-results', async (req, res) => {
  try {
    const { results, testType } = req.body;
    if (!results || !testType) return res.status(400).json({ error: 'Results and test type are required' });
    const formatted = await geminiService.formatStatisticalResults(results, testType);
    res.json({ formatted });
  } catch (error) {
    console.error('Error formatting statistical results:', error);
    res.status(500).json({ error: 'Failed to format statistical results' });
  }
});

// 43. Summarize code of conduct
app.post('/api/ai/summarize-code-of-conduct', async (req, res) => {
  try {
    const { fullText } = req.body;
    if (!fullText) return res.status(400).json({ error: 'Full text is required' });
    const summary = await geminiService.summarizeCodeOfConduct(fullText);
    res.json({ summary });
  } catch (error) {
    console.error('Error summarizing code of conduct:', error);
    res.status(500).json({ error: 'Failed to summarize code of conduct' });
  }
});

// 44. Generate onboarding guide
app.post('/api/ai/generate-onboarding-guide', async (req, res) => {
  try {
    const { role, institution } = req.body;
    if (!role || !institution) return res.status(400).json({ error: 'Role and institution are required' });
    const guide = await geminiService.generateOnboardingGuide(role, institution);
    res.json({ guide });
  } catch (error) {
    console.error('Error generating onboarding guide:', error);
    res.status(500).json({ error: 'Failed to generate onboarding guide' });
  }
});

// 45. Draft lab manifesto
app.post('/api/ai/draft-lab-manifesto', async (req, res) => {
  try {
    const { values, goals, culture } = req.body;
    if (!values || !goals || !culture) return res.status(400).json({ error: 'Values, goals, and culture are required' });
    const manifesto = await geminiService.draftLabManifesto(values, goals, culture);
    res.json({ manifesto });
  } catch (error) {
    console.error('Error drafting lab manifesto:', error);
    res.status(500).json({ error: 'Failed to draft lab manifesto' });
  }
});

// 46. Generate event description
app.post('/api/ai/generate-event-description', async (req, res) => {
  try {
    const { eventDetails } = req.body;
    if (!eventDetails) return res.status(400).json({ error: 'Event details are required' });
    const description = await geminiService.generateEventDescription(eventDetails);
    res.json({ description });
  } catch (error) {
    console.error('Error generating event description:', error);
    res.status(500).json({ error: 'Failed to generate event description' });
  }
});

// 47. Translate to second language
app.post('/api/ai/translate-to-second-language', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) return res.status(400).json({ error: 'Text and target language are required' });
    const translation = await geminiService.translateToSecondLanguage(text, targetLanguage);
    res.json({ translation });
  } catch (error) {
    console.error('Error translating to second language:', error);
    res.status(500).json({ error: 'Failed to translate to second language' });
  }
});

// 48. Align terminology
app.post('/api/ai/align-terminology', async (req, res) => {
  try {
    const { text, targetField } = req.body;
    if (!text || !targetField) return res.status(400).json({ error: 'Text and target field are required' });
    const aligned = await geminiService.alignTerminology(text, targetField);
    res.json({ aligned });
  } catch (error) {
    console.error('Error aligning terminology:', error);
    res.status(500).json({ error: 'Failed to align terminology' });
  }
});

// 49. Adjust tone
app.post('/api/ai/adjust-tone', async (req, res) => {
  try {
    const { text, targetTone } = req.body;
    if (!text || !targetTone) return res.status(400).json({ error: 'Text and target tone are required' });
    const adjusted = await geminiService.adjustTone(text, targetTone);
    res.json({ adjusted });
  } catch (error) {
    console.error('Error adjusting tone:', error);
    res.status(500).json({ error: 'Failed to adjust tone' });
  }
});

// 50. Prioritize notifications
app.post('/api/ai/prioritize-notifications', async (req, res) => {
  try {
    const { notifications } = req.body;
    if (!notifications) return res.status(400).json({ error: 'Notifications are required' });
    const prioritized = await geminiService.prioritizeNotifications(notifications);
    res.json({ prioritized });
  } catch (error) {
    console.error('Error prioritizing notifications:', error);
    res.status(500).json({ error: 'Failed to prioritize notifications' });
  }
});

// 51. Review grant proposal
app.post('/api/ai/review-grant-proposal', async (req, res) => {
  try {
    const { proposal, grantType } = req.body;
    if (!proposal || !grantType) return res.status(400).json({ error: 'Proposal and grant type are required' });
    const review = await geminiService.reviewGrantProposal(proposal, grantType);
    res.json({ review });
  } catch (error) {
    console.error('Error reviewing grant proposal:', error);
    res.status(500).json({ error: 'Failed to review grant proposal' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Nitor AI Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

# NITOR AI Service Documentation

**Version:** 1.0.0
**AI Model:** Google Gemini 2.5 Pro
**Base URL:** `http://localhost:3001/api/ai`

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Integration Guide](#integration-guide)
- [Best Practices](#best-practices)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)

---

## Overview

The NITOR AI Service provides 51+ AI-powered features specifically designed for academic writing, research management, and professional development. Powered by Google Gemini 2.5 Pro, the service offers state-of-the-art natural language processing capabilities tailored to the needs of researchers and academics.

### Key Capabilities

- **Academic Writing Enhancement**: Improve clarity, conciseness, and academic tone
- **Content Generation**: Generate abstracts, summaries, and statements
- **Research Assistance**: Citation detection, argument checking, methods improvement
- **Career Development**: CV tailoring, bio enhancement, recommendation letters
- **Collaboration Tools**: Meeting summaries, proposal generation, comment suggestions

---

## Features

### 1. Writing Enhancement (Core Features)

#### 1.1 Text Refinement
**Endpoint:** `POST /api/ai/refine-text`

Improves clarity, conciseness, and academic tone while preserving LaTeX formulas.

**Request:**
```json
{
  "text": "This study investigates the impact of machine learning algorithms on data processing efficiency."
}
```

**Response:**
```json
{
  "refinedText": "This research examines how machine learning algorithms enhance data processing efficiency."
}
```

#### 1.2 Abstract Generation
**Endpoint:** `POST /api/ai/generate-abstract`

Creates structured abstracts (150-250 words) from paper content.

**Request:**
```json
{
  "title": "Novel Approach to Neural Network Optimization",
  "notes": "Key findings about improved gradient descent methods..."
}
```

**Response:**
```json
{
  "abstract": "This paper presents a novel approach to neural network optimization..."
}
```

#### 1.3 Bio Enhancement
**Endpoint:** `POST /api/ai/enhance-bio`

Optimizes professional biographies for different contexts.

**Request:**
```json
{
  "text": "Researcher at MIT working on AI",
  "context": "bio"
}
```

**Response:**
```json
{
  "enhancedText": "Distinguished researcher at MIT, specializing in artificial intelligence and machine learning..."
}
```

---

### 2. Content Analysis (Quality Features)

#### 2.1 Plain Language Summary
**Endpoint:** `POST /api/ai/plain-language-summary`

Converts academic text into accessible language for general audiences.

**Use Cases:**
- Public engagement
- Grant proposals for non-experts
- Media outreach
- Science communication

#### 2.2 Multi-Level Summaries
**Endpoint:** `POST /api/ai/multi-level-summary`

Generates summaries at different lengths:
- **One-sentence**: Max 30 words
- **Short**: 50-100 words
- **Medium**: 150-250 words
- **Long**: 300-500 words

**Request:**
```json
{
  "text": "Full paper content...",
  "level": "short"
}
```

#### 2.3 Article Skeleton Extraction
**Endpoint:** `POST /api/ai/extract-skeleton`

Structures content into standard sections:
- Introduction
- Methods
- Findings
- Discussion

#### 2.4 Argument Consistency Checking
**Endpoint:** `POST /api/ai/check-consistency`

Analyzes logical consistency and identifies:
- Contradictions
- Gaps in reasoning
- Unclear arguments

#### 2.5 Repetitive Sentence Detection
**Endpoint:** `POST /api/ai/detect-repetition`

Identifies redundant content and suggests consolidations.

#### 2.6 Citation Needed Detection
**Endpoint:** `POST /api/ai/detect-citation-needed`

Flags statements requiring supporting evidence or references.

---

### 3. Research Enhancement (Methodology Features)

#### 3.1 Methods Clarity Assistant
**Endpoint:** `POST /api/ai/improve-methods`

Improves reproducibility and clarity of methodology sections.

**Benefits:**
- Clear step-by-step procedures
- Logical ordering
- Complete parameter specifications

#### 3.2 Limitations Suggestions
**Endpoint:** `POST /api/ai/suggest-limitations`

Suggests potential limitations to discuss:
- Methodological limitations
- Sample size constraints
- Scope restrictions
- Generalizability concerns

#### 3.3 Figure/Table Caption Writer
**Endpoint:** `POST /api/ai/generate-caption`

Creates professional academic captions for visuals.

**Request:**
```json
{
  "description": "Bar chart showing performance across 5 algorithms",
  "type": "figure"
}
```

#### 3.4 Research Question Clarification
**Endpoint:** `POST /api/ai/clarify-research-question`

Refines research questions to be:
- More specific
- Measurable
- Academically rigorous

---

### 4. Publication Support (Communication Features)

#### 4.1 Title Variants Generator
**Endpoint:** `POST /api/ai/generate-title-variants`

Generates titles for different audiences:
- Academic journals
- General public
- Press releases
- Social media
- Conferences

#### 4.2 Reviewer Response Generator
**Endpoint:** `POST /api/ai/generate-reviewer-response`

Creates professional peer review responses.

**Request:**
```json
{
  "reviewComment": "The methodology section lacks clarity...",
  "yourResponse": "We have revised the methods section to include..."
}
```

#### 4.3 Poster Text Compression
**Endpoint:** `POST /api/ai/compress-for-poster`

Compresses text to fit poster constraints while maintaining key findings.

**Request:**
```json
{
  "text": "Full abstract or section text...",
  "targetWords": 150
}
```

#### 4.4 Presentation Slide Outline
**Endpoint:** `POST /api/ai/generate-slide-outline`

Creates presentation outlines with:
- Slide titles
- Key bullet points
- Suggested timing

**Request:**
```json
{
  "topic": "Novel Approach to Neural Networks",
  "duration": 20
}
```

#### 4.5 Tone Softening
**Endpoint:** `POST /api/ai/soften-tone`

Rewrites text with diplomatic tone while maintaining message.

#### 4.6 Key Contributions List
**Endpoint:** `POST /api/ai/extract-contributions`

Extracts and lists 3-5 main contributions clearly.

---

### 5. Career Development (Professional Features)

#### 5.1 Research Statement Generator
**Endpoint:** `POST /api/ai/generate-research-statement`

Creates 500-750 word research statements for academic job applications.

**Request:**
```json
{
  "background": "Ph.D. in Computer Science, focus on AI...",
  "interests": "Machine learning, neural networks...",
  "goals": "Establish research lab, publish in top venues..."
}
```

#### 5.2 Teaching Statement Generator
**Endpoint:** `POST /api/ai/generate-teaching-statement`

Generates teaching philosophy statements with specific examples.

#### 5.3 Diversity Statement Generator
**Endpoint:** `POST /api/ai/generate-diversity-statement`

Creates DEI statements following best practices.

#### 5.4 CV Tailoring
**Endpoint:** `POST /api/ai/tailor-cv`

Provides recommendations for customizing CV to specific positions.

#### 5.5 Skill Extraction
**Endpoint:** `POST /api/ai/extract-skills`

Categorizes skills from text:
- Technical skills
- Methodological skills
- Soft skills

#### 5.6 Role Summaries
**Endpoint:** `POST /api/ai/summarize-role`

Creates concise, impactful role summaries (2-3 sentences) for CVs.

#### 5.7 Career Gap Explanations
**Endpoint:** `POST /api/ai/explain-career-gap`

Frames career gaps constructively.

#### 5.8 Recommendation Letter Drafts
**Endpoint:** `POST /api/ai/draft-recommendation-letter`

Generates academic recommendation letters.

**Request:**
```json
{
  "candidateInfo": "Ph.D. student, excellent researcher...",
  "relationship": "Ph.D. advisor",
  "position": "Postdoctoral position at Stanford"
}
```

#### 5.9 Professional Bio Models
**Endpoint:** `POST /api/ai/generate-bio`

Creates bios for different contexts and lengths.

---

### 6. Collaboration Tools (Social Features)

#### 6.1 Weekly Summaries
**Endpoint:** `POST /api/ai/generate-weekly-summary`

Creates research progress summaries highlighting:
- Progress made
- Challenges encountered
- Next steps

#### 6.2 Meeting Agenda Summaries
**Endpoint:** `POST /api/ai/summarize-meeting-agenda`

Structures meeting notes into organized agendas.

#### 6.3 Collaboration Proposal Generator
**Endpoint:** `POST /api/ai/generate-collaboration-proposal`

Creates professional collaboration emails.

**Request:**
```json
{
  "topic": "Joint research on neural networks",
  "partner": "Dr. Smith at Stanford",
  "goal": "Co-author paper for NeurIPS"
}
```

#### 6.4 Comment Draft Suggestions
**Endpoint:** `POST /api/ai/suggest-comment-draft`

Generates thoughtful, professional comments for posts.

#### 6.5 Discussion Health Analysis
**Endpoint:** `POST /api/ai/analyze-discussion-health`

Analyzes discussion quality and identifies concerns.

---

### 7. Research Discovery (Knowledge Features)

#### 7.1 Interdisciplinary Connections
**Endpoint:** `POST /api/ai/find-interdisciplinary-connections`

Identifies connections between research areas.

#### 7.2 Reading List Curation
**Endpoint:** `POST /api/ai/curate-reading-list`

Suggests curated reading lists by topic and level.

#### 7.3 Reference Suggestions
**Endpoint:** `POST /api/ai/suggest-references`

Recommends types of references to strengthen work.

#### 7.4 Trend Explanations
**Endpoint:** `POST /api/ai/explain-research-trend`

Explains current research trends and their importance.

#### 7.5 Question Classification
**Endpoint:** `POST /api/ai/classify-question`

Classifies research questions and suggests methodologies.

---

### 8. Content Adaptation (Translation Features)

#### 8.1 Expertise Level Adaptation
**Endpoint:** `POST /api/ai/explain-for-expertise-level`

Adjusts content for different audience levels:
- Undergraduate
- Graduate
- Expert
- Public

#### 8.2 Bilingual Translation
**Endpoint:** `POST /api/ai/translate-to-second-language`

Translates academic text maintaining technical accuracy.

#### 8.3 Terminology Alignment
**Endpoint:** `POST /api/ai/align-terminology`

Adjusts terminology to match field conventions.

#### 8.4 Tone Adjustment
**Endpoint:** `POST /api/ai/adjust-tone`

Rewrites with specified tone:
- Formal
- Conversational
- Enthusiastic
- Cautious

---

### 9. Review & Quality (Assessment Features)

#### 9.1 Peer Review Feedback Structuring
**Endpoint:** `POST /api/ai/structure-review-feedback`

Organizes feedback into categories:
- Major concerns
- Minor issues
- Suggestions
- Strengths

#### 9.2 Self-Review Checklists
**Endpoint:** `POST /api/ai/generate-self-review-checklist`

Creates comprehensive review checklists by paper type.

#### 9.3 Interview Q&A Generation
**Endpoint:** `POST /api/ai/generate-interview-qa`

Generates interview questions and answers for academic positions.

#### 9.4 Result Interpretation Variants
**Endpoint:** `POST /api/ai/interpret-results`

Provides multiple interpretations:
- Conservative
- Moderate
- Bold

#### 9.5 Statistical Reporting Templates
**Endpoint:** `POST /api/ai/format-statistical-results`

Formats results according to APA style.

---

### 10. Platform Management (Utility Features)

#### 10.1 Visual Descriptions
**Endpoint:** `POST /api/ai/describe-visual`

Creates accessible descriptions for figures/tables.

#### 10.2 Code of Conduct Summaries
**Endpoint:** `POST /api/ai/summarize-code-of-conduct`

Summarizes conduct documents with key points.

#### 10.3 Onboarding Guides
**Endpoint:** `POST /api/ai/generate-onboarding-guide`

Creates onboarding guides for new roles.

#### 10.4 Lab Manifesto Drafts
**Endpoint:** `POST /api/ai/draft-lab-manifesto`

Generates inspiring lab mission statements.

#### 10.5 Event Descriptions
**Endpoint:** `POST /api/ai/generate-event-description`

Creates engaging event descriptions.

#### 10.6 Notification Prioritization
**Endpoint:** `POST /api/ai/prioritize-notifications`

Analyzes and prioritizes notifications by importance.

#### 10.7 Grant Proposal Review
**Endpoint:** `POST /api/ai/review-grant-proposal`

Reviews grant proposals for clarity, impact, and feasibility.

---

## Integration Guide

### JavaScript/React Integration

```javascript
import axios from 'axios';

const aiService = axios.create({
  baseURL: 'http://localhost:3001/api/ai',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Refine text example
async function refineText(text) {
  try {
    const response = await aiService.post('/refine-text', { text });
    return response.data.refinedText;
  } catch (error) {
    console.error('AI service error:', error);
    throw error;
  }
}

// Generate abstract example
async function generateAbstract(title, notes) {
  try {
    const response = await aiService.post('/generate-abstract', {
      title,
      notes
    });
    return response.data.abstract;
  } catch (error) {
    console.error('AI service error:', error);
    throw error;
  }
}
```

### Python Integration

```python
import requests

class NitorAIService:
    def __init__(self, base_url='http://localhost:3001/api/ai'):
        self.base_url = base_url

    def refine_text(self, text):
        response = requests.post(
            f'{self.base_url}/refine-text',
            json={'text': text}
        )
        return response.json()['refinedText']

    def generate_abstract(self, title, notes):
        response = requests.post(
            f'{self.base_url}/generate-abstract',
            json={'title': title, 'notes': notes}
        )
        return response.json()['abstract']

# Usage
ai = NitorAIService()
refined = ai.refine_text("Your draft text...")
```

---

## Best Practices

### 1. Input Quality

- **Provide Context**: Include relevant context for better results
- **Clear Instructions**: Be specific about desired output
- **Appropriate Length**: Don't exceed reasonable input lengths
- **LaTeX Preservation**: AI preserves LaTeX formulas in text refinement

### 2. Error Handling

```javascript
try {
  const result = await aiService.post('/refine-text', { text });
  return result.data;
} catch (error) {
  if (error.response?.status === 429) {
    // Rate limit exceeded
    console.log('Rate limit reached, try again later');
  } else if (error.response?.status === 500) {
    // AI service error
    console.log('AI service temporarily unavailable');
  }
  throw error;
}
```

### 3. Response Validation

Always validate AI-generated content before use:
- Check for completeness
- Verify accuracy of facts
- Review tone and style
- Ensure LaTeX formulas are preserved

### 4. User Feedback

Implement feedback mechanisms:
- Allow users to rate AI suggestions
- Provide "regenerate" option
- Enable manual editing of AI output

---

## Rate Limiting

### Limits

| User Type | Requests per Minute | Requests per Hour |
|-----------|---------------------|-------------------|
| Free | 10 | 100 |
| Premium | 30 | 500 |
| Enterprise | Unlimited | Unlimited |

### Rate Limit Headers

```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1640000000
```

---

## Error Handling

### Error Response Format

```json
{
  "error": "Failed to generate text",
  "message": "Input text exceeds maximum length",
  "statusCode": 400
}
```

### Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Bad Request | Check input parameters |
| 429 | Rate Limit | Wait before retrying |
| 500 | Server Error | Retry with exponential backoff |
| 503 | Service Unavailable | AI model temporarily down |

---

## Performance

### Response Times

| Feature Type | Average Response | Max Response |
|--------------|------------------|--------------|
| Text Refinement | 2-4 seconds | 10 seconds |
| Abstract Generation | 3-5 seconds | 15 seconds |
| Long Form (Statements) | 5-10 seconds | 30 seconds |

### Optimization Tips

1. **Batch Requests**: Group similar operations when possible
2. **Caching**: Cache frequently requested content
3. **Async Processing**: Use async/await for non-blocking operations
4. **Timeouts**: Set appropriate timeout values (30s recommended)

---

## Support

For AI service support:

- **Documentation**: [https://docs.nitor.io/ai-service](https://docs.nitor.io/ai-service)
- **Email**: ai-support@nitor.io
- **GitHub Issues**: [https://github.com/olaflaitinen/nitor/issues](https://github.com/olaflaitinen/nitor/issues)

---

**NITOR AI Service v1.0.0** • Powered by Google Gemini 2.5 Pro • [Back to Documentation](../README.md)

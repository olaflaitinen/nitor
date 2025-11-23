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

// AI Endpoints
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

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Nitor AI Service running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});

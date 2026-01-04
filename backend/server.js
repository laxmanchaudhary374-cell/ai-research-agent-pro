// backend/server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// OpenRouter API endpoint (FREE!)
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY;

// CORS configuration - MUST come FIRST
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Body parser - MUST come AFTER CORS
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    api: 'OpenRouter (Free!)'
  });
});

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  console.log('=== Received Request ===');
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages required' });
    }

    if (!API_KEY) {
      return res.status(500).json({ 
        error: 'API key not configured. Please add OPENROUTER_API_KEY to environment variables' 
      });
    }

    // Prepare messages for OpenRouter
    const apiMessages = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    // Add system message
    apiMessages.unshift({
      role: 'system',
      content: 'You are an advanced AI Research Agent. You help with research, document analysis, code generation, and more. Be helpful, thorough, and professional.'
    });

    console.log('Calling OpenRouter API...');

    // Call OpenRouter API
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'google/gemini-2.0-flash-exp:free',
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
          'X-Title': 'AI Research Agent'
        }
      }
    );

    const assistantMessage = response.data.choices[0].message.content;

    console.log('OpenRouter Response received!');

    res.json({
      response: assistantMessage,
      timestamp: new Date().toISOString(),
      model: 'Gemini 2.0 Flash (Free)',
      provider: 'OpenRouter'
    });

  } catch (error) {
    console.error('=== ERROR ===');
    console.error('Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key. Check your OpenRouter API key.' 
      });
    }
    
    if (error.response?.status === 402) {
      return res.status(402).json({ 
        error: 'No credits remaining. Please add credits to your OpenRouter account.' 
      });
    }

    res.status(500).json({ 
      error: 'Server error',
      details: error.response?.data?.error || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🚀 AI Research Agent (FREE Version)  ║
║  📡 Server: http://localhost:${PORT}    ║
║  🤖 Model: Gemini 2.0 Flash (Free)    ║
║  ✅ Status: Ready!                     ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;

  

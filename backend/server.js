
  
// backend/server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Groq API Configuration (FREE!)
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_KEY = process.env.GROQ_API_KEY;

// CORS configuration
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

// Body parser
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    api: 'Groq (100% Free!)'
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
        error: 'API key not configured. Please add GROQ_API_KEY to environment variables' 
      });
    }

    // Prepare messages
    const apiMessages = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    // Add system message
    apiMessages.unshift({
      role: 'system',
      content: 'You are an advanced AI Research Agent. You help with research, document analysis, code generation, and more. Be helpful, thorough, and professional.'
    });

    console.log('Calling Groq API...');

    // Call Groq API
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.3-70b-versatile', // FREE and FAST!
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const assistantMessage = response.data.choices[0].message.content;

    console.log('✅ Groq Response received!');

    res.json({
      response: assistantMessage,
      timestamp: new Date().toISOString(),
      model: 'Llama 3.3 70B (Free)',
      provider: 'Groq'
    });

  } catch (error) {
    console.error('=== ERROR ===');
    console.error('Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid Groq API key. Check your key at console.groq.com' 
      });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please wait a moment and try again.' 
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
║  🤖 Model: Llama 3.3 70B (Groq)       ║
║  ✅ Status: Ready!                     ║
║  💯 Cost: $0 (100% FREE!)             ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;

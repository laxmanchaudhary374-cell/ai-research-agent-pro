import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Brain, Sparkles, Moon, Sun, Trash2, Download, Copy, Check, BarChart3, Zap } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AIResearchAgent() {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: '🚀 **Welcome to AI Research Agent Pro!**\n\nBuilt with cutting-edge technology:\n- ⚡ Real-time AI responses\n- 🎨 Beautiful modern UI\n- 💾 Export conversations\n- 📱 Mobile responsive\n- 🌓 Dark mode support\n\n**Try asking me anything!**',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ messages: 0, words: 0, time: 0 });
  const [showStats, setShowStats] = useState(false);
  const messagesEndRef = useRef(null);
  const startTime = useRef(Date.now());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update stats
  useEffect(() => {
    const totalWords = messages.reduce((sum, msg) => 
      sum + msg.content.split(' ').length, 0
    );
    const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
    setStats({
      messages: messages.length,
      words: totalWords,
      time: timeSpent
    });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    const newUserMessage = { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        messages: [
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: userMessage }
        ]
      }, {
        timeout: 30000
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.response,
        timestamp: new Date().toISOString(),
        model: response.data.model
      }]);
    } catch (err) {
      console.error('Error:', err);
      
      let errorMessage = '❌ **Connection Error**\n\n';
      
      if (err.code === 'ECONNREFUSED') {
        errorMessage += '🔴 Backend server is not running.\n\n**Quick Fix:**\n1. Open terminal\n2. Navigate to backend folder\n3. Run: npm run dev';
      } else if (err.response?.status === 429) {
        errorMessage += '⏳ Rate limit reached. Please wait a moment and try again.';
      } else {
        errorMessage += 'Something went wrong. Please try again!';
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Copy message
  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export conversation
  const exportChat = (format = 'txt') => {
    const date = new Date().toISOString().split('T')[0];
    let content = '';
    
    if (format === 'txt') {
      content = `AI Research Agent - Conversation Export\nDate: ${date}\n\n`;
      messages.forEach((msg, idx) => {
        content += `${msg.role === 'user' ? '👤 You' : '🤖 AI'} (${new Date(msg.timestamp).toLocaleTimeString()}):\n${msg.content}\n\n${'='.repeat(60)}\n\n`;
      });
    } else if (format === 'json') {
      content = JSON.stringify({ 
        exportDate: date, 
        messages,
        stats 
      }, null, 2);
    } else if (format === 'md') {
      content = `# AI Research Agent - Conversation\n\n**Date:** ${date}\n\n`;
      messages.forEach(msg => {
        content += `## ${msg.role === 'user' ? '👤 You' : '🤖 AI Assistant'}\n\n${msg.content}\n\n---\n\n`;
      });
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-${date}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    if (confirm('🗑️ Clear entire conversation? This cannot be undone.')) {
      setMessages([{
        role: 'assistant',
        content: '👋 Fresh start! How can I help you today?',
        timestamp: new Date().toISOString()
      }]);
      startTime.current = Date.now();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50';
  const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-indigo-100';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-800';

  return (
    <div className={`flex flex-col h-screen ${bgClass} transition-colors`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="w-8 h-8 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Research Agent Pro</h1>
              <p className="text-xs text-indigo-100">Built by [Your Name] • Portfolio Project</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="hidden sm:flex items-center gap-1 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              title="Stats"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="relative group">
              <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
                <Download className="w-5 h-5" />
              </button>
              <div className="absolute right-0 top-12 hidden group-hover:block bg-white rounded-lg shadow-xl p-2 min-w-[120px] z-50">
                <button onClick={() => exportChat('txt')} className="w-full text-left px-3 py-2 hover:bg-indigo-50 rounded text-gray-700 text-sm">📄 Text</button>
                <button onClick={() => exportChat('md')} className="w-full text-left px-3 py-2 hover:bg-indigo-50 rounded text-gray-700 text-sm">📝 Markdown</button>
                <button onClick={() => exportChat('json')} className="w-full text-left px-3 py-2 hover:bg-indigo-50 rounded text-gray-700 text-sm">💾 JSON</button>
              </div>
            </div>
            
            <button
              onClick={clearChat}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              title="Clear Chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        {showStats && (
          <div className="max-w-6xl mx-auto mt-3 flex gap-4 text-xs bg-white/10 rounded-lg p-2 backdrop-blur-sm">
            <div className="flex items-center gap-1">
              💬 <span>{stats.messages} messages</span>
            </div>
            <div className="flex items-center gap-1">
              📝 <span>{stats.words} words</span>
            </div>
            <div className="flex items-center gap-1">
              ⏱️ <span>{formatTime(stats.time)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-6xl w-full mx-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-lg relative ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                  : `${cardBg} border-2`
              }`}
            >
              {msg.role === 'assistant' && (
                <div className={`flex items-center justify-between mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    <span className="text-sm font-bold">AI Assistant</span>
                    {msg.model && <span className="text-xs opacity-70">• {msg.model}</span>}
                  </div>
                  <button
                    onClick={() => copyMessage(msg.content)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-indigo-100 rounded"
                    title="Copy"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed prose prose-sm max-w-none">
                {msg.content}
              </div>
              <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-indigo-200' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className={`rounded-2xl px-5 py-4 shadow-lg border-2 ${cardBg}`}>
              <div className="flex items-center gap-3">
                <Loader2 className={`w-5 h-5 animate-spin ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <span className={textClass}>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`border-t-2 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-indigo-200 bg-white'} p-4 shadow-2xl`}>
        <div className="max-w-6xl mx-auto">
          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2 mb-3">
            <button 
              onClick={() => setInput('Explain quantum computing in simple terms')}
              className={`text-xs px-3 py-1.5 rounded-full transition ${darkMode ? 'bg-indigo-900 hover:bg-indigo-800 text-indigo-300' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'}`}
            >
              🧠 Science
            </button>
            <button 
              onClick={() => setInput('Write a Python function to sort a list')}
              className={`text-xs px-3 py-1.5 rounded-full transition ${darkMode ? 'bg-purple-900 hover:bg-purple-800 text-purple-300' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}
            >
              💻 Code
            </button>
            <button 
              onClick={() => setInput('Give me career advice for web development')}
              className={`text-xs px-3 py-1.5 rounded-full transition ${darkMode ? 'bg-pink-900 hover:bg-pink-800 text-pink-300' : 'bg-pink-100 hover:bg-pink-200 text-pink-700'}`}
            >
              💼 Career
            </button>
            <button 
              onClick={() => setInput('What are the latest trends in AI?')}
              className={`text-xs px-3 py-1.5 rounded-full transition ${darkMode ? 'bg-green-900 hover:bg-green-800 text-green-300' : 'bg-green-100 hover:bg-green-200 text-green-700'}`}
            >
              🚀 Trends
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything... (Press Enter to send)"
              className={`flex-1 rounded-full px-6 py-3 focus:outline-none focus:ring-2 transition ${
                darkMode 
                  ? 'bg-gray-700 text-gray-100 border-2 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/50' 
                  : 'bg-white text-gray-800 border-2 border-indigo-300 focus:border-indigo-600 focus:ring-indigo-200'
              }`}
              disabled={isLoading}
            />

            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-4 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className={`mt-2 text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            ⌨️ Enter to send • Shift+Enter for new line • Built with React + OpenRouter AI
          </div>
        </div>
      </div>
    </div>
  );
}
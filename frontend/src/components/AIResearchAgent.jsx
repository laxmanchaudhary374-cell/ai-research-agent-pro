import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Send, Moon, Sun, Download, Save, Mic, Upload, 
  Copy, Trash2, FileText, MessageSquare, Plus, History,
  Settings, Code, Play, ThumbsUp, ThumbsDown, Brain,
  Lightbulb, Zap, Search, Book, Globe, CheckCircle,
  XCircle, Loader, ChevronDown, ChevronUp, User,
  Bot, Sparkles, FileCode, Image as ImageIcon
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AIResearchAgent = () => {
  // Core States
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 **Welcome to AI Research Agent Pro v2.0!**\n\n🚀 **New Features:**\n- 🧠 Visible thinking process\n- 🎭 Multiple AI personas\n- 👍 Feedback system\n- 📊 Token usage tracking\n- 🔍 Web search integration\n- 💻 Code execution\n- 📁 File analysis\n- 🎨 Artifacts preview\n\nHow can I assist you today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  // Advanced Features States
  const [showSidebar, setShowSidebar] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [streamingText, setStreamingText] = useState('');
  const [showThinking, setShowThinking] = useState(true);
  const [thinkingProcess, setThinkingProcess] = useState('');
  const [persona, setPersona] = useState('researcher');
  const [showSettings, setShowSettings] = useState(false);
  const [showArtifacts, setShowArtifacts] = useState(false);
  const [artifacts, setArtifacts] = useState([]);
  const [tokenCount, setTokenCount] = useState({ input: 0, output: 0 });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Persona configurations
  const personas = {
    researcher: {
      name: 'Research Assistant',
      icon: '📚',
      description: 'Detailed, well-sourced answers',
      color: 'blue'
    },
    coder: {
      name: 'Expert Programmer',
      icon: '💻',
      description: 'Clean code with examples',
      color: 'green'
    },
    creative: {
      name: 'Creative Thinker',
      icon: '🎨',
      description: 'Imaginative and unique ideas',
      color: 'purple'
    },
    analyst: {
      name: 'Data Analyst',
      icon: '📊',
      description: 'Logical, step-by-step analysis',
      color: 'orange'
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, thinkingProcess]);

  // Load conversations
  useEffect(() => {
    const saved = localStorage.getItem('conversations_v2');
    if (saved) {
      setConversations(JSON.parse(saved));
    }
  }, []);

  // Save conversation
  const saveConversation = () => {
    const conversation = {
      id: currentConversationId || Date.now().toString(),
      title: messages[1]?.content.substring(0, 40) + '...' || 'New Chat',
      messages: messages,
      persona: persona,
      timestamp: new Date().toISOString()
    };

    const updated = conversations.filter(c => c.id !== conversation.id);
    updated.unshift(conversation);
    setConversations(updated);
    localStorage.setItem('conversations_v2', JSON.stringify(updated));
    setCurrentConversationId(conversation.id);
  };

  // Load conversation
  const loadConversation = (id) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setMessages(conversation.messages);
      setPersona(conversation.persona || 'researcher');
      setCurrentConversationId(id);
      setShowSidebar(false);
    }
  };

  // Delete conversation
  const deleteConversation = (id) => {
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    localStorage.setItem('conversations_v2', JSON.stringify(updated));
    if (currentConversationId === id) {
      startNewChat();
    }
  };

  // Start new chat
  const startNewChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: '👋 **Welcome back!**\n\nHow can I help you today?',
        timestamp: new Date().toISOString()
      }
    ]);
    setCurrentConversationId(null);
    setUploadedFiles([]);
    setArtifacts([]);
  };

  // Extract code blocks as artifacts
  const extractArtifacts = (text) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const matches = [];
    let match;
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
      matches.push({
        language: match[1] || 'text',
        code: match[2],
        id: Date.now() + matches.length
      });
    }
    
    if (matches.length > 0) {
      setArtifacts(prev => [...prev, ...matches]);
      setShowArtifacts(true);
    }
  };

  // Simulate thinking process
  const simulateThinking = async (query) => {
    if (!showThinking) return;

    const steps = [
      '🔍 Analyzing your question...',
      '🧠 Breaking down the problem...',
      '📚 Searching knowledge base...',
      '🤔 Formulating response...',
      '✅ Ready to respond!'
    ];

    for (let step of steps) {
      setThinkingProcess(step);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    setThinkingProcess('');
  };

  // Simulate streaming
  const simulateStreaming = (text) => {
    setStreamingText('');
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setStreamingText(prev => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
        setStreamingText('');
      }
    }, 15);
  };

  // Handle send message
  const handleSend = async () => {
    if (!input.trim() && uploadedFiles.length === 0) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Show thinking process
    if (showThinking) {
      await simulateThinking(input);
    }

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        messages: [...messages, userMessage],
        persona: persona,
        showThinking: showThinking,
        files: uploadedFiles
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString(),
        model: response.data.model,
        persona: response.data.persona
      };

      // Extract artifacts
      extractArtifacts(response.data.response);

      // Simulate streaming
      simulateStreaming(response.data.response);
      
      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        saveConversation();
      }, response.data.response.length * 15);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: '❌ **Connection Error**\n\nSomething went wrong. Please try again!',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const handleFeedback = (messageId, type) => {
    console.log(`Feedback: ${type} for message ${messageId}`);
    // In production, send to analytics
  };

  const exportChat = (format) => {
    let content = '';
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === 'txt') {
      content = messages.map(m => 
        `${m.role.toUpperCase()}: ${m.content}\n---\n`
      ).join('\n');
    } else if (format === 'json') {
      content = JSON.stringify(messages, null, 2);
    } else if (format === 'md') {
      content = messages.map(m => 
        `## ${m.role === 'user' ? '👤 User' : `${personas[persona]?.icon || '🤖'} AI`}\n\n${m.content}\n\n---\n`
      ).join('\n');
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${timestamp}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex ${
      darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      
      {/* History Sidebar */}
      <div className={`${showSidebar ? 'w-64' : 'w-0'} transition-all duration-300 ${
        darkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'
      } overflow-hidden flex-shrink-0`}>
        <div className="p-4 h-full overflow-y-auto">
          <button
            onClick={startNewChat}
            className="w-full flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 mb-4"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>

          <div>
            <h3 className={`text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              Recent Chats
            </h3>
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group relative flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                    currentConversationId === conv.id
                      ? darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0" onClick={() => loadConversation(conv.id)}>
                    <p className={`text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {conv.title}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(conv.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500 flex-shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        } sticky top-0 z-10`}>
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <History className="w-5 h-5" />
              </button>
              <div className="text-3xl">🤖</div>
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  AI Research Agent Pro
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {personas[persona].icon} {personas[persona].name} • v2.0
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                }`}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={saveConversation}
                className={`p-2 rounded-lg ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                }`}
                title="Save"
              >
                <Save className="w-5 h-5" />
              </button>
              <button
                onClick={() => exportChat('md')}
                className={`p-2 rounded-lg ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                }`}
                title="Export"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowArtifacts(!showArtifacts)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                } relative`}
                title="Artifacts"
              >
                <FileCode className="w-5 h-5" />
                {artifacts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {artifacts.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className={`border-t ${darkMode ? 'border-gray-700 bg-gray-800/80' : 'border-gray-200 bg-white/80'} p-4`}>
              <div className="max-w-6xl mx-auto">
                <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  AI Persona
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(personas).map(([key, p]) => (
                    <button
                      key={key}
                      onClick={() => setPersona(key)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        persona === key
                          ? `border-${p.color}-500 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`
                          : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{p.icon}</div>
                      <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {p.name}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {p.description}
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showThinking"
                    checked={showThinking}
                    onChange={(e) => setShowThinking(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="showThinking" className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Show thinking process
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6 mb-32">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className={`max-w-3xl ${msg.role === 'user' ? 'w-auto' : 'w-full'}`}>
                  <div className="flex items-start gap-3">
                    {msg.role === 'assistant' && (
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        darkMode ? 'bg-purple-600' : 'bg-purple-500'
                      }`}>
                        {personas[msg.persona]?.icon || '🤖'}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className={`rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? darkMode
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-500 text-white'
                          : darkMode
                            ? 'bg-gray-800/80 text-gray-100'
                            : 'bg-white text-gray-800 shadow-md'
                      }`}>
                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown
                            components={{
                              code({node, inline, className, children, ...props}) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                  <SyntaxHighlighter
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code className={`${
                                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                                  } px-1 py-0.5 rounded text-sm`} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                              p: ({children}) => <p className="mb-4 last:mb-0">{children}</p>,
                              ul: ({children}) => <ul className="list-disc ml-6 mb-4">{children}</ul>,
                              ol: ({children}) => <ol className="list-decimal ml-6 mb-4">{children}</ol>,
                              li: ({children}) => <li className="mb-1">{children}</li>,
                              h1: ({children}) => <h1 className="text-2xl font-bold mb-3">{children}</h1>,
                              h2: ({children}) => <h2 className="text-xl font-bold mb-2">{children}</h2>,
                              h3: ({children}) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                              strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
                              em: ({children}) => <em className="italic">{children}</em>,
                              a: ({children, href}) => (
                                <a href={href} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        {msg.role === 'assistant' && (
                          <>
                            <button
                              onClick={() => handleFeedback(idx, 'up')}
                              className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                              title="Good response"
                            >
                              <ThumbsUp className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                            </button>
                            <button
                              onClick={() => handleFeedback(idx, 'down')}
                              className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                              title="Bad response"
                            >
                              <ThumbsDown className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => copyMessage(msg.content)}
                          className={`text-xs ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'} flex items-center gap-1`}
                          title="Copy"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                        {msg.model && (
                          <span className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                            {msg.model}
                          </span>
                        )}
                      </div>
                    </div>

                    {msg.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Thinking Process */}
            {thinkingProcess && (
              <div className="flex justify-start animate-fade-in">
                <div className="max-w-3xl w-full">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-purple-600' : 'bg-purple-500'
                    } animate-pulse`}>
                      <Brain className="w-5 h-5" />
                    </div>
                    <div className={`flex-1 rounded-2xl px-4 py-3 ${
                      darkMode ? 'bg-gray-800/80 text-gray-100' : 'bg-white text-gray-800 shadow-md'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Loader className="w-4 h-4 animate-spin" />
                        <span className="text-sm">{thinkingProcess}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Streaming Response */}
            {streamingText && (
              <div className="flex justify-start animate-fade-in">
                <div className="max-w-3xl w-full">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-purple-600' : 'bg-purple-500'
                    }`}>
                      {personas[persona].icon}
                    </div>
                    <div className={`flex-1 rounded-2xl px-4 py-3 ${
                      darkMode ? 'bg-gray-800/80 text-gray-100' : 'bg-white text-gray-800 shadow-md'
                    }`}>
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>{streamingText}</ReactMarkdown>
                        <span className="inline-block w-2 h-4 bg-purple-500 animate-pulse ml-1"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && !streamingText && !thinkingProcess && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    darkMode ? 'bg-purple-600' : 'bg-purple-500'
                  }`}>
                    {personas[persona].icon}
                  </div>
                  <div className={`rounded-2xl px-5 py-4 ${
                    darkMode ? 'bg-gray-800/80' : 'bg-white shadow-lg'
                  }`}>
                    <div className="flex gap-2">
                      <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-500' : 'bg-gray-400'} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                      <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-500' : 'bg-gray-400'} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                      <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-500' : 'bg-gray-400'} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="max-w-6xl mx-auto px-4 py-4">
            {uploadedFiles.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    {file.name}
                    <button
                      onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="hover:text-red-500"
                    >
                      <XCircle className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.txt,.csv,.jpg,.png"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`p-3 rounded-xl ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title="Upload files"
              >
                <Upload className="w-5 h-5" />
              </button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything... (Press Enter to send)"
                  className={`w-full px-4 py-3 rounded-xl ${
                    darkMode 
                      ? 'bg-gray-800 text-white placeholder-gray-400 border-gray-700' 
                      : 'bg-white text-gray-800 placeholder-gray-500 border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  disabled={isLoading}
                />
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <Sparkles className="w-3 h-3" />
                  {personas[persona].name}
                </div>
              </div>

              <button
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <div className={`mt-2 text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              💡 Enter to send • Shift+Enter for new line • {personas[persona].icon} {personas[persona].name} Mode
            </div>
          </div>
        </div>
      </div>

      {/* Artifacts Sidebar */}
      <div className={`${showArtifacts ? 'w-96' : 'w-0'} transition-all duration-300 ${
        darkMode ? 'bg-gray-800 border-l border-gray-700' : 'bg-white border-l border-gray-200'
      } overflow-hidden flex-shrink-0`}>
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              📁 Artifacts ({artifacts.length})
            </h3>
            <button
              onClick={() => setShowArtifacts(false)}
              className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {artifacts.length === 0 ? (
            <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <Code className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No code artifacts yet</p>
              <p className="text-xs mt-1">Code blocks will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {artifacts.map((artifact) => (
                <div
                  key={artifact.id}
                  className={`rounded-lg p-3 ${
                    darkMode ? 'bg-gray-900/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono px-2 py-1 rounded ${
                      darkMode ? 'bg-gray-700 text-purple-400' : 'bg-gray-200 text-purple-600'
                    }`}>
                      {artifact.language}
                    </span>
                    <button
                      onClick={() => copyMessage(artifact.code)}
                      className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="relative max-h-64 overflow-auto rounded">
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={artifact.language}
                      customStyle={{
                        margin: 0,
                        fontSize: '0.75rem',
                        padding: '0.5rem'
                      }}
                    >
                      {artifact.code}
                    </SyntaxHighlighter>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIResearchAgent;
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Send, Moon, Sun, Download, Save, Upload, 
  Copy, Trash2, FileText, MessageSquare, Plus, History,
  Settings, Code, ThumbsUp, ThumbsDown,
  Loader, User, Bot, Sparkles, FileCode, XCircle, Square, ChevronUp, Menu
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AIResearchAgent = () => {
  // Core States
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // UI States
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
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const streamingIntervalRef = useRef(null);

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

  // Handle scroll for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = messagesContainerRef.current?.scrollTop || 0;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

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
    if (messages.length === 0) return;
    
    const conversation = {
      id: currentConversationId || Date.now().toString(),
      title: messages[0]?.content.substring(0, 40) + '...' || 'New Chat',
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
    setMessages([]);
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

  // Stop generation
  const stopGeneration = () => {
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }
    setIsGenerating(false);
    setStreamingText('');
    setThinkingProcess('');
    setIsLoading(false);
  };

  // Simulate streaming
  const simulateStreaming = (text) => {
    setStreamingText('');
    setIsGenerating(true);
    let index = 0;
    
    streamingIntervalRef.current = setInterval(() => {
      if (index < text.length) {
        setStreamingText(prev => prev + text[index]);
        index++;
      } else {
        clearInterval(streamingIntervalRef.current);
        streamingIntervalRef.current = null;
        setIsGenerating(false);
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
        if (!streamingIntervalRef.current) return; // Check if stopped
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

  // Gemini-style welcome screen
  const WelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="text-center mb-8">
        <h1 className={`text-4xl md:text-6xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Hello, Laxman
        </h1>
        <p className={`text-lg md:text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          How can I help you today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {[
          { icon: '✨', title: 'Create image', desc: 'Generate visuals with AI' },
          { icon: '📝', title: 'Write anything', desc: 'Essays, code, stories' },
          { icon: '📚', title: 'Help me learn', desc: 'Explain complex topics' },
          { icon: '⚡', title: 'Boost my day', desc: 'Tips and motivation' }
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => setInput(item.title)}
            className={`p-4 md:p-6 rounded-2xl text-left transition-all ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {item.title}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {item.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 flex ${
      darkMode ? 'bg-[#131314]' : 'bg-white'
    }`}>
      
      {/* History Sidebar */}
      <div className={`${showSidebar ? 'w-64' : 'w-0'} transition-all duration-300 ${
        darkMode ? 'bg-[#1E1F20] border-r border-gray-800' : 'bg-gray-50 border-r border-gray-200'
      } overflow-hidden flex-shrink-0`}>
        <div className="p-4 h-full overflow-y-auto">
          <button
            onClick={startNewChat}
            className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 mb-4"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>

          <div>
            <h3 className={`text-xs font-semibold uppercase ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-3 px-2`}>
              Recent
            </h3>
            <div className="space-y-1">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group relative flex items-center gap-2 p-3 rounded-xl cursor-pointer ${
                    currentConversationId === conv.id
                      ? darkMode ? 'bg-gray-800' : 'bg-gray-200'
                      : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0" onClick={() => loadConversation(conv.id)}>
                    <p className={`text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {conv.title}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/20 flex-shrink-0"
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
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header - Auto Hide */}
        <div className={`${darkMode ? 'bg-[#131314]' : 'bg-white'} border-b ${
          darkMode ? 'border-gray-800' : 'border-gray-200'
        } transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'} fixed top-0 left-0 right-0 z-50`}>
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                } lg:hidden`}
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className={`hidden lg:block p-2 rounded-lg ${
                  darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <History className="w-5 h-5" />
              </button>
              
              <h1 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                AI Research Agent Pro
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {messages.length > 0 && (
                <>
                  <button
                    onClick={saveConversation}
                    className={`hidden md:block p-2 rounded-lg ${
                      darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => exportChat('md')}
                    className={`hidden md:block p-2 rounded-lg ${
                      darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </>
              )}
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'hover:bg-gray-800 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className={`border-t ${darkMode ? 'border-gray-800 bg-[#1E1F20]' : 'border-gray-200 bg-gray-50'} p-4`}>
              <div className="max-w-5xl mx-auto">
                <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  AI Persona
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {Object.entries(personas).map(([key, p]) => (
                    <button
                      key={key}
                      onClick={() => setPersona(key)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        persona === key
                          ? `border-${p.color}-500 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`
                          : darkMode ? 'border-gray-800 hover:border-gray-700' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{p.icon}</div>
                      <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {p.name}
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
        <div 
          ref={messagesContainerRef}
          className={`flex-1 overflow-y-auto px-4 ${messages.length > 0 ? 'pt-20 pb-32' : 'pt-16 pb-32'}`}
        >
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] md:max-w-3xl ${msg.role === 'user' ? 'w-auto' : 'w-full'}`}>
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
                              ? 'bg-[#2F2F2F] text-white'
                              : 'bg-gray-100 text-gray-900'
                            : darkMode
                              ? 'bg-transparent text-gray-100'
                              : 'bg-transparent text-gray-900'
                        }`}>
                          <div className="prose prose-invert max-w-none prose-p:text-base prose-p:leading-7">
                            <ReactMarkdown
                              components={{
                                code({node, inline, className, children, ...props}) {
                                  const match = /language-(\w+)/.exec(className || '');
                                  return !inline && match ? (
                                    <SyntaxHighlighter
                                      style={vscDarkPlus}
                                      language={match[1]}
                                      PreTag="div"
                                      customStyle={{
                                        margin: '0.5rem 0',
                                        borderRadius: '0.5rem',
                                        fontSize: '0.875rem'
                                      }}
                                      {...props}
                                    >
                                      {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                  ) : (
                                    <code className={`${
                                      darkMode ? 'bg-gray-800' : 'bg-gray-200'
                                    } px-1.5 py-0.5 rounded text-sm`} {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                                p: ({children}) => <p className="mb-4 last:mb-0 leading-7">{children}</p>,
                                ul: ({children}) => <ul className="list-disc ml-6 mb-4 space-y-1">{children}</ul>,
                                ol: ({children}) => <ol className="list-decimal ml-6 mb-4 space-y-1">{children}</ol>,
                                li: ({children}) => <li className="leading-7">{children}</li>,
                                h1: ({children}) => <h1 className="text-2xl font-bold mb-3 mt-6">{children}</h1>,
                                h2: ({children}) => <h2 className="text-xl font-bold mb-2 mt-5">{children}</h2>,
                                h3: ({children}) => <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>,
                                strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                                a: ({children, href}) => (
                                  <a href={href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                                    {children}
                                  </a>
                                ),
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-2 px-1">
                          {msg.role === 'assistant' && (
                            <>
                              <button
                                onClick={() => handleFeedback(idx, 'up')}
                                className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                              >
                                <ThumbsUp className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                              </button>
                              <button
                                onClick={() => handleFeedback(idx, 'down')}
                                className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                              >
                                <ThumbsDown className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => copyMessage(msg.content)}
                            className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                          >
                            <Copy className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          </button>
                        </div>
                      </div>

                      {msg.role === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                          L
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Thinking Process */}
              {thinkingProcess && (
                <div className="flex justify-start">
                  <div className="max-w-3xl w-full">
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        darkMode ? 'bg-purple-600' : 'bg-purple-500'
                      } animate-pulse`}>
                        <Loader className="w-5 h-5 animate-spin" />
                      </div>
                      <div className={`flex-1 rounded-2xl px-4 py-3 ${
                        darkMode ? 'bg-gray-900/50' : 'bg-gray-100'
                      }`}>
                        <div className="flex items-center gap-2 text-sm">
                          <span>{thinkingProcess}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Streaming Response */}
              {streamingText && (
                <div className="flex justify-start">
                  <div className="max-w-3xl w-full">
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        darkMode ? 'bg-purple-600' : 'bg-purple-500'
                      }`}>
                        {personas[persona].icon}
                      </div>
                      <div className="flex-1">
                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown>{streamingText}</ReactMarkdown>
                          <span className="inline-block w-2 h-5 bg-purple-500 animate-pulse ml-1"></span>
                        </div>
                        
                        {isGenerating && (
                          <button
                            onClick={stopGeneration}
                            className="mt-3 flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                          >
                            <Square className="w-4 h-4" />
                            Stop generating
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && !streamingText && !thinkingProcess && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-purple-600' : 'bg-purple-500'
                    }`}>
                      {personas[persona].icon}
                    </div>
                    <div className={`rounded-2xl px-5 py-4 ${
                      darkMode ? 'bg-gray-900/50' : 'bg-gray-100'
                    }`}>
                      <div className="flex gap-2">
                        <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-400'} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                        <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-400'} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                        <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-400'} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Scroll to Top Button */}
        {!headerVisible && messages.length > 0 && (
          <button
            onClick={() => messagesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed bottom-32 right-8 p-3 rounded-full shadow-lg ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
            } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}

        {/* Input Area */}
        <div className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-[#131314]' : 'bg-white'} border-t ${
          darkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="max-w-4xl mx-auto px-4 py-4">
            {uploadedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full ${
                      darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    <span className="max-w-[150px] truncate">{file.name}</span>
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
            
            <div className="flex items-end gap-2">
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
                  darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <Upload className="w-5 h-5" />
              </button>

              <div className={`flex-1 rounded-3xl ${
                darkMode ? 'bg-[#2F2F2F]' : 'bg-gray-100'
              } flex items-end`}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message AI Research Agent..."
                  className={`flex-1 px-5 py-3 bg-transparent ${
                    darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                  } focus:outline-none resize-none max-h-32`}
                  disabled={isLoading}
                  rows="1"
                  style={{ minHeight: '48px' }}
                />
                
                <button
                  onClick={handleSend}
                  disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
                  className={`p-3 m-2 rounded-xl transition-all ${
                    isLoading || (!input.trim() && uploadedFiles.length === 0)
                      ? 'opacity-50 cursor-not-allowed'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <Send className={`w-5 h-5 ${darkMode ? 'text-gray-900' : 'text-gray-700'}`} />
                </button>
              </div>
            </div>

            <div className={`mt-2 text-xs text-center ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              {personas[persona].icon} {personas[persona].name} • AI can make mistakes
            </div>
          </div>
        </div>
      </div>

      {/* Artifacts Sidebar */}
      <div className={`${showArtifacts ? 'w-96' : 'w-0'} transition-all duration-300 ${
        darkMode ? 'bg-[#1E1F20] border-l border-gray-800' : 'bg-gray-50 border-l border-gray-200'
      } overflow-hidden flex-shrink-0`}>
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              📁 Artifacts
            </h3>
            <button
              onClick={() => setShowArtifacts(false)}
              className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {artifacts.length === 0 ? (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No artifacts yet</p>
              <p className="text-xs mt-1">Code blocks will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {artifacts.map((artifact) => (
                <div
                  key={artifact.id}
                  className={`rounded-xl p-3 ${
                    darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono px-2 py-1 rounded ${
                      darkMode ? 'bg-gray-800 text-purple-400' : 'bg-gray-100 text-purple-600'
                    }`}>
                      {artifact.language}
                    </span>
                    <button
                      onClick={() => copyMessage(artifact.code)}
                      className={`p-1 rounded ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
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
                        padding: '0.75rem',
                        background: darkMode ? '#0D0D0D' : '#1E1E1E'
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
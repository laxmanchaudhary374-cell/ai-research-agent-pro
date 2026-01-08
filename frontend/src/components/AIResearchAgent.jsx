import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Send, Moon, Sun, Download, Save, Mic, Upload, 
  Copy, Trash2, FileText, MessageSquare 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AIResearchAgent = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 **Welcome to AI Research Agent Pro!**\n\nBuilt with cutting-edge technology:\n- 🤖 Real-time AI responses\n- 📄 Document analysis\n- 🎤 Voice input\n- 💾 Save conversations\n\nHow can I assist you today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        messages: [...messages, userMessage],
        files: uploadedFiles,
        useWebSearch: true
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
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
        `## ${m.role === 'user' ? '👤 User' : '🤖 AI Assistant'}\n\n${m.content}\n\n---\n`
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

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: '👋 **Welcome to AI Research Agent Pro!**\n\nBuilt with cutting-edge technology:\n- 🤖 Real-time AI responses\n- 📄 Document analysis\n- 🎤 Voice input\n- 💾 Save conversations\n\nHow can I assist you today?',
        timestamp: new Date().toISOString()
      }
    ]);
    setUploadedFiles([]);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm border-b ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      } sticky top-0 z-10`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🤖</div>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                AI Research Agent Pro
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Built by [Your Name] • Portfolio Project
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportChat('txt')}
              className={`p-2 rounded-lg ${
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Export as TXT"
            >
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={() => exportChat('md')}
              className={`p-2 rounded-lg ${
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Export as Markdown"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={clearChat}
              className={`p-2 rounded-lg ${
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Clear Chat"
            >
              <Trash2 className="w-5 h-5" />
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
      </div>

      {/* Messages Container */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-6 mb-32">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-3xl ${msg.role === 'user' ? 'w-auto' : 'w-full'}`}>
                <div className="flex items-start gap-3">
                  {msg.role === 'assistant' && (
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-purple-600' : 'bg-purple-500'
                    }`}>
                      🤖
                    </div>
                  )}
                  
                  <div className="flex-1">
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
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                      👤
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-purple-600' : 'bg-purple-500'
                }`}>
                  🤖
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
                  className={`text-xs px-3 py-1 rounded-full ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  📄 {file.name}
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
              accept=".pdf,.doc,.docx,.txt"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-3 rounded-xl ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Upload className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything... (Press Enter to send)"
              className={`flex-1 px-4 py-3 rounded-xl ${
                darkMode 
                  ? 'bg-gray-800 text-white placeholder-gray-400 border-gray-700' 
                  : 'bg-white text-gray-800 placeholder-gray-500 border-gray-300'
              } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
              disabled={isLoading}
            />

            <button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className={`mt-2 text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            💡 Enter to send • Shift+Enter for new line • Built with React + OpenRouter AI
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIResearchAgent;
# 🤖 AI Research Agent Pro

A full-stack AI-powered research assistant built with React, Node.js, and Groq AI. This project showcases modern web development practices, real-time AI integration, and professional UI/UX design.

![AI Research Agent Pro](https://img.shields.io/badge/Status-Live-success)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Groq](https://img.shields.io/badge/AI-Groq-purple)

## 🌐 Live Demo

**[View Live Application](https://ai-research-agent-pro.vercel.app)**

---

## ✨ Features

### 🎨 Modern UI/UX
- **Dark/Light Mode Toggle** - Seamless theme switching
- **Responsive Design** - Works perfectly on all devices
- **Glass Morphism Effects** - Modern, professional aesthetics
- **Smooth Animations** - Polished user experience

### 🤖 AI Capabilities
- **Real-time AI Responses** - Powered by Groq's LLaMA 3.3 70B model
- **Streaming Responses** - ChatGPT-style typewriter effect
- **Syntax Highlighting** - Beautiful code display with 100+ languages
- **Markdown Support** - Rich text formatting

### 💾 Data Management
- **Conversation History** - Save and load previous chats
- **Local Storage** - Persistent data across sessions
- **Export Options** - Download chats as TXT, MD, or JSON
- **File Upload** - Document analysis support

### 🛠️ Technical Features
- **RESTful API** - Clean backend architecture
- **Error Handling** - Graceful error recovery
- **Loading States** - Professional loading indicators
- **Copy Functionality** - Easy message copying

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code highlighting
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Groq API** - AI model integration
- **CORS** - Cross-origin support

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **GitHub** - Version control

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/laxmanchaudhary374-cell/ai-research-agent-pro.git
cd ai-research-agent-pro
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Install backend dependencies**
```bash
cd ../backend
npm install
```

4. **Configure environment variables**

Create `.env` in the backend folder:
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Create `.env` in the frontend folder:
```env
VITE_API_URL=http://localhost:5000
```

5. **Run the application**

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

6. **Open in browser**
```
http://localhost:5173
```

---

## 📁 Project Structure
```
ai-research-agent-pro/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── AIResearchAgent.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

---

## 🎯 Key Features Breakdown

### 1. Conversation Management
- Save conversations to local storage
- Load previous conversations
- Delete unwanted chats
- Create new chat sessions

### 2. Message Handling
- Real-time message sending
- Streaming response animation
- Copy message content
- Timestamp tracking

### 3. File Management
- Upload multiple files
- Display file previews
- Send files with messages

### 4. Export Functionality
- Export as plain text
- Export as Markdown
- Export as JSON
- Timestamped filenames

### 5. UI Enhancements
- Sidebar toggle
- Smooth scrolling
- Loading animations
- Error states

---

## 🔧 Configuration

### Frontend Environment Variables
```env
VITE_API_URL=your_backend_url
```

### Backend Environment Variables
```env
GROQ_API_KEY=your_groq_api_key
PORT=5000
NODE_ENV=production
FRONTEND_URL=your_frontend_url
```

---

## 🌟 Highlights for Portfolio

### Technical Skills Demonstrated
- ✅ Full-stack development (React + Node.js)
- ✅ RESTful API design
- ✅ State management (React hooks)
- ✅ Third-party API integration (Groq)
- ✅ Responsive design
- ✅ Modern CSS (Tailwind)
- ✅ Deployment (Vercel + Render)
- ✅ Version control (Git/GitHub)
- ✅ Error handling & validation
- ✅ User experience optimization

### Best Practices
- Clean, readable code
- Component-based architecture
- Environment variable management
- Proper error handling
- CORS configuration
- Loading states
- Accessibility considerations

---

## 🐛 Known Limitations

- File upload is UI-only (backend processing not implemented)
- Voice input button is UI-only
- Rate limiting depends on Groq's free tier
- Local storage has size limits (~5-10MB)

---

## 🚀 Future Enhancements

- [ ] User authentication
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] File processing (PDF analysis)
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Advanced search in history
- [ ] Conversation sharing
- [ ] Custom AI model selection

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Developer

**[Your Name]**
- Portfolio: [your-portfolio.com](https://your-portfolio.com)
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)
- GitHub: [@laxmanchaudhary374-cell](https://github.com/laxmanchaudhary374-cell)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- **Groq** - For providing free AI API access
- **Vercel** - For seamless frontend deployment
- **Render** - For reliable backend hosting
- **Tailwind CSS** - For beautiful, responsive styling
- **React Community** - For excellent documentation and support

---

## 📸 Screenshots

### Main Interface
![Main Interface](screenshots/main.png)

### Dark Mode
![Dark Mode](screenshots/dark-mode.png)

### Conversation History
![History](screenshots/history.png)

### Code Highlighting
![Code](screenshots/code.png)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ using React, Node.js, and Groq AI**
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I\'m your AI Hakeem assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true); // Default to showing sidebar
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState('chat-' + Date.now());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fix the API endpoint to match backend route
        const response = await fetch('/api/chatbot/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setChatHistory(data);
        } else {
          console.error('Failed to fetch chat history:', response.status);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startNewChat = () => {
    if (messages.length > 1) {
      saveChatToHistory();
    }

    const newChatId = 'chat-' + Date.now();
    setCurrentChatId(newChatId);
    setMessages([{
      id: 1,
      text: 'Hello! I\'m your AI Hakeem assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date().toISOString()
    }]);
  };

  const saveChatToHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const firstUserMessage = messages.find(m => m.sender === 'user');
      const chatTitle = firstUserMessage ?
        (firstUserMessage.text.substring(0, 30) + (firstUserMessage.text.length > 30 ? '...' : '')) :
        'New conversation';

      const chatData = {
        id: currentChatId,
        title: chatTitle,
        date: new Date().toISOString(),
        messages: messages
      };

      setChatHistory(prev => {
        const exists = prev.some(chat => chat.id === currentChatId);
        if (exists) {
          return prev.map(chat => chat.id === currentChatId ? chatData : chat);
        } else {
          return [chatData, ...prev];
        }
      });

      // Fix the API endpoint to match backend route
      const response = await fetch('/api/chatbot/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(chatData)
      });

      if (!response.ok) {
        console.error('Failed to save chat history:', response.status);
      }
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };

  const loadChat = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: inputMessage,
          chatId: currentChatId
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage = {
          id: messages.length + 2,
          text: data.response,
          sender: 'bot',
          timestamp: new Date().toISOString()
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        saveChatToHistory();
      } else {
        console.error('Error from chatbot API:', response.status);
        throw new Error('Failed to get response from chatbot');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-container">
      {/* Left sidebar - ChatGPT style */}
      <div className={`chat-sidebar ${showSidebar ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Chat History</h3>
          <button className="new-chat-btn" onClick={startNewChat}>+ New Chat</button>
        </div>
        <div className="chat-list">
          {chatHistory.length > 0 ? (
            chatHistory.map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
                onClick={() => loadChat(chat.id)}
              >
                <div className="chat-title">{chat.title}</div>
                <div className="chat-date">{new Date(chat.date).toLocaleDateString()}</div>
              </div>
            ))
          ) : (
            <div className="no-chats">No previous chats</div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="chat-main-container">
        <div className="chatbot-header">
          <button className="sidebar-toggle" onClick={() => setShowSidebar(!showSidebar)}>
            {showSidebar ? '×' : '≡'}
          </button>
          <div className="logo">
            <h1>AI<span>Hakeem</span></h1>
          </div>
          <div className="nav-links">
            <Link to="/hakeems" className="nav-link">Find Hakeems</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </div>
        </div>

        <div className="chatbot-main">
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                </div>
                <div className="message-timestamp">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message loading">
                <div className="loading-indicator">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="message-input-container" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className="message-input"
            />
            <button
              type="submit"
              className="send-button"
              disabled={inputMessage.trim() === ''}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

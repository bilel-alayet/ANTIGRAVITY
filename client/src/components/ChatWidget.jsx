// client/src/components/ChatWidget.jsx
import { useState, useRef, useEffect } from 'react';

// Vite proxy forwards /api/* to http://localhost:5000
const API_BASE = '';

const SUGGESTED_PROMPTS = [
  '🎬 Recommend a thriller',
  '🍿 Best movies of 2024',
  '🏆 Oscar winners lately',
  '👻 Scary horror films',
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello! I'm **Cine-AI**, your personal movie concierge. Ask me anything — recommendations, hidden gems, cast trivia, or what to watch tonight. 🎬",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || isLoading) return;

    const userMsg = { role: 'user', content: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Only send user/assistant messages to the API (not system)
      const apiMessages = updatedMessages.map(({ role, content }) => ({ role, content }));

      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to reach the AI concierge.');
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Sorry, I ran into an issue. Please try again in a moment.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Simple markdown-like bold renderer
  const renderContent = (text) =>
    text.split('**').map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} style={{ color: '#fff', fontWeight: 700 }}>
          {part}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );

  return (
    <>
      {/* ── Styles ── */}
      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes chatFabPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,215,0,0.4); }
          50%       { box-shadow: 0 0 0 12px rgba(255,215,0,0); }
        }
        @keyframes dotBounce {
          0%,80%,100% { transform: translateY(0); }
          40%         { transform: translateY(-6px); }
        }
        .chat-widget-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffd700, #ff8c00);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          box-shadow: 0 8px 32px rgba(255,215,0,0.35);
          transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s;
          animation: chatFabPulse 2.5s infinite;
        }
        .chat-widget-fab:hover {
          transform: scale(1.12);
          box-shadow: 0 12px 40px rgba(255,215,0,0.5);
          animation: none;
        }
        .chat-widget-panel {
          position: fixed;
          bottom: 100px;
          right: 28px;
          z-index: 9998;
          width: 380px;
          max-height: 580px;
          border-radius: 20px;
          background: rgba(10,10,10,0.96);
          border: 1px solid rgba(255,215,0,0.18);
          box-shadow: 0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: chatSlideUp 0.35s cubic-bezier(.16,1,.3,1) forwards;
        }
        .chat-header {
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,140,0,0.06));
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .chat-header-info { display: flex; align-items: center; gap: 10px; }
        .chat-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #ffd700, #ff8c00);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; flex-shrink: 0;
        }
        .chat-header-title { font-size: 0.95rem; font-weight: 700; color: #fff; }
        .chat-header-status { font-size: 0.72rem; color: #4ade80; display: flex; align-items: center; gap: 4px; }
        .chat-header-status::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%;
          background: #4ade80; display: inline-block;
        }
        .chat-close-btn {
          background: rgba(255,255,255,0.08); border: none; color: #888;
          width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; transition: all 0.2s;
        }
        .chat-close-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
        .chat-messages {
          flex: 1; overflow-y: auto; padding: 16px;
          display: flex; flex-direction: column; gap: 12px;
          scrollbar-width: thin; scrollbar-color: #222 transparent;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .msg-row { display: flex; gap: 8px; }
        .msg-row.user { flex-direction: row-reverse; }
        .msg-bubble {
          max-width: 82%; padding: 10px 14px; border-radius: 16px;
          font-size: 0.875rem; line-height: 1.55; word-break: break-word;
        }
        .msg-bubble.assistant {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: #ddd; border-radius: 4px 16px 16px 16px;
        }
        .msg-bubble.user {
          background: linear-gradient(135deg, #ffd700, #ff8c00);
          color: #000; font-weight: 500; border-radius: 16px 4px 16px 16px;
        }
        .msg-mini-avatar {
          width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; margin-top: 2px;
        }
        .msg-mini-avatar.ai {
          background: linear-gradient(135deg, #ffd700, #ff8c00);
        }
        .typing-indicator { display: flex; align-items: center; gap: 4px; padding: 4px 2px; }
        .typing-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #ffd700; animation: dotBounce 1.2s ease-in-out infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.15s; }
        .typing-dot:nth-child(3) { animation-delay: 0.3s; }
        .suggestions {
          display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 10px;
        }
        .suggestion-chip {
          background: rgba(255,215,0,0.1); border: 1px solid rgba(255,215,0,0.2);
          color: #ffd700; border-radius: 20px; padding: 5px 11px;
          font-size: 0.75rem; cursor: pointer; transition: all 0.2s;
          white-space: nowrap;
        }
        .suggestion-chip:hover {
          background: rgba(255,215,0,0.2); border-color: rgba(255,215,0,0.5);
        }
        .chat-input-area {
          padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.07);
          display: flex; gap: 10px; align-items: flex-end; flex-shrink: 0;
        }
        .chat-input {
          flex: 1; background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
          color: #fff; font-family: inherit; font-size: 0.875rem;
          padding: 10px 14px; resize: none; outline: none;
          transition: border-color 0.2s; max-height: 100px; line-height: 1.4;
          scrollbar-width: none;
        }
        .chat-input:focus { border-color: rgba(255,215,0,0.4); }
        .chat-input::placeholder { color: #555; }
        .chat-send-btn {
          width: 40px; height: 40px; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #ffd700, #ff8c00);
          color: #000; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          font-size: 1rem; transition: all 0.2s; flex-shrink: 0;
        }
        .chat-send-btn:hover:not(:disabled) { transform: scale(1.08); }
        .chat-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        @media (max-width: 420px) {
          .chat-widget-panel { width: calc(100vw - 24px); right: 12px; bottom: 88px; }
        }
      `}</style>

      {/* ── FAB Button ── */}
      <button
        id="chat-widget-fab"
        className="chat-widget-fab"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Close chat' : 'Open AI Movie Concierge'}
        title="AI Movie Concierge"
      >
        {isOpen ? '✕' : '🎬'}
      </button>

      {/* ── Chat Panel ── */}
      {isOpen && (
        <div className="chat-widget-panel" role="dialog" aria-label="AI Movie Concierge chat">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">🎬</div>
              <div>
                <div className="chat-header-title">Cine-AI</div>
                <div className="chat-header-status">Online</div>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)} aria-label="Close chat">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages" role="log" aria-live="polite">
            {messages.map((msg, i) => (
              <div key={i} className={`msg-row ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="msg-mini-avatar ai" aria-hidden="true">
                    🎬
                  </div>
                )}
                <div className={`msg-bubble ${msg.role}`}>{renderContent(msg.content)}</div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="msg-row assistant">
                <div className="msg-mini-avatar ai" aria-hidden="true">🎬</div>
                <div className="msg-bubble assistant">
                  <div className="typing-indicator" aria-label="AI is typing">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion chips — only show when only opening message exists */}
          {messages.length === 1 && !isLoading && (
            <div className="suggestions" aria-label="Suggested prompts">
              {SUGGESTED_PROMPTS.map((p) => (
                <button key={p} className="suggestion-chip" onClick={() => sendMessage(p)}>
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="chat-input-area">
            <textarea
              ref={inputRef}
              id="chat-input-field"
              className="chat-input"
              rows={1}
              placeholder="Ask about movies, recommendations…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Chat message input"
            />
            <button
              id="chat-send-btn"
              className="chat-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

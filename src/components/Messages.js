import { useState, useRef, useEffect } from 'react';

const Messages = ({ conversations, selectedPerson, onPersonChange, onSendMessage }) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedPerson, conversations]);

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentConversation = conversations[selectedPerson];
  const peopleList = Object.keys(conversations);

  return (
    <div className="messages-container">
      {/* Person Selector Dropdown */}
      <div className="person-selector">
        <label htmlFor="person-dropdown" style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#2d4a1f',
          marginBottom: '6px',
          display: 'block'
        }}>
          Chat with:
        </label>
        <select
          id="person-dropdown"
          value={selectedPerson}
          onChange={(e) => onPersonChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#2d4a1f',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(142, 169, 78, 0.3)',
            borderRadius: '8px',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)';
            e.target.style.boxShadow = '0 0 0 3px rgba(142, 169, 78, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)';
            e.target.style.boxShadow = 'none';
          }}
        >
          {peopleList.map(person => (
            <option key={person} value={person}>{person}</option>
          ))}
        </select>
      </div>

      {/* Conversation Messages */}
      <div className="conversation-messages">
        {currentConversation.messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${message.isMe ? 'my-message' : 'their-message'}`}
          >
            {!message.isMe && (
              <div className="message-avatar">
                {currentConversation.initials}
              </div>
            )}
            <div className="message-content">
              <div className="message-bubble">
                {message.text}
              </div>
              <div className="message-time">
                {message.time}
              </div>
            </div>
            {message.isMe && (
              <div className="message-avatar my-avatar">
                Me
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="message-input-container">
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows="2"
          style={{
            flex: 1,
            padding: '10px 12px',
            fontSize: '14px',
            color: '#2d4a1f',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(142, 169, 78, 0.3)',
            borderRadius: '8px',
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)';
            e.target.style.boxShadow = '0 0 0 3px rgba(142, 169, 78, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          onClick={handleSend}
          disabled={!messageText.trim()}
          style={{
            padding: '10px 20px',
            background: messageText.trim() ? 'rgba(142, 169, 78, 0.85)' : 'rgba(142, 169, 78, 0.4)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#ffffff',
            border: '1px solid rgba(142, 169, 78, 0.3)',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: messageText.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: messageText.trim() ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
            minWidth: '80px'
          }}
          onMouseOver={(e) => {
            if (messageText.trim()) {
              e.currentTarget.style.background = 'rgba(142, 169, 78, 1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
            }
          }}
          onMouseOut={(e) => {
            if (messageText.trim()) {
              e.currentTarget.style.background = 'rgba(142, 169, 78, 0.85)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }
          }}
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '18px', height: '18px', fill: 'currentColor', marginRight: '6px' }}
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;

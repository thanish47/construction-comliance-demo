import React from 'react';

const Notifications = ({ notifications, onNotificationClick }) => {
  return (
    <>
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`message-item ${notification.unread ? 'unread' : ''}`}
          onClick={() => onNotificationClick(notification.id)}
        >
          <div className="message-sender">
            <span>{notification.title}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="message-time">{notification.time}</span>
              {notification.unread && <div className="unread-badge"></div>}
            </div>
          </div>
          <div className="message-preview">
            {notification.message}
          </div>
        </div>
      ))}
    </>
  );
};

export default Notifications;

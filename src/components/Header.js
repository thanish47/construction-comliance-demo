import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({
  hamburgerActive,
  onToggleSidebar,
  onNotificationClick,
  onHelpClick,
  onProfileClick,
  onLogoutClick,
  notificationBadgeCount = 0
}) => {
  return (
    <header>
      <nav className="header-nav">
        <div className="header-content">
          <div className="header-left">
            <div
              className={`hamburger ${hamburgerActive ? 'active' : ''}`}
              onClick={onToggleSidebar}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="logo">
              <Link to="/dashboard">
                <img src="/tmp_logo.png" alt="My Logo" loading="lazy" />
              </Link>
            </div>
          </div>
          <div className="header-right">
            {/* Notification Icon */}
            <div className="header-icon" onClick={onNotificationClick} title="Notifications">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
              </svg>
              {notificationBadgeCount > 0 && (
                <span className="notification-badge">{notificationBadgeCount}</span>
              )}
            </div>
            {/* Help Icon */}
            <div className="header-icon" onClick={onHelpClick} title="Help">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
            </div>
            {/* Profile Icon */}
            <div className="header-icon" onClick={onProfileClick} title="Profile">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            {/* Logout Icon */}
            <div className="header-icon" onClick={onLogoutClick} title="Logout">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

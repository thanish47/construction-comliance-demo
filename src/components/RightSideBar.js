import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RightSideBar = ({
  isActive,
  onClose,
  title,
  children,
  headerActionLink,
  minWidth = 300
}) => {
  const [width, setWidth] = useState(() => Math.max(400, minWidth));
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);
  const sidebarIdRef = useRef(null);

  if (!sidebarIdRef.current) {
    sidebarIdRef.current = `right-sidebar-${Math.random().toString(36).slice(2)}`;
  }

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const sidebar = sidebarRef.current;
      if (!sidebar) return;

      const rect = sidebar.getBoundingClientRect();
      const newWidth = rect.right - e.clientX;

      // Set min and max width constraints
      if (newWidth >= minWidth && newWidth <= 800) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    setWidth((prev) => Math.max(prev, minWidth));
  }, [minWidth]);

  useEffect(() => {
    const event = new CustomEvent('right-sidebar-toggle', {
      detail: {
        id: sidebarIdRef.current,
        isActive
      }
    });
    window.dispatchEvent(event);

    return () => {
      window.dispatchEvent(new CustomEvent('right-sidebar-toggle', {
        detail: {
          id: sidebarIdRef.current,
          isActive: false
        }
      }));
    };
  }, [isActive]);

  // Determine inline styles based on mobile/desktop
  const computedWidth = Math.max(width, minWidth);
  const sidebarStyle = isMobile
    ? { width: '100%', right: isActive ? '0' : '-100%' }
    : { width: `${computedWidth}px`, right: isActive ? '0' : `-${computedWidth}px` };

  return (
    <aside
      ref={sidebarRef}
      className={`messages-sidebar ${isActive ? 'active' : ''}`}
      style={sidebarStyle}
    >
      {/* Resize Gripper - Only show on desktop */}
      {!isMobile && (
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '8px',
            height: '60px',
            cursor: 'ew-resize',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isResizing ? 'rgba(142, 169, 78, 0.4)' : 'transparent',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!isResizing) {
              e.currentTarget.style.background = 'rgba(142, 169, 78, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isResizing) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <div style={{
            width: '3px',
            height: '30px',
            background: 'rgba(142, 169, 78, 0.6)',
            borderRadius: '2px',
            boxShadow: '0 0 4px rgba(0, 0, 0, 0.1)'
          }} />
        </div>
      )}

      <div className="messages-header">
        <div className="messages-title">{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Optional header action link icon */}
          {headerActionLink && (
            <Link
              to={headerActionLink}
              title="View Full Details"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '18px', height: '18px', fill: '#1b5e20' }}
              >
                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
              </svg>
            </Link>
          )}
          <div className="messages-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="messages-list">
        {children}
      </div>
    </aside>
  );
};

export default RightSideBar;

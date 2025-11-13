import React from 'react';

const FloatingActionButton = ({ isVisible, onClick, icon, badge, title }) => {
  if (!isVisible) return null;

  return (
    <div className="messages-float" onClick={onClick} title={title}>
      {icon}
      {badge > 0 && <span className="messages-badge">{badge}</span>}
    </div>
  );
};

export default FloatingActionButton;

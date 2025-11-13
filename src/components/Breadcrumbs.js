import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.active ? (
            <span className="breadcrumb-item active">
              {item.icon || item.label}
            </span>
          ) : (
            <Link to={item.href} className="breadcrumb-item">
              {item.icon || item.label}
            </Link>
          )}
          {index < items.length - 1 && (
            <span className="breadcrumb-separator">›</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;

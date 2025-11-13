import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import SubTabs from './SubTabs';

const SecondaryHeader = ({ breadcrumbs, pageTitle, tabs, activeTab, onTabClick, enableOverflow = true }) => {
  return (
    <div className="secondary-header">
      <div
        className="secondary-header-content"
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          gap: '24px'
        }}
      >
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <Breadcrumbs items={breadcrumbs} />
        ) : pageTitle ? (
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#2d4a1f',
            margin: 0,
            textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)',
            minWidth: '250px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {pageTitle}
          </h1>
        ) : (
          <div></div>
        )}
        {tabs && tabs.length > 0 && (
          <div style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'flex-end' }}>
            <SubTabs tabs={tabs} activeTab={activeTab} onTabClick={onTabClick} enableOverflow={enableOverflow} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondaryHeader;

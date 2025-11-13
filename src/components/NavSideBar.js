import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const NavSideBar = ({ isActive, activeSubmenu, onToggleSubmenu, onSubmenuClick, currentPath }) => {
  const [activeTertiary, setActiveTertiary] = useState(null);
  const [isTertiaryActive, setIsTertiaryActive] = useState(false);
  const [tertiaryFilter, setTertiaryFilter] = useState('');
  const tertiaryRef = useRef(null);

  const menuData = [
    {
      id: 'gpts',
      title: 'GPTS',
      items: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Clients', href: '#clients' },
        { label: 'Projects', href: '/projects' },
        { label: 'Contracts', href: '/contracts' },
        { label: 'Contractors', href: '#contractors' },
        { label: 'Employees', href: '#employees' }
      ]
    },
    {
      id: 'admin',
      title: 'Admin',
      items: [
        { label: 'Reference Data', href: '#reference-data' },
        { label: 'User Management', href: '#user-management' },
        { label: 'Wage Management', href: '#wage-management' },
        { label: 'Audit Management', href: '#audit-management' }
      ]
    },
    {
      id: 'reports',
      title: 'Reports',
      items: [
        {
          label: 'Certified Payroll',
          id: 'certified-payroll',
          tertiaryItems: [
            { label: 'EEO Weekly', href: '#eeo-weekly' },
            { label: 'EEO Weekly Extended', href: '#eeo-weekly-extended' },
            { label: 'EEO BY Race / Ethnicity', href: '#eeo-race-ethnicity' },
            { label: 'EEO Workforce Hiring', href: '#eeo-workforce-hiring' },
            { label: 'EEO Workforce Summary- Aggregate', href: '#eeo-workforce-summary-aggregate' },
            { label: 'EEO Project Workforce - Aggregate (Client)', href: '#eeo-project-workforce-aggregate-client' },
            { label: 'EEO Workforce Summary- Aggregate Minority/Female/Residency', href: '#eeo-workforce-summary-aggregate-mfr' },
            { label: 'EEO by Race / Ethnicity - Aggregate', href: '#eeo-race-ethnicity-aggregate' },
            { label: 'EEO Project WorkForce', href: '#eeo-project-workforce' },
            { label: 'EEO Workforce Summary- Aggregate Apprentice/Minority/Gender', href: '#eeo-workforce-summary-aggregate-amg' },
            { label: 'EEO Project WorkForce By Level1 Parent', href: '#eeo-project-workforce-level1' },
            { label: 'EEO Project Workforce Commitment', href: '#eeo-project-workforce-commitment' },
            { label: 'EEO Project Workforce - Commit vs Actual', href: '#eeo-project-workforce-commit-actual' },
            { label: 'EEO Project WorkForce by division', href: '#eeo-project-workforce-division' },
            { label: 'EEO Weekly Employee Summary', href: '#eeo-weekly-employee-summary' },
            { label: 'Prevailing Wage - State', href: '#prevailing-wage-state' },
            { label: 'Prevailing Wage w/ Fringes - State', href: '#prevailing-wage-fringes-state' },
            { label: 'Prevailing Wage - Indiana', href: '#prevailing-wage-indiana' },
            { label: 'Prevailing Wage - Davis-Bacon', href: '#prevailing-wage-davis-bacon' },
            { label: 'Prevailing Wage w/ Fringes - Davis-Bacon', href: '#prevailing-wage-fringes-davis-bacon' },
            { label: 'Project Status', href: '#project-status' },
            { label: 'Project Summary - Diversity Spending', href: '#project-summary-diversity-spending' },
            { label: 'Project Summary - All Goals (WF / BE)', href: '#project-summary-all-goals' },
            { label: 'Project Summary - Aggregate', href: '#project-summary-aggregate' },
            { label: 'Project Executive Summary - Aggregate', href: '#project-executive-summary-aggregate' },
            { label: 'Project Executive Summary (Extended) - Aggregate', href: '/reports/project-executive-summary-extended-aggregate' },
            { label: 'Project Summary by Prime Contractor', href: '#project-summary-prime-contractor' },
            { label: 'MWBE Tracking Summary', href: '#mwbe-tracking-summary' },
            { label: 'Project Payments', href: '#project-payments' },
            { label: 'Project Damage Summary', href: '#project-damage-summary' },
            { label: 'Damage Summary by Tier One Contractor', href: '#damage-summary-tier-one' },
            { label: 'Locale Report', href: '#locale-report' },
            { label: 'Locale Report - Aggregate', href: '#locale-report-aggregate' },
            { label: 'Locale Report - Apprentice', href: '#locale-report-apprentice' },
            { label: 'Local Residency', href: '#local-residency' },
            { label: 'Contractor Payroll Summary', href: '#contractor-payroll-summary' },
            { label: 'Contractor List By Contracts', href: '#contractor-list-contracts' },
            { label: 'Compliance Summary By Contracts', href: '#compliance-summary-contracts' },
            { label: 'FTE Report', href: '#fte-report' },
            { label: 'Workforce Utilization by Trade', href: '#workforce-utilization-trade' },
            { label: 'Workforce Utilization by Trade (Extended)', href: '#workforce-utilization-trade-extended' },
            { label: 'Employment Utilization Report', href: '#employment-utilization-report' },
            { label: 'Employee Age Report', href: '#employee-age-report' },
            { label: 'WIA by Contract Report', href: '#wia-contract-report' },
            { label: 'Employment Summary by Contract Report', href: '#employment-summary-contract-report' },
            { label: 'Payroll Data Audit Report', href: '#payroll-data-audit-report' },
            { label: 'Payroll Audit Log', href: '#payroll-audit-log' },
            { label: 'Company List By Commodity', href: '#company-list-commodity' },
            { label: 'Company List By Contracts', href: '#company-list-contracts' },
            { label: 'Contract List By Client (Client only report)', href: '#contract-list-client' },
            { label: 'Project List By Compliance Officer (Client only report)', href: '#project-list-compliance-officer' }
          ]
        },
        {
          label: 'Site Visit',
          id: 'site-visit',
          tertiaryItems: [
            { label: 'Site Visit Log', href: '#site-visit-log' },
            { label: 'PBC Site Visit Report', href: '#pbc-site-visit-report' },
            { label: 'Site Visit Log Ext', href: '#site-visit-log-ext' },
            { label: 'Site Visit Variance', href: '#site-visit-variance' },
            { label: 'Site Visit List By Compliance Officer (Client only report)', href: '#site-visit-list-compliance-officer' }
          ]
        },
        {
          label: 'Apprentice Certificate',
          id: 'apprentice-certificate',
          tertiaryItems: [
            { label: 'Apprentice Report', href: '#apprentice-report' }
          ]
        },
        {
          label: 'Custom/On Screen',
          id: 'custom-reports',
          tertiaryItems: [
            { label: 'Project Executive Summary - Aggregate (Charts & Goals)', href: '#project-executive-summary-charts-goals' },
            { label: 'Workforce Projection', href: '#workforce-projection' }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    if (!isTertiaryActive) {
      return;
    }

    const handleClickOutside = (event) => {
      if (!tertiaryRef.current) return;

      const clickedInsidePanel = tertiaryRef.current.contains(event.target);
      const clickedTrigger = event.target.closest('.submenu-link-with-tertiary');

      if (!clickedInsidePanel && !clickedTrigger) {
        setActiveTertiary(null);
        setIsTertiaryActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [isTertiaryActive]);

  const handleTertiaryToggle = (itemId) => {
    if (activeTertiary === itemId && isTertiaryActive) {
      setActiveTertiary(null);
      setIsTertiaryActive(false);
      setTertiaryFilter('');
    } else {
      setActiveTertiary(itemId);
      setIsTertiaryActive(true);
      setTertiaryFilter('');
    }
  };

  useEffect(() => {
    if (!isTertiaryActive) {
      return;
    }

    const handleClickOutside = (event) => {
      if (!tertiaryRef.current) return;

      const clickedInsidePanel = tertiaryRef.current.contains(event.target);
      const clickedTrigger = event.target.closest('.submenu-link-with-tertiary');

      if (!clickedInsidePanel && !clickedTrigger) {
        setActiveTertiary(null);
        setIsTertiaryActive(false);
        setTertiaryFilter('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [isTertiaryActive]);

  const handleTertiaryItemClick = (e, href) => {
    onSubmenuClick(e, href);
    setActiveTertiary(null);
    setIsTertiaryActive(false);
    setTertiaryFilter('');
  };
  return (
    <>
      <aside className={`sidebar ${isActive ? 'active' : ''}`}>
        <ul className="sidebar-menu">
          {menuData.map((menu) => (
            <li key={menu.id} className="menu-item">
              <div className="menu-header" onClick={() => onToggleSubmenu(menu.id)}>
                <span>{menu.title}</span>
                <span className={`menu-icon ${activeSubmenu === menu.id ? 'rotated' : ''}`}>▼</span>
              </div>
              <ul className={`submenu ${activeSubmenu === menu.id ? 'active' : ''}`}>
                {menu.items.map((item, index) => {
                  // Check if item has tertiary items
                  if (item.tertiaryItems) {
                    return (
                      <li key={index} className="submenu-item">
                        <div
                          className="submenu-link-with-tertiary"
                          onClick={() => handleTertiaryToggle(item.id)}
                        >
                          <span>{item.label}</span>
                          <span className={`tertiary-icon ${activeTertiary === item.id ? 'rotated' : ''}`}>▶</span>
                        </div>
                      </li>
                    );
                  }

                  // Regular item without tertiary
                  const isActiveItem = item.href && item.href.startsWith('/') && currentPath === item.href;
                  return (
                    <li key={index} className={`submenu-item ${isActiveItem ? 'active' : ''}`}>
                      {item.href && item.href.startsWith('/') ? (
                        <Link to={item.href} onClick={(e) => onSubmenuClick(e, item.href)}>
                          {item.label}
                        </Link>
                      ) : (
                        <a href={item.href} onClick={(e) => onSubmenuClick(e, item.href)}>
                          {item.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </aside>

      {/* Tertiary Panel */}
      {activeTertiary && (
        <aside className={`tertiary-panel ${isTertiaryActive ? 'active' : ''}`} ref={tertiaryRef}>
          <div className="tertiary-panel-content">
            {menuData.map((menu) =>
              menu.items
                .filter(item => item.tertiaryItems && item.id === activeTertiary)
                .map((item) => (
                  <div key={item.id}>
                    <div className="tertiary-header">
                      <h3>{item.label}</h3>
                      <button
                        className="tertiary-close"
                        onClick={() => {
                          setActiveTertiary(null);
                          setIsTertiaryActive(false);
                          setTertiaryFilter('');
                        }}
                        title="Close"
                      >
                        ✕
                      </button>
                    </div>
                    {item.id === 'certified-payroll' && (
                      <div className="tertiary-filter">
                        <input
                          type="text"
                          placeholder="Filter reports"
                          value={tertiaryFilter}
                          onChange={(e) => setTertiaryFilter(e.target.value)}
                        />
                      </div>
                    )}
                    {(() => {
                      const filteredItems = item.id === 'certified-payroll' && tertiaryFilter.trim()
                        ? item.tertiaryItems.filter((tertiaryItem) =>
                            tertiaryItem.label.toLowerCase().includes(tertiaryFilter.trim().toLowerCase())
                          )
                        : item.tertiaryItems;

                      if (filteredItems.length === 0) {
                        return (
                          <p className="tertiary-empty-message">
                            No reports match your search.
                          </p>
                        );
                      }

                      return (
                        <ul className="tertiary-menu">
                          {filteredItems.map((tertiaryItem, idx) => {
                            const isActiveTertiary = tertiaryItem.href && tertiaryItem.href.startsWith('/') && currentPath === tertiaryItem.href;
                            return (
                              <li key={idx} className={`tertiary-item ${isActiveTertiary ? 'active' : ''}`}>
                                {tertiaryItem.href && tertiaryItem.href.startsWith('/') ? (
                                  <Link to={tertiaryItem.href} onClick={(e) => handleTertiaryItemClick(e, tertiaryItem.href)}>
                                    {tertiaryItem.label}
                                  </Link>
                                ) : (
                                  <a href={tertiaryItem.href} onClick={(e) => handleTertiaryItemClick(e, tertiaryItem.href)}>
                                    {tertiaryItem.label}
                                  </a>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      );
                    })()}
                  </div>
                ))
            )}
          </div>
        </aside>
      )}
    </>
  );
};

export default NavSideBar;

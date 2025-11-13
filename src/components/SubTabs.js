import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

const GAP = 8;
const MORE_BUTTON_WIDTH = 76; // accounts for padding + icon

const MOBILE_BREAKPOINT = 768;

const SubTabs = ({ tabs = [], onTabClick, activeTab, enableOverflow = true }) => {
  const location = useLocation();
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const measureRef = useRef(null);
  const [visibleTabs, setVisibleTabs] = useState(tabs);
  const [overflowTabs, setOverflowTabs] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= MOBILE_BREAKPOINT : false
  );

  const resolveActive = useCallback((href) => {
    if (activeTab) {
      return activeTab === href;
    }
    const pathname = location.pathname;
    return pathname === href || pathname.startsWith(`${href}/`);
  }, [activeTab, location.pathname]);

  const computeLayout = useCallback(() => {
    const shouldForceOverflow = enableOverflow && isMobile;

    if (!enableOverflow) {
      setVisibleTabs(tabs);
      setOverflowTabs([]);
      setDropdownOpen(false);
      return;
    }

    if (shouldForceOverflow) {
      setVisibleTabs([]);
      setOverflowTabs(tabs);
      setDropdownOpen(false);
      return;
    }

    if (!containerRef.current || !measureRef.current || tabs.length === 0) {
      setVisibleTabs(tabs);
      setOverflowTabs([]);
      return;
    }

    const containerWidth = containerRef.current.clientWidth;
    if (!containerWidth) {
      return;
    }

    const measurementChildren = Array.from(measureRef.current.children);
    if (!measurementChildren.length) {
      setVisibleTabs(tabs);
      setOverflowTabs([]);
      return;
    }

    const widths = measurementChildren.map((node) => node.getBoundingClientRect().width);

    // First pass: try to fit everything (without More button)
    let used = 0;
    let lastVisible = widths.length;

    for (let i = 0; i < widths.length; i++) {
      const addition = widths[i] + (i === 0 ? 0 : GAP);
      if (used + addition > containerWidth) {
        lastVisible = i;
        break;
      }
      used += addition;
    }

    if (lastVisible === widths.length) {
      setVisibleTabs(tabs);
      setOverflowTabs([]);
      setDropdownOpen(false);
      return;
    }

    // Second pass: reserve space for More button
    used = 0;
    lastVisible = 0;
    for (let i = 0; i < widths.length; i++) {
      const addition = widths[i] + (i === 0 ? 0 : GAP);
      if (used + addition + MORE_BUTTON_WIDTH > containerWidth) {
        break;
      }
      used += addition;
      lastVisible = i + 1;
    }

    if (lastVisible < 1) {
      lastVisible = 1;
    }

    setVisibleTabs(tabs.slice(0, lastVisible));
    setOverflowTabs(tabs.slice(lastVisible));
    setDropdownOpen(false);
  }, [tabs, enableOverflow, isMobile]);

  // Initial + tabs change + route change
  useEffect(() => {
    const raf = requestAnimationFrame(() => computeLayout());
    return () => cancelAnimationFrame(raf);
  }, [tabs, computeLayout, location.pathname]);

  // Window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      computeLayout();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [computeLayout]);

  // Observe container size changes
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined' || !containerRef.current) {
      return;
    }
    const observer = new ResizeObserver(() => {
      computeLayout();
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [computeLayout]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) {
      return;
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [dropdownOpen]);

  return (
    <div className="sub-tabs" ref={containerRef}>
      <div className="sub-tabs-visible">
        {visibleTabs.map((tab, index) => (
          <Link
            key={`${tab.href}-${index}`}
            to={tab.href}
            className={`sub-tab-pill ${resolveActive(tab.href) ? 'active' : ''}`}
            onClick={() => onTabClick && onTabClick(tab.label)}
            data-role="sub-tab"
          >
            {tab.label}
          </Link>
        ))}

        {overflowTabs.length > 0 && (
          <div style={{ position: 'relative', flexShrink: 0 }} ref={dropdownRef}>
            <button
              className={`sub-tab-pill more-pill ${overflowTabs.some(tab => resolveActive(tab.href)) ? 'active' : ''}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                border: 'none',
                background: 'transparent'
              }}
            >
              {isMobile ? (
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: '18px', height: '18px', fill: 'currentColor' }}
                >
                  <path d="M3 6h18v2H3V6zm0 10h18v2H3v-2zm0-5h18v2H3v-2z" />
                </svg>
              ) : (
                <>
                  More
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      width: '14px',
                      height: '14px',
                      fill: 'currentColor',
                      transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </>
              )}
            </button>

            {dropdownOpen && (
              <div className="sub-tabs-dropdown">
                {overflowTabs.map((tab, index) => (
                  <Link
                    key={`${tab.href}-overflow-${index}`}
                    to={tab.href}
                    onClick={() => {
                      onTabClick && onTabClick(tab.label);
                      setDropdownOpen(false);
                    }}
                    className={`sub-tabs-dropdown-item ${resolveActive(tab.href) ? 'active' : ''}`}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden measurement row */}
      <div className="sub-tabs-measure" ref={measureRef} aria-hidden="true">
        {tabs.map((tab, index) => (
          <span key={`measure-${tab.href}-${index}`} className="sub-tab-pill">
            {tab.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SubTabs;

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext, Outlet } from 'react-router-dom';
import contractsData from '../data/contracts.json';

const ContractDetails = () => {
  const { contractNumber } = useParams();
  const navigate = useNavigate();
  const { mainShifted } = useOutletContext();
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 767;
  });
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryAnimating, setSummaryAnimating] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const contract = contractsData.find(c => c.ContractNumber === contractNumber);

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return value;
    }
    return `$${numericValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  };

  const handleSummaryToggle = () => {
    if (!summaryOpen) {
      // Opening
      setSummaryOpen(true);
      // Trigger animation after render
      setTimeout(() => {
        setSummaryAnimating(true);
      }, 10);
    } else {
      // Closing - trigger exit animation
      setSummaryAnimating(false);
      setTimeout(() => {
        setSummaryOpen(false);
      }, 300); // Match transition duration
    }
  };

  const handleSummaryClose = () => {
    setSummaryAnimating(false);
    setTimeout(() => {
      setSummaryOpen(false);
    }, 300); // Match transition duration
  };

  if (!contract) {
    return (
      <div className={`main-wrapper ${mainShifted ? 'shifted' : ''}`}>
        <main>
          <div className="content-container">
            <h1 className="page-title">Contract Not Found</h1>
            <p className="page-description">
              The contract with number {contractNumber} could not be found.
            </p>
            <button
              onClick={() => navigate('/contracts', { state: { restoreSearch: true } })}
              style={{
                padding: '10px 20px',
                background: 'rgba(142, 169, 78, 0.85)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                marginTop: '20px'
              }}
            >
              Back to Contracts
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`main-wrapper ${mainShifted ? 'shifted' : ''}`}>
      <main>
        <div className="content-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 className="page-title">{contract.ContractNumber}</h1>
              <button
                onClick={handleSummaryToggle}
                title={summaryOpen ? 'Hide Contract Summary' : 'Show Contract Summary'}
                style={{
                  padding: '6px 8px',
                  background: summaryOpen ? 'rgba(142, 169, 78, 0.15)' : 'rgba(142, 169, 78, 0.1)',
                  border: '1px solid rgba(142, 169, 78, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease',
                  marginRight: '10px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(142, 169, 78, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(142, 169, 78, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = summaryOpen ? 'rgba(142, 169, 78, 0.15)' : 'rgba(142, 169, 78, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(142, 169, 78, 0.3)';
                }}
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '18px', height: '18px', fill: '#4a7c59' }}>
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    width: '14px',
                    height: '14px',
                    fill: '#4a7c59',
                    transform: summaryOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>
              </button>
            </div>
            <button
              onClick={() => navigate('/contracts', { state: { restoreSearch: true } })}
              style={{
                padding: isMobile ? '8px' : '8px 16px',
                background: 'rgba(142, 169, 78, 0.85)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isMobile ? 0 : '6px'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(142, 169, 78, 1)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(142, 169, 78, 0.85)'}
            >
              {isMobile ? (
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: '18px', height: '18px', fill: 'currentColor' }}
                >
                  <path d="M20 11H7.83l5.58-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
              ) : (
                'Back to Contracts'
              )}
            </button>
          </div>

          {/* Contract Summary Card */}
          {summaryOpen && (
            <div style={{
              marginBottom: '20px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              position: 'relative',
              opacity: summaryAnimating ? 1 : 0,
              transform: summaryAnimating ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '5px', borderBottom: '2px solid rgba(142, 169, 78, 0.3)' }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1b5e20',
                  margin: 0
                }}>
                  Contract Summary
                </h2>
                <button
                  onClick={handleSummaryClose}
                  title="Close Summary"
                  style={{
                    padding: '4px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    borderRadius: '4px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(211, 47, 47, 0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px', fill: '#666' }}>
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                rowGap: '16px'
              }}>
                {/* Contract Number */}
                <div style={{ minWidth: '200px', flex: '0 0 200px' }}>
                  <div style={{
                    color: '#4a7c59',
                    fontWeight: '600',
                    fontSize: '12px',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Contract Number
                  </div>
                  <div style={{
                    color: '#2d4a1f',
                    fontWeight: '500',
                    fontSize: '14px'
                  }} title={contract.ContractNumber || 'N/A'}>
                    {contract.ContractNumber || 'N/A'}
                  </div>
                </div>

                {/* Contract Name */}
                <div style={{ minWidth: '300px', flex: '1 1 300px' }}>
                  <div style={{
                    color: '#4a7c59',
                    fontWeight: '600',
                    fontSize: '12px',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Contract Name
                  </div>
                  <div style={{
                    color: '#2d4a1f',
                    fontWeight: '500',
                    fontSize: '14px'
                  }} title={contract.ContractName || 'N/A'}>
                    {contract.ContractName || 'N/A'}
                  </div>
                </div>

                {/* Status */}
                <div style={{ minWidth: '120px', flex: '0 1 120px' }}>
                  <div style={{
                    color: '#4a7c59',
                    fontWeight: '600',
                    fontSize: '12px',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Status
                  </div>
                  <div style={{
                    color: contract.StatusDescription === 'Active' ? '#2e7d32' : '#d32f2f',
                    fontWeight: '600',
                    fontSize: '14px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }} title={contract.StatusDescription || 'N/A'}>
                    {contract.StatusDescription || 'N/A'}
                  </div>
                </div>

                {/* Project Number */}
                <div style={{ minWidth: '200px', flex: '0 0 200px' }}>
                  <div style={{
                    color: '#4a7c59',
                    fontWeight: '600',
                    fontSize: '12px',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Project Number
                  </div>
                  <div style={{
                    color: '#2d4a1f',
                    fontWeight: '500',
                    fontSize: '14px'
                  }} title={contract.ProjectNumber || 'N/A'}>
                    {contract.ProjectNumber || 'N/A'}
                  </div>
                </div>

                {/* Project Name */}
                <div style={{ minWidth: '200px', flex: '1 1 200px' }}>
                  <div style={{
                    color: '#4a7c59',
                    fontWeight: '600',
                    fontSize: '12px',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Project Name
                  </div>
                  <div style={{
                    color: '#2d4a1f',
                    fontWeight: '500',
                    fontSize: '14px'
                  }} title={contract.ProjectName || 'N/A'}>
                    {contract.ProjectName || 'N/A'}
                  </div>
                </div>

                {/* Prime Contractor */}
                <div style={{ minWidth: '200px', flex: '1 1 200px' }}>
                  <div style={{
                    color: '#4a7c59',
                    fontWeight: '600',
                    fontSize: '12px',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Prime Contractor
                  </div>
                  <div style={{
                    color: '#2d4a1f',
                    fontWeight: '500',
                    fontSize: '14px'
                  }} title={contract.PrimeContractorName || 'N/A'}>
                    {contract.PrimeContractorName || 'N/A'}
                  </div>
                </div>

                {/* Base Amount */}
                <div style={{ minWidth: '180px', flex: '0 1 180px' }}>
                  <div style={{
                    color: '#4a7c59',
                    fontWeight: '600',
                    fontSize: '12px',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Base Amount
                  </div>
                  <div style={{
                    color: '#2d4a1f',
                    fontWeight: '500',
                    fontSize: '14px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }} title={formatCurrency(contract.BaseContractAmount)}>
                    {formatCurrency(contract.BaseContractAmount)}
                  </div>
                </div>

                {/* Adjusted Contract Amount */}
                <div style={{ minWidth: '230px', flex: '0 1 230px' }}>
                  <div style={{
                    color: '#4a7c59',
                    fontWeight: '600',
                    fontSize: '12px',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Adjusted Contract Amount
                  </div>
                  <div style={{
                    color: '#2d4a1f',
                    fontWeight: '500',
                    fontSize: '14px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }} title={formatCurrency(contract.AdjustedContractAmount)}>
                    {formatCurrency(contract.AdjustedContractAmount)}
                  </div>
                </div>

                {/* Wage Effective Date */}
                <div style={{ minWidth: '180px', flex: '0 1 180px' }}>
                  <div style={{
                    color: '#4a7c59',
                    fontWeight: '600',
                    fontSize: '12px',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Wage Effective Date
                  </div>
                  <div style={{
                    color: '#2d4a1f',
                    fontWeight: '500',
                    fontSize: '14px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }} title={formatDate(contract.WageEffectiveDate)}>
                    {formatDate(contract.WageEffectiveDate)}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ContractDetails;

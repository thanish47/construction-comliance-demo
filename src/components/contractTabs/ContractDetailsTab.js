import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import contractsData from '../../data/contracts.json';
import RightSideBar from '../RightSideBar';
import CreateContactForm from '../CreateContactForm';

const ContractDetailsTab = () => {
  const { contractNumber } = useParams();
  const contract = contractsData.find(c => c.ContractNumber === contractNumber);

  // State for create contact form panel
  const [createContactFormActive, setCreateContactFormActive] = useState(false);

  // State for edit mode - supports editing multiple sections
  const [editMode, setEditMode] = useState(false);
  const [editingSections, setEditingSections] = useState(new Set());
  const [editedData, setEditedData] = useState({});

  const openCreateContactForm = () => {
    setCreateContactFormActive(true);
  };

  const closeCreateContactForm = () => {
    setCreateContactFormActive(false);
  };

  const handleCreateContact = (formData) => {
    console.log('Creating contact:', formData);
    // TODO: Add API call to create contact
    alert('Contact creation functionality will be implemented here.');
  };

  const handleEdit = (section) => {
    setEditMode(true);
    setEditingSections(prev => new Set(prev).add(section));
    // Initialize edited data with current contract values if not already initialized
    if (Object.keys(editedData).length === 0) {
      setEditedData({ ...contract });
    }
    // Scroll to top to show save button
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = () => {
    // TODO: Add API call to save data
    console.log('Saving data:', editedData);
    // Update the contract data (in real app, this would update the data source)
    Object.assign(contract, editedData);
    // Exit edit mode
    setEditMode(false);
    setEditingSections(new Set());
    setEditedData({});
    alert('Changes saved successfully!');
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditingSections(new Set());
    setEditedData({});
  };

  const handleFieldChange = (fieldName, value) => {
    setEditedData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  if (!contract) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ color: '#d32f2f' }}>Contract not found.</p>
      </div>
    );
  }

  // Responsive min-width for cards
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 767;
  const isTablet = typeof window !== 'undefined' && window.innerWidth > 767 && window.innerWidth <= 1024;

  const sectionStyle = {
    padding: isMobile ? '15px' : '20px',
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    minWidth: isMobile ? '280px' : isTablet ? '400px' : '600px'
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1b5e20',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '2px solid rgba(142, 169, 78, 0.3)'
  };

  const twoColumnContainerStyle = {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap'
  };

  const columnStyle = {
    flex: '1 1 45%',
    minWidth: '250px'
  };

  const fieldStyle = {
    marginBottom: '16px'
  };

  const fieldLabelStyle = {
    color: '#4a7c59',
    fontWeight: '600',
    fontSize: '13px',
    display: 'block',
    marginBottom: '4px'
  };

  const fieldValueStyle = {
    color: '#2d4a1f',
    fontWeight: '400',
    fontSize: '14px',
    display: 'block',
    wordBreak: 'break-word'
  };

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile
      ? '1fr'
      : isTablet
        ? 'repeat(auto-fit, minmax(400px, 1fr))'
        : 'repeat(auto-fit, minmax(600px, 1fr))',
    gap: isMobile ? '15px' : '10px',
    padding: isMobile ? '5px' : '10px'
  };

  const isSectionEditing = (section) => editMode && editingSections.has(section);

  const getEditableValue = (fieldName, currentValue = '') =>
    editedData[fieldName] !== undefined ? editedData[fieldName] : (currentValue ?? '');

  const contractAmountInfoEditing = isSectionEditing('contractAmountInfo');
  const wageInfoEditing = isSectionEditing('wageInfo');

  // Input style for edit mode
  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    fontSize: '14px',
    border: '1px solid rgba(142, 169, 78, 0.3)',
    borderRadius: '6px',
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#2d4a1f',
    fontWeight: '400',
    boxSizing: 'border-box'
  };

  // Helper function to render field value or input
  const renderField = (section, fieldName, currentValue, displayValue = null, customStyle = {}) => {
    const isEditing = isSectionEditing(section);
    const valueToDisplay = displayValue !== null ? displayValue : (currentValue || 'N/A');

    if (isEditing) {
      return (
        <input
          type="text"
          value={getEditableValue(fieldName, currentValue) || ''}
          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
          style={inputStyle}
        />
      );
    }

    return <span style={{ ...fieldValueStyle, ...customStyle }}>{valueToDisplay}</span>;
  };

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

  return (
    <>
      {/* Save/Cancel Buttons - Fixed at top right */}
      {editMode && (
        <div style={{
          position: 'sticky',
          top: '120px',
          right: '20px',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          marginBottom: '15px'
        }}>
          <button
            onClick={handleCancel}
            style={{
              padding: '10px 20px',
              background: 'rgba(200, 200, 200, 0.85)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: '#666',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(200, 200, 200, 1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(200, 200, 200, 0.85)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '10px 20px',
              background: 'rgba(142, 169, 78, 0.85)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(142, 169, 78, 1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(142, 169, 78, 0.85)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px', fill: 'currentColor' }}>
              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
            </svg>
            Save Changes
          </button>
        </div>
      )}

      <div style={gridContainerStyle}>
        {/* Contract Details */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid rgba(142, 169, 78, 0.3)', paddingBottom: '10px' }}>
            <h2 style={{ ...sectionTitleStyle, marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>Contract Details</h2>
            {!(editMode && editingSections.has('contractDetails')) && (
              <button
                onClick={() => handleEdit('contractDetails')}
                title="Edit Contract Details"
                style={{
                  padding: '6px',
                  background: 'rgba(25, 118, 210, 0.1)',
                  border: '1px solid rgba(25, 118, 210, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(25, 118, 210, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(25, 118, 210, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(25, 118, 210, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(25, 118, 210, 0.3)';
                }}
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px', fill: '#1976d2' }}>
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
            )}
          </div>

          <div style={fieldStyle}>
            <span style={fieldLabelStyle}>Contract Number</span>
            {renderField('contractDetails', 'ContractNumber', contract.ContractNumber)}
          </div>

          <div style={fieldStyle}>
            <span style={fieldLabelStyle}>Contract Name</span>
            {renderField('contractDetails', 'ContractName', contract.ContractName)}
          </div>
        </div>

        {/* Street Address */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid rgba(142, 169, 78, 0.3)', paddingBottom: '10px' }}>
            <h2 style={{ ...sectionTitleStyle, marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>Street Address</h2>
            {!(editMode && editingSections.has('streetAddress')) && (
              <button
                onClick={() => handleEdit('streetAddress')}
                title="Edit Street Address"
                style={{
                  padding: '6px',
                  background: 'rgba(25, 118, 210, 0.1)',
                  border: '1px solid rgba(25, 118, 210, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(25, 118, 210, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(25, 118, 210, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(25, 118, 210, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(25, 118, 210, 0.3)';
                }}
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px', fill: '#1976d2' }}>
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
            )}
          </div>

          <div style={twoColumnContainerStyle}>
            {/* Left Column */}
            <div style={columnStyle}>
              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>Address Line</span>
                {renderField('streetAddress', 'AddressLine1', contract.AddressLine1)}
              </div>

              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>City</span>
                {renderField('streetAddress', 'City', contract.City)}
              </div>

              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>State</span>
                {renderField('streetAddress', 'State', contract.State)}
              </div>
            </div>

            {/* Right Column */}
            <div style={columnStyle}>
              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>ZIP Code</span>
                {renderField('streetAddress', 'Zipcode', contract.Zipcode)}
              </div>

              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>Locale</span>
                {renderField('streetAddress', 'LocaleName', contract.LocaleName)}
              </div>
            </div>
          </div>
        </div>

        {/* Contract & Amount Information */}
        <div style={{ ...sectionStyle }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid rgba(142, 169, 78, 0.3)', paddingBottom: '10px' }}>
            <h2 style={{ ...sectionTitleStyle, marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>Contract & Amount Information</h2>
            {!contractAmountInfoEditing && (
              <button
                onClick={() => handleEdit('contractAmountInfo')}
                title="Edit Contract & Amount Information"
                style={{
                  padding: '6px',
                  background: 'rgba(25, 118, 210, 0.1)',
                  border: '1px solid rgba(25, 118, 210, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(25, 118, 210, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(25, 118, 210, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(25, 118, 210, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(25, 118, 210, 0.3)';
                }}
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px', fill: '#1976d2' }}>
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
            )}
          </div>

          <div style={twoColumnContainerStyle}>
            {/* Left Column */}
            <div style={columnStyle}>
              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>Base Bid Amount</span>
                {contractAmountInfoEditing ? (
                  <input
                    type="number"
                    value={editedData.BaseBidAmount ?? contract.BaseBidAmount ?? 0}
                    onChange={(e) => handleFieldChange('BaseBidAmount', parseFloat(e.target.value) || 0)}
                    style={inputStyle}
                  />
                ) : (
                  <span style={fieldValueStyle}>{formatCurrency(contract.BaseBidAmount)}</span>
                )}
              </div>

              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>Base Contract Amount</span>
                {contractAmountInfoEditing ? (
                  <input
                    type="number"
                    value={editedData.BaseContractAmount ?? contract.BaseContractAmount ?? 0}
                    onChange={(e) => handleFieldChange('BaseContractAmount', parseFloat(e.target.value) || 0)}
                    style={inputStyle}
                  />
                ) : (
                  <span style={fieldValueStyle}>{formatCurrency(contract.BaseContractAmount)}</span>
                )}
              </div>

              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>Adjusted Contract Amount</span>
                {contractAmountInfoEditing ? (
                  <input
                    type="number"
                    value={editedData.AdjustedContractAmount ?? contract.AdjustedContractAmount ?? 0}
                    onChange={(e) => handleFieldChange('AdjustedContractAmount', parseFloat(e.target.value) || 0)}
                    style={inputStyle}
                  />
                ) : (
                  <span style={fieldValueStyle}>{formatCurrency(contract.AdjustedContractAmount)}</span>
                )}
              </div>

              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>Paid To Date</span>
                {contractAmountInfoEditing ? (
                  <input
                    type="number"
                    value={editedData.PaidToDateAmount ?? contract.PaidToDateAmount ?? 0}
                    onChange={(e) => handleFieldChange('PaidToDateAmount', parseFloat(e.target.value) || 0)}
                    style={inputStyle}
                  />
                ) : (
                  <span style={fieldValueStyle}>{formatCurrency(contract.PaidToDateAmount)}</span>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div style={columnStyle}>
              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>Prime Contractor</span>
                {renderField('contractAmountInfo', 'PrimeContractorName', contract.PrimeContractorName)}
              </div>

              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>Contract Status</span>
                {renderField('contractAmountInfo', 'StatusDescription', contract.StatusDescription, null, {
                  color: contract.StatusDescription === 'Active' ? '#2e7d32' : '#d32f2f',
                  fontWeight: '600'
                })}
              </div>

              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>Addl Contract #</span>
                {renderField('contractAmountInfo', 'AddlContractNumber', contract.AddlContractNumber)}
              </div>
            </div>
          </div>
        </div>

        {/* Wage Information */}
        <div style={{ ...sectionStyle }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid rgba(142, 169, 78, 0.3)', paddingBottom: '10px' }}>
            <h2 style={{ ...sectionTitleStyle, marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>Wage Information</h2>
            {!wageInfoEditing && (
              <button
                onClick={() => handleEdit('wageInfo')}
                title="Edit Wage Information"
                style={{
                  padding: '6px',
                  background: 'rgba(25, 118, 210, 0.1)',
                  border: '1px solid rgba(25, 118, 210, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(25, 118, 210, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(25, 118, 210, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(25, 118, 210, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(25, 118, 210, 0.3)';
                }}
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px', fill: '#1976d2' }}>
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
            )}
          </div>

          <div style={twoColumnContainerStyle}>
            {/* Left Column */}
            <div style={columnStyle}>
              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>Wage Type</span>
                {renderField('wageInfo', 'WageTypeName', contract.WageTypeName)}
              </div>

              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>Wage Effective Date</span>
                {wageInfoEditing ? (
                  <input
                    type="date"
                    value={editedData.WageEffectiveDate ?? contract.WageEffectiveDate ?? ''}
                    onChange={(e) => handleFieldChange('WageEffectiveDate', e.target.value)}
                    style={inputStyle}
                  />
                ) : (
                  <span style={fieldValueStyle}>{formatDate(contract.WageEffectiveDate)}</span>
                )}
              </div>

              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>County</span>
                {renderField('wageInfo', 'CountyName', contract.CountyName)}
              </div>
            </div>

            {/* Right Column */}
            <div style={columnStyle}>
              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>Wage</span>
                {renderField('wageInfo', 'WageCode', contract.WageCode)}
              </div>

              <div style={fieldStyle}>
                <span style={fieldLabelStyle}>Enable Payroll Extract</span>
                {wageInfoEditing ? (
                  <select
                    value={editedData.EnablePayrollsExtract ?? contract.EnablePayrollsExtract ?? false}
                    onChange={(e) => handleFieldChange('EnablePayrollsExtract', e.target.value === 'true')}
                    style={inputStyle}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : (
                  <span style={fieldValueStyle}>{contract.EnablePayrollsExtract ? 'Yes' : 'No'}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contacts */}
        <div style={{ ...sectionStyle, gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ ...sectionTitleStyle, marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>Contacts</h2>
            <button
              onClick={openCreateContactForm}
              style={{
                padding: '8px 16px',
                background: 'rgba(142, 169, 78, 0.85)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(142, 169, 78, 1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(142, 169, 78, 0.85)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '16px', height: '16px', fill: 'currentColor' }}
              >
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Create Contact
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(142, 169, 78, 0.3)' }}>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: '#1b5e20', fontWeight: '600' }}>First Name</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: '#1b5e20', fontWeight: '600' }}>Last Name</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: '#1b5e20', fontWeight: '600' }}>Title</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: '#1b5e20', fontWeight: '600' }}>Organization</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: '#1b5e20', fontWeight: '600' }}>Telephone</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: '#1b5e20', fontWeight: '600' }}>Mobile Phone</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: '#1b5e20', fontWeight: '600' }}>Email</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', color: '#1b5e20', fontWeight: '600', width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contract.Contacts && contract.Contacts.length > 0 ? (
                  contract.Contacts.map((contact, index) => (
                    <tr key={index} style={{
                      borderBottom: '1px solid rgba(142, 169, 78, 0.15)',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(142, 169, 78, 0.05)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '12px 8px', color: '#2d4a1f' }}>{contact.FirstName || 'N/A'}</td>
                      <td style={{ padding: '12px 8px', color: '#2d4a1f' }}>{contact.LastName || 'N/A'}</td>
                      <td style={{ padding: '12px 8px', color: '#2d4a1f' }}>{contact.Title || 'N/A'}</td>
                      <td style={{ padding: '12px 8px', color: '#2d4a1f' }}>{contact.Organization || 'N/A'}</td>
                      <td style={{ padding: '12px 8px', color: '#2d4a1f' }}>{contact.Telephone || 'N/A'}</td>
                      <td style={{ padding: '12px 8px', color: '#2d4a1f' }}>{contact.MobilePhone || 'N/A'}</td>
                      <td style={{ padding: '12px 8px', color: '#2d4a1f' }}>
                        {contact.Email ? (
                          <a href={`mailto:${contact.Email}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                            {contact.Email}
                          </a>
                        ) : 'N/A'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => alert(`Edit contact: ${contact.FirstName} ${contact.LastName}`)}
                            title="Edit Contact"
                            style={{
                              padding: '4px 8px',
                              background: 'rgba(25, 118, 210, 0.1)',
                              border: '1px solid rgba(25, 118, 210, 0.3)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = 'rgba(25, 118, 210, 0.2)';
                              e.currentTarget.style.borderColor = 'rgba(25, 118, 210, 0.5)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = 'rgba(25, 118, 210, 0.1)';
                              e.currentTarget.style.borderColor = 'rgba(25, 118, 210, 0.3)';
                            }}
                          >
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '14px', height: '14px', fill: '#1976d2' }}>
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete contact: ${contact.FirstName} ${contact.LastName}?`)) {
                                alert('Delete functionality will be implemented');
                              }
                            }}
                            title="Delete Contact"
                            style={{
                              padding: '4px 8px',
                              background: 'rgba(211, 47, 47, 0.1)',
                              border: '1px solid rgba(211, 47, 47, 0.3)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = 'rgba(211, 47, 47, 0.2)';
                              e.currentTarget.style.borderColor = 'rgba(211, 47, 47, 0.5)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = 'rgba(211, 47, 47, 0.1)';
                              e.currentTarget.style.borderColor = 'rgba(211, 47, 47, 0.3)';
                            }}
                          >
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '14px', height: '14px', fill: '#d32f2f' }}>
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: '#4a7c59', fontStyle: 'italic' }}>
                      No contacts found for this contract.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Contact Form Panel - Rendered via Portal */}
      {createPortal(
        <RightSideBar
          isActive={createContactFormActive}
          onClose={closeCreateContactForm}
          title="Create New Contact"
          minWidth={540}
        >
          <CreateContactForm
            onClose={closeCreateContactForm}
            onSubmit={handleCreateContact}
            projectNumber={contractNumber}
          />
        </RightSideBar>,
        document.body
      )}
    </>
  );
};

export default ContractDetailsTab;

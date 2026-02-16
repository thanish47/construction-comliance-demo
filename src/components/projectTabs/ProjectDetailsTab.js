import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import projectsData from '../../data/projects.json';
import RightSideBar from '../RightSideBar';
import CreateContactForm from '../CreateContactForm';

const ProjectDetailsTab = () => {
  const { projectNumber } = useParams();
  const project = projectsData.find(p => p.ProjectNumber === projectNumber);

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
    // Initialize edited data with current project values if not already initialized
    if (Object.keys(editedData).length === 0) {
      setEditedData({ ...project });
    }
    // Scroll to top to show save button
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = () => {
    // TODO: Add API call to save data
    console.log('Saving data:', editedData);
    // Update the project data (in real app, this would update the data source)
    Object.assign(project, editedData);
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

  if (!project) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ color: '#d32f2f' }}>Project not found.</p>
      </div>
    );
  }

  // Responsive min-width for cards
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 767;
  const isTablet = typeof window !== 'undefined' && window.innerWidth > 767 && window.innerWidth <= 1024;

  const sectionStyle = {
    // marginBottom: '10px',
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

  const detailRowStyle = {
    display: 'flex',
    marginBottom: '12px',
    fontSize: '14px',
    lineHeight: '1.6'
  };

  const labelStyle = {
    color: '#4a7c59',
    fontWeight: '500',
    minWidth: '200px',
    flexShrink: 0
  };

  const valueStyle = {
    color: '#2d4a1f',
    fontWeight: '400',
    flex: 1
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

  const datesInfoEditing = isSectionEditing('datesInfo');
  const costInfoEditing = isSectionEditing('costInfo');

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
        {/* Basic Information */}
        <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid rgba(142, 169, 78, 0.3)', paddingBottom: '10px' }}>
          <h2 style={{ ...sectionTitleStyle, marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>Basic Information</h2>
          {!(editMode && editingSections.has('basicInfo')) && (
            <button
              onClick={() => handleEdit('basicInfo')}
              title="Edit Basic Information"
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
              <span style={fieldLabelStyle}>Project Number</span>
              {renderField('basicInfo', 'ProjectNumber', project.ProjectNumber)}
            </div>

            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Project Status</span>
              {renderField('basicInfo', 'ProjectStatusDescription', project.ProjectStatusDescription, null, {
                color: project.ProjectStatusDescription === 'Active' ? '#2e7d32' :
                       project.ProjectStatusDescription === 'Prelim' ? '#1976d2' :
                       project.ProjectStatusDescription === 'Complete' ? '#616161' :
                       project.ProjectStatusDescription === 'Inactive' ? '#d32f2f' : '#2d4a1f',
                fontWeight: '600'
              })}
            </div>

            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Project Type</span>
              {renderField('basicInfo', 'ProjectTypeDescription', project.ProjectTypeDescription)}
            </div>
            
          </div>

          {/* Right Column */}
          <div style={columnStyle}>
            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Project Name</span>
              {renderField('basicInfo', 'ProjectName', project.ProjectName)}
            </div>

            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Locale Lookup URL</span>
              {renderField('basicInfo', 'LocaleLookupUrl', project.LocaleLookupUrl)}
            </div>

            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Regulation Type</span>
              {renderField('basicInfo', 'ProjectRegulationTypes', project.ProjectRegulationTypes)}
            </div>
          </div>
        </div>
      </div>

      {/* Agency and Client Information */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid rgba(142, 169, 78, 0.3)', paddingBottom: '10px' }}>
          <h2 style={{ ...sectionTitleStyle, marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>Agency and Client Information</h2>
          {!(editMode && editingSections.has('agencyInfo')) && (
            <button
              onClick={() => handleEdit('agencyInfo')}
              title="Edit Agency and Client Information"
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
              <span style={fieldLabelStyle}>Project Agency</span>
              {renderField('agencyInfo', 'PrimaryAgencyName', project.PrimaryAgencyName)}
            </div>
            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Funding Agency</span>
              {renderField('agencyInfo', 'FundingAgency', project.FundingAgency)}
            </div>
            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Client</span>
              {renderField('agencyInfo', 'ClientName', project.ClientName)}
            </div>

          </div>

          {/* Right Column */}
          <div style={columnStyle}>
            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Other Primary Agency</span>
              {renderField('agencyInfo', 'OtherPrimaryAgency', project.OtherPrimaryAgency)}
            </div>
            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Other Funding Agency</span>
              {renderField('agencyInfo', 'OtherFundingAgency', project.OtherFundingAgency)}
            </div>
            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Compliance Officer</span>
              {renderField('agencyInfo', 'ComplianceOfficerDisplay', project.ComplianceOfficerDisplay)}
            </div>
          </div>
        </div>

      </div>

      {/* Location Information */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid rgba(142, 169, 78, 0.3)', paddingBottom: '10px' }}>
          <h2 style={{ ...sectionTitleStyle, marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>Location Information</h2>
          {!(editMode && editingSections.has('locationInfo')) && (
            <button
              onClick={() => handleEdit('locationInfo')}
              title="Edit Location Information"
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
              <span style={fieldLabelStyle}>Address</span>
              {renderField('locationInfo', 'Address1', project.Address1)}
            </div>

            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>City</span>
              {renderField('locationInfo', 'City', project.City)}
            </div>

            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>State</span>
              {renderField('locationInfo', 'State', project.State)}
            </div>
          </div>

          {/* Right Column */}
          <div style={columnStyle}>
            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Postal Code</span>
              {renderField('locationInfo', 'PostalCode', project.PostalCode)}
            </div>

            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Locale Lookup URL</span>
              {renderField(
                'locationInfo',
                'LocaleLookupUrl',
                project.LocaleLookupUrl,
                project.LocaleLookupUrl ? (
                  <a
                    href={project.LocaleLookupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#1976d2', textDecoration: 'none' }}
                  >
                    {project.LocaleLookupUrl}
                  </a>
                ) : 'N/A'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Dates Information */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid rgba(142, 169, 78, 0.3)', paddingBottom: '10px' }}>
          <h2 style={{ ...sectionTitleStyle, marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>Project Dates Information</h2>
          {!datesInfoEditing && (
            <button
              onClick={() => handleEdit('datesInfo')}
              title="Edit Project Dates Information"
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
              <span style={fieldLabelStyle}>Project Start Date</span>
              {renderField('datesInfo', 'ProjectStartDate', project.ProjectStartDate)}
            </div>

            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Bid Opening Date</span>
              {renderField('datesInfo', 'BidOpeningDate', project.BidOpeningDate)}
            </div>

            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Pre Construction Meeting</span>
              {renderField('datesInfo', 'PreConstructionMeeting', project.PreConstructionMeeting)}
            </div>
          </div>

          {/* Right Column */}
          <div style={columnStyle}>
            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Project End Date</span>
              {renderField('datesInfo', 'ProjectEndDate', project.ProjectEndDate)}
            </div>

            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Pre Bid Meeting Date</span>
              {renderField('datesInfo', 'PreBidMeetingDate', project.PreBidMeetingDate)}
            </div>

            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Notice To Proceed Date</span>
              {renderField('datesInfo', 'NoticeToProceedDate', project.NoticeToProceedDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Project Cost Information */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid rgba(142, 169, 78, 0.3)', paddingBottom: '10px' }}>
          <h2 style={{ ...sectionTitleStyle, marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>Project Cost Information</h2>
          {!costInfoEditing && (
            <button
              onClick={() => handleEdit('costInfo')}
              title="Edit Project Cost Information"
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
              <span style={fieldLabelStyle}>Project Base Cost</span>
              {costInfoEditing ? (
                <input
                  type="number"
                  value={editedData.ProjectBaseCost ?? project.ProjectBaseCost ?? 0}
                  onChange={(e) => handleFieldChange('ProjectBaseCost', parseFloat(e.target.value) || 0)}
                  style={inputStyle}
                />
              ) : (
                <span style={fieldValueStyle}>${project.ProjectBaseCost?.toLocaleString() || '0'}</span>
              )}
            </div>

            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Actual Project Costs</span>
              {costInfoEditing ? (
                <input
                  type="number"
                  value={editedData.ActualProjectCosts ?? project.ActualProjectCosts ?? 0}
                  onChange={(e) => handleFieldChange('ActualProjectCosts', parseFloat(e.target.value) || 0)}
                  style={inputStyle}
                />
              ) : (
                <span style={fieldValueStyle}>${project.ActualProjectCosts?.toLocaleString() || '0'}</span>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div style={columnStyle}>
            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Estimated Project Costs</span>
              {costInfoEditing ? (
                <input
                  type="number"
                  value={editedData.EstimatedProjectCosts ?? project.EstimatedProjectCosts ?? 0}
                  onChange={(e) => handleFieldChange('EstimatedProjectCosts', parseFloat(e.target.value) || 0)}
                  style={inputStyle}
                />
              ) : (
                <span style={fieldValueStyle}>${project.EstimatedProjectCosts?.toLocaleString() || '0'}</span>
              )}
            </div>

            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Adjusted Project Costs</span>
              {costInfoEditing ? (
                <input
                  type="number"
                  value={editedData.AdjustedProjectCosts ?? project.AdjustedProjectCosts ?? 0}
                  onChange={(e) => handleFieldChange('AdjustedProjectCosts', parseFloat(e.target.value) || 0)}
                  style={inputStyle}
                />
              ) : (
                <span style={fieldValueStyle}>${project.AdjustedProjectCosts?.toLocaleString() || '0'}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Information */}
      <div style={{ ...sectionStyle }}>
        <h2 style={sectionTitleStyle}>Audit Information</h2>

        <div style={twoColumnContainerStyle}>
          {/* Left Column */}
          <div style={columnStyle}>
            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Created By</span>
              <span style={fieldValueStyle}>{project.CreatedBy || 'N/A'}</span>
            </div>
            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Modified By</span>
              <span style={fieldValueStyle}>{project.ModifiedBy || 'N/A'}</span>
            </div>
          </div>

          {/* Right Column */}
          <div style={columnStyle}>
            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Created Date</span>
              <span style={fieldValueStyle}>{project.CreatedDate || 'N/A'}</span>
            </div>
            <div style={fieldStyle}>
              <span style={fieldLabelStyle}>Modified Date</span>
              <span style={fieldValueStyle}>{project.ModifiedDate || 'N/A'}</span>
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
              {project.Contacts && project.Contacts.length > 0 ? (
                <>
                  {project.Contacts.map((contact, index) => (
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
                  ))}
                  {/* Add empty rows to ensure minimum of 2 rows */}
                  {Array.from({ length: Math.max(0, 2 - project.Contacts.length) }).map((_, index) => (
                    <tr key={`empty-${index}`} style={{
                      borderBottom: '1px solid rgba(142, 169, 78, 0.15)',
                      height: '49px'
                    }}>
                      <td style={{ padding: '12px 8px', color: 'transparent' }}>&nbsp;</td>
                      <td style={{ padding: '12px 8px', color: 'transparent' }}>&nbsp;</td>
                      <td style={{ padding: '12px 8px', color: 'transparent' }}>&nbsp;</td>
                      <td style={{ padding: '12px 8px', color: 'transparent' }}>&nbsp;</td>
                      <td style={{ padding: '12px 8px', color: 'transparent' }}>&nbsp;</td>
                      <td style={{ padding: '12px 8px', color: 'transparent' }}>&nbsp;</td>
                      <td style={{ padding: '12px 8px', color: 'transparent' }}>&nbsp;</td>
                      <td style={{ padding: '12px 8px', color: 'transparent' }}>&nbsp;</td>
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  <tr>
                    <td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: '#4a7c59', fontStyle: 'italic' }}>
                      No contacts found for this project.
                    </td>
                  </tr>
                  {/* Add one more empty row to make it 2 rows total */}
                  <tr style={{
                    borderBottom: '1px solid rgba(142, 169, 78, 0.15)',
                    height: '49px'
                  }}>
                    <td style={{ padding: '12px 8px', color: 'transparent' }}>&nbsp;</td>
                    <td style={{ padding: '12px 8px', color: 'transparent' }}>&nbsp;</td>
                    <td style={{ padding: '12px 8px', color: 'transparent' }}>&nbsp;</td>
                    <td style={{ padding: '12px 8px', color: 'transparent' }}>&nbsp;</td>
                    <td style={{ padding: '12px 8px', color: 'transparent' }}>&nbsp;</td>
                    <td style={{ padding: '12px 8px', color: 'transparent' }}>&nbsp;</td>
                    <td style={{ padding: '12px 8px', color: 'transparent' }}>&nbsp;</td>
                    <td style={{ padding: '12px 8px', color: 'transparent' }}>&nbsp;</td>
                  </tr>
                </>
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
            projectNumber={projectNumber}
          />
        </RightSideBar>,
        document.body
      )}
    </>
  );
};

export default ProjectDetailsTab;

import projectsData from '../data/projects.json';

const QuickProjectDetails = ({ projectNumber }) => {
  const project = projectsData.find(p => p.ProjectNumber === projectNumber);

  if (!project) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ color: '#d32f2f', fontSize: '14px' }}>
          Project not found.
        </p>
      </div>
    );
  }

  const detailItemStyle = {
    marginBottom: '12px',
    fontSize: '14px',
    lineHeight: '1.6',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const labelStyle = {
    color: '#4a7c59',
    fontWeight: '500',
    display: 'inline-block',
    minWidth: '180px',
    flexShrink: 0
  };

  const valueStyle = {
    color: '#2d4a1f',
    fontWeight: '400',
    flex: 1,
    minWidth: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const separatorStyle = {
    height: '1px',
    background: 'rgba(142, 169, 78, 0.3)',
    margin: '15px 0',
    border: 'none'
  };

  const localeLinkStyle = {
    color: '#1976d2',
    textDecoration: 'none',
    display: 'inline-block',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const ValueText = ({ value, children, style }) => {
    const textValue = value === null || value === undefined ? '' : String(value);
    return (
      <span style={{ ...valueStyle, ...style }} title={textValue}>
        {children ?? textValue}
      </span>
    );
  };

  const addressParts = [];
  if (project.Address1) addressParts.push(project.Address1);
  if (project.City || project.State) {
    addressParts.push([project.City, project.State].filter(Boolean).join(', '));
  }
  if (project.PostalCode) addressParts.push(project.PostalCode);
  const addressDisplay = addressParts.join(', ');

  return (
    <div style={{ padding: '20px' }}>
      <div style={detailItemStyle}>
        <span style={labelStyle}>Project Name:</span>
        <ValueText value={project.ProjectName || ''} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Project Status:</span>
        <ValueText
          value={project.ProjectStatusDescription || ''}
          style={{
            color: project.ProjectStatusDescription === 'Active' ? '#2e7d32'
              : project.ProjectStatusDescription === 'Planning' ? '#1976d2'
              : project.ProjectStatusDescription === 'Completed' ? '#616161'
              : project.ProjectStatusDescription === 'On Hold' ? '#d32f2f'
              : '#2d4a1f',
            fontWeight: '600'
          }}
        />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Project Type:</span>
        <ValueText value={project.ProjectTypeDescription || ''} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Primary Agency:</span>
        <ValueText value={project.PrimaryAgencyName || ''} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Other Primary Agency:</span>
        <ValueText value={project.OtherPrimaryAgency || ''} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Funding Agency:</span>
        <ValueText value={project.FundingAgency || ''} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Other Funding Agency:</span>
        <ValueText value={project.OtherFundingAgency || ''} />
      </div>

      <hr style={separatorStyle} />

      <div style={detailItemStyle}>
        <span style={labelStyle}>Client:</span>
        <ValueText value={project.ClientName || ''} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Compliance Officer:</span>
        <ValueText value={project.ComplianceOfficerDisplay || ''} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Contractor Regulation Type:</span>
        <ValueText value={project.ContractorRegulationType || ''} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Locale Lookup URL:</span>
        <ValueText value={project.LocaleLookupUrl || ''}>
          {project.LocaleLookupUrl ? (
            <a
              href={project.LocaleLookupUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={localeLinkStyle}
              title={project.LocaleLookupUrl}
            >
              {project.LocaleLookupUrl}
            </a>
          ) : ''}
        </ValueText>
      </div>

      <hr style={separatorStyle} />

      <div style={detailItemStyle}>
        <span style={labelStyle}>Created By:</span>
        <ValueText value={project.CreatedBy || ''} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Created Date:</span>
        <ValueText value={project.CreatedDate || ''} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Modified By:</span>
        <ValueText value={project.ModifiedBy || ''} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Modified Date:</span>
        <ValueText value={project.ModifiedDate || ''} />
      </div>

      <hr style={separatorStyle} />

      <div style={detailItemStyle}>
        <span style={labelStyle}>Address:</span>
        <ValueText value={addressDisplay} />
      </div>
    </div>
  );
};

export default QuickProjectDetails;

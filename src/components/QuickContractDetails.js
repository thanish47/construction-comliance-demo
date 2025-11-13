import contractsData from '../data/contracts.json';

const QuickContractDetails = ({ contractNumber }) => {
  const contract = contractsData.find(c => c.ContractNumber === contractNumber);

  if (!contract) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ color: '#d32f2f', fontSize: '14px' }}>
          Contract not found.
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
    minWidth: '190px',
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

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return '';
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return value;
    return `$${numericValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  };

  const ValueText = ({ value, children, style }) => {
    const textValue = value === null || value === undefined ? '' : String(value);
    return (
      <span style={{ ...valueStyle, ...style }} title={textValue}>
        {children ?? textValue}
      </span>
    );
  };

  const addressParts = [
    contract.AddressLine1,
    contract.AddressLine2,
    [contract.City, contract.State].filter(Boolean).join(', '),
    contract.Zipcode
  ].filter(Boolean);

  const addressDisplay = addressParts.join(', ');

  const booleanDisplay = (value) => value ? 'Yes' : 'No';

  return (
    <div style={{ padding: '20px' }}>
      <div style={detailItemStyle}>
        <span style={labelStyle}>Contract Number:</span>
        <ValueText value={contract.ContractNumber || ''} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Contract Name:</span>
        <ValueText value={contract.ContractName || ''} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Address:</span>
        <ValueText value={addressDisplay || ''} />
      </div>

      <hr style={separatorStyle} />

      <div style={detailItemStyle}>
        <span style={labelStyle}>Base Bid Amount:</span>
        <ValueText value={formatCurrency(contract.BaseBidAmount)} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Base Contract Amount:</span>
        <ValueText value={formatCurrency(contract.BaseContractAmount)} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Adjusted Contract Amount:</span>
        <ValueText value={formatCurrency(contract.AdjustedContractAmount)} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Paid To Date:</span>
        <ValueText value={formatCurrency(contract.PaidToDateAmount)} />
      </div>

      <hr style={separatorStyle} />

      <div style={detailItemStyle}>
        <span style={labelStyle}>Prime Contractor:</span>
        <ValueText value={contract.PrimeContractorName || ''} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Contract Status:</span>
        <ValueText value={contract.StatusDescription || ''} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Wage Type:</span>
        <ValueText value={contract.WageTypeName || ''} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Wage Effective Date:</span>
        <ValueText value={formatDate(contract.WageEffectiveDate)} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>County:</span>
        <ValueText value={contract.CountyName || ''} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Wage:</span>
        <ValueText value={contract.WageCode || ''} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Enable Payroll Extract:</span>
        <ValueText value={booleanDisplay(contract.EnablePayrollsExtract)} />
      </div>

      <div style={detailItemStyle}>
        <span style={labelStyle}>Addl Contract #:</span>
        <ValueText value={contract.AddlContractNumber || ''} />
      </div>
    </div>
  );
};

export default QuickContractDetails;

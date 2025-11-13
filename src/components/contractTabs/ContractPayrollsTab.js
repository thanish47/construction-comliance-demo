import { useParams } from 'react-router-dom';

const ContractPayrollsTab = () => {
  const { contractNumber } = useParams();

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1b5e20', marginBottom: '15px' }}>
        Payrolls
      </h2>
      <p style={{ color: '#4a7c59', fontSize: '14px' }}>
        Payrolls information for contract {contractNumber} will be displayed here.
      </p>
    </div>
  );
};

export default ContractPayrollsTab;

import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import projectsData from '../../data/projects.json';
import contractsData from '../../data/contracts.json';
import reportData from '../../data/ProjectExecutiveSummaryExtendedAggregate.json';

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const num = Number(value);
  if (Number.isNaN(num)) return '';
  return `$${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

const formatPercent = (value, digits = 1) => {
  if (value === null || value === undefined || value === '') return '';
  const num = Number(value);
  if (Number.isNaN(num)) return '';
  return `${num.toFixed(digits)}%`;
};

const percentFormatter = (digits = 1) => ({ value }) => formatPercent(value, digits);

const createProjectOptions = (projects) =>
  projects.map((project) => ({
    value: String(project.ProjectNumber),
    label: `${project.ProjectNumber} — ${project.ProjectName}`
  }));

const createContractOptions = (contracts) =>
  contracts.map((contract) => ({
    value: String(contract.ContractNumber),
    label: `${contract.ContractNumber} — ${contract.ContractName}`
  }));

// Clients options data
const DETAIL_GRID_HEIGHT = 360;
const DETAIL_ROW_PADDING = 30;

const clientOptions = [
  { value: '66', label: 'Alberici Corporation' },
  { value: '39', label: 'Alfred Benesch & Company' },
  { value: '73', label: 'Ariel Business Group, Inc.' },
  { value: '81', label: "BALLY'S CORPORATION" },
  { value: '87', label: 'BCAL-TC LESSEE LLC' },
  { value: '92', label: 'Bulley & Andrews' },
  { value: '1', label: 'Chicago Housing Authority' },
  { value: '3', label: 'Chicago Public Building Commission' },
  { value: '77', label: 'City of Atlanta' },
  { value: '74', label: 'City of East Chicago, Planning and Economic Business Development' },
  { value: '91', label: 'City of Houston - IAH' },
  { value: '42', label: 'City Test' },
  { value: '43', label: 'City Test Client' },
  { value: '61', label: 'Clayco/CBRE' },
  { value: '63', label: 'client client' },
  { value: '56', label: 'CMO, A JOINT VENTURE' },
  { value: '27', label: 'Cook County of Illinois Demo' },
  { value: '59', label: 'D & K Associates-Demo' },
  { value: '49', label: 'F. H. Paschen, S. N. Nielsen' },
  { value: '38', label: 'Federal Test' },
  { value: '68', label: 'Foundation' },
  { value: '78', label: 'Gary Sanitary District' },
  { value: '75', label: 'Gilbane, Inc.' },
  { value: '70', label: 'Green City University' },
  { value: '84', label: 'Hispanic American Construction Industry Association' },
  { value: '26', label: 'Illinois Sports Facilities Authority' },
  { value: '65', label: 'James McHugh Construction Co.' },
  { value: '83', label: 'John G. Shedd Aquarium' },
  { value: '58', label: 'Kwame Building Group' },
  { value: '45', label: 'LA Metro' },
  { value: '51', label: 'Maman Corp' },
  { value: '37', label: 'Massport Demo 1' },
  { value: '64', label: 'Melissa Test Client' },
  { value: '60', label: 'MO City Test' },
  { value: '94', label: 'Monoceros Corporation' },
  { value: '85', label: 'Norfolk Southern' },
  { value: '29', label: 'Orange Bay Company, Inc.' },
  { value: '55', label: 'PARIC Corporation' },
  { value: '82', label: 'Pepper Construction Company' },
  { value: '46', label: 'Pullman Park Development LLC' },
  { value: '79', label: 'Racine County, Wisconsin' },
  { value: '80', label: 'Reed Construction' },
  { value: '76', label: 'Related Midwest' },
  { value: '44', label: "Roundy's Supermarkets Inc." },
  { value: '96', label: 'RSD Construction' },
  { value: '25', label: 'Rush University Medical Center' },
  { value: '53', label: 'S. M. Wilson & Co.' },
  { value: '54', label: 'SLATE/City of St. Louis' },
  { value: '72', label: 'SLDC-TEST ENVIRONMENT' },
  { value: '57', label: 'SpendDemo' },
  { value: '62', label: 'St. Louis Development Corporation' },
  { value: '52', label: 'Tarlton Corporation' },
  { value: '2', label: 'Test Data' },
  { value: '69', label: 'Trinal Test Center' },
  { value: '40', label: 'Turner Test' },
  { value: '47', label: 'U.S. Architectural Glass & Metal' },
  { value: '4', label: 'University of Chicago Medical Center' },
  { value: '33', label: 'University State College' },
  { value: '50', label: 'Vitatech' },
  { value: '48', label: 'Vitatech Electromagnetics, LLC.' },
  { value: '67', label: 'William A. Randolph' }
];

const ContractScopeCellRenderer = (params) => {
  const { data, value, context } = params;
  const subcontractors = data?.parentRow?.subcontractors || data?.subcontractors || [];

  if (data?.isDetailRow) {
    if (!subcontractors.length) {
      return (
        <div style={{ padding: '10px 0', fontStyle: 'italic', color: '#2d4a1f' }}>
          No subcontractor details available.
        </div>
      );
    }

    return (
      <div style={{ padding: '10px 0', width: '100%' }}>
        <div
          className="ag-theme-balham"
          style={{
            width: '100%',
            height: `${DETAIL_GRID_HEIGHT}px`,
            background: 'transparent'
          }}
        >
          <AgGridReact
            gridOptions={context.gridOptions}
            rowData={subcontractors}
            columnDefs={context.subcontractorColumnDefs}
            defaultColDef={{
              resizable: true,
              sortable: true,
              minWidth: 120
            }}
            animateRows={true}
            suppressCellFocus={true}
            domLayout="normal"
            getRowStyle={context.getSubcontractorRowStyle}
            onGridReady={context.onGridReady}
          />
        </div>
      </div>
    );
  }

  const isExpandable = Array.isArray(subcontractors) && subcontractors.length > 0;
  const expanded = context?.expandedSummaryRows?.has(data?.id);
  const iconClass = expanded ? 'ag-icon ag-icon-tree-open': 'ag-icon ag-icon-tree-closed';

  const handleToggle = (event) => {
    event.stopPropagation();
    if (isExpandable && context?.toggleSummaryRow) {
      context.toggleSummaryRow(data.id);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {isExpandable ? 
        ( <span
          className={iconClass}
          onClick={isExpandable ? handleToggle : undefined}
          aria-disabled={!isExpandable}/>
        ): '•'}
      <span>{value}</span>
    </div>
  );
};

// Subcontractor table columns (remaining columns)
const subcontractorColumnDefs = [
  { field: 'subContractor', headerName: 'Sub Contractor, Ward, County & State', minWidth: 210 },
  { field: 'certificationAgency', headerName: 'Certification Agency', minWidth: 160 },
  { field: 'lbeAdjusted', headerName: 'LBE Adjusted', minWidth: 130, valueFormatter: ({ value }) => formatCurrency(value) },
  { field: 'lbeAdjustedPercent', headerName: '%', width: 80, valueFormatter: percentFormatter(1) },
  { field: 'mbeAdjusted', headerName: 'MBE Adjusted', minWidth: 130, valueFormatter: ({ value }) => formatCurrency(value) },
  { field: 'mbeAdjustedPercent', headerName: '%', width: 80, valueFormatter: percentFormatter(1) },
  { field: 'wbeAdjusted', headerName: 'WBE Adjusted', minWidth: 130, valueFormatter: ({ value }) => formatCurrency(value) },
  { field: 'wbeAdjustedPercent', headerName: '%', width: 80, valueFormatter: percentFormatter(1) },
  { field: 'sbeAdjusted', headerName: 'SBE Adjusted', minWidth: 130, valueFormatter: ({ value }) => formatCurrency(value) },
  { field: 'sbeAdjustedPercent', headerName: '%', width: 80, valueFormatter: percentFormatter(1) },
  { field: 'vbeAdjusted', headerName: 'VBE Adjusted', minWidth: 130, valueFormatter: ({ value }) => formatCurrency(value) },
  { field: 'vbeAdjustedPercent', headerName: '%', width: 80, valueFormatter: percentFormatter(1) },
  { field: 'lbePaidToDate', headerName: 'LBE Paid To Date', minWidth: 140, valueFormatter: ({ value }) => formatCurrency(value) },
  { field: 'lbePaidToDatePercent', headerName: '%', width: 80, valueFormatter: percentFormatter(2) },
  { field: 'mbePaidToDate', headerName: 'MBE Paid To Date', minWidth: 140, valueFormatter: ({ value }) => formatCurrency(value) },
  { field: 'mbePaidToDatePercent', headerName: '%', width: 80, valueFormatter: percentFormatter(2) },
  { field: 'wbePaidToDate', headerName: 'WBE Paid To Date', minWidth: 140, valueFormatter: ({ value }) => formatCurrency(value) },
  { field: 'wbePaidToDatePercent', headerName: '%', width: 80, valueFormatter: percentFormatter(2) },
  { field: 'sbePaidToDate', headerName: 'SBE Paid To Date', minWidth: 140, valueFormatter: ({ value }) => formatCurrency(value) },
  { field: 'sbePaidToDatePercent', headerName: '%', width: 80, valueFormatter: percentFormatter(2) },
  { field: 'vbePaidToDate', headerName: 'VBE Paid To Date', minWidth: 140, valueFormatter: ({ value }) => formatCurrency(value) },
  { field: 'vbePaidToDatePercent', headerName: '%', width: 80, valueFormatter: percentFormatter(2) }
];

const ProjectExecutiveSummaryExtendedAggregate = () => {
  const projectOptions = useMemo(() => createProjectOptions(projectsData), []);
  const allContractOptions = useMemo(() => createContractOptions(contractsData), []);
  const gridOptions = useMemo(() => ({ theme: 'legacy' }), []);
  const exportDropdownRef = useRef(null);

  const [filters, setFilters] = useState({
    client: '',
    projects: [],
    contracts: [],
    startDate: '',
    endDate: ''
  });
  const [summaryData, setSummaryData] = useState([]);
  const [subcontractorData, setSubcontractorData] = useState([]);
  const [expandedSummaryRows, setExpandedSummaryRows] = useState(() => new Set());
  const [hasGenerated, setHasGenerated] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 767;
  });

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setShowExportDropdown(false);
      }
    };

    if (showExportDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportDropdown]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter projects based on selected client
  const filteredProjectOptions = useMemo(() => {
    if (!filters.client) {
      return [];
    }

    // Filter projects that belong to the selected client
    const clientProjects = projectsData.filter(
      project => String(project.ClientId) === String(filters.client)
    );

    return createProjectOptions(clientProjects);
  }, [filters.client]);

  // Filter contracts based on selected projects
  const filteredContractOptions = useMemo(() => {
    if (!filters.projects || filters.projects.length === 0) {
      return [];
    }

    // Filter contracts that belong to any of the selected projects
    const filteredContracts = contractsData.filter(
      contract => filters.projects.includes(String(contract.ProjectNumber))
    );

    // Deduplicate by ContractNumber to avoid showing duplicate options
    const uniqueContracts = filteredContracts.reduce((acc, contract) => {
      const exists = acc.find(c => c.ContractNumber === contract.ContractNumber);
      if (!exists) {
        acc.push(contract);
      }
      return acc;
    }, []);

    return createContractOptions(uniqueContracts);
  }, [filters.projects]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => {
      // If client changes, reset projects and contracts selection
      if (field === 'client' && prev.client !== value) {
        return {
          ...prev,
          [field]: value,
          projects: [],
          contracts: []
        };
      }
      // If projects change, reset contracts selection
      if (field === 'projects') {
        return {
          ...prev,
          [field]: value,
          contracts: []
        };
      }

      return {
        ...prev,
        [field]: value
      };
    });
  };

  // Handle checkbox toggle for projects
  const handleProjectToggle = (projectValue) => {
    setFilters((prev) => {
      const isSelected = prev.projects.includes(projectValue);
      const newProjects = isSelected
        ? prev.projects.filter(p => p !== projectValue)
        : [...prev.projects, projectValue];

      return {
        ...prev,
        projects: newProjects,
        contracts: [] // Reset contracts when projects change
      };
    });
  };

  // Handle checkbox toggle for contracts
  const handleContractToggle = (contractValue) => {
    setFilters((prev) => {
      const isSelected = prev.contracts.includes(contractValue);
      const newContracts = isSelected
        ? prev.contracts.filter(c => c !== contractValue)
        : [...prev.contracts, contractValue];

      return {
        ...prev,
        contracts: newContracts
      };
    });
  };

  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit();
  }, []);

  const getSubcontractorRowStyle = useCallback((params) => {
    if (params.data && params.data.subContractor === 'Sub Total') {
      return {
        background: 'rgba(142, 169, 78, 0.15)',
        fontWeight: '600',
        borderTop: '2px solid rgba(142, 169, 78, 0.5)'
      };
    }
    return null;
  }, []);

  const toggleSummaryRow = useCallback((rowId) => {
    setExpandedSummaryRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  }, []);

  const summaryGridRows = useMemo(() => {
    if (!summaryData || summaryData.length === 0) {
      return [];
    }

    const rows = [];
    summaryData.forEach((row) => {
      rows.push(row);

      if (expandedSummaryRows.has(row.id) && row.subcontractors?.length) {
        rows.push({
          ...row,
          id: `${row.id}-detail`,
          isDetailRow: true,
          parentRow: row
        });
      }
    });

    return rows;
  }, [summaryData, expandedSummaryRows]);

  const summaryColumnDefs = useMemo(() => {
    const columns = [
      {
        field: 'contractScope',
        headerName: 'Contract# / Scope',
        minWidth: 200,
        cellRenderer: ContractScopeCellRenderer
      },
      {
        field: 'projectScope',
        headerName: 'Project Scope',
        minWidth: 180,
        valueGetter: (params) => (params.data?.isDetailRow ? '' : params.data?.projectScope)
      },
      {
        field: 'contractor',
        headerName: 'Contractor, Ward, County & State',
        minWidth: 220,
        valueGetter: (params) => (params.data?.isDetailRow ? '' : params.data?.contractor)
      },
      {
        field: 'originalContractAmount',
        headerName: 'Original Contract Amount',
        minWidth: 170,
        valueGetter: (params) => (params.data?.isDetailRow ? '' : params.data?.originalContractAmount),
        valueFormatter: ({ value }) => value ? formatCurrency(value) : ''
      },
      {
        field: 'changeOrders',
        headerName: 'Change Orders',
        minWidth: 150,
        valueGetter: (params) => (params.data?.isDetailRow ? '' : params.data?.changeOrders),
        valueFormatter: ({ value }) => value ? formatCurrency(value) : ''
      },
      {
        field: 'adjustedContractAmount',
        headerName: 'Adjusted Contract Amount',
        minWidth: 170,
        valueGetter: (params) => (params.data?.isDetailRow ? '' : params.data?.adjustedContractAmount),
        valueFormatter: ({ value }) => value ? formatCurrency(value) : ''
      },
      {
        field: 'paidToDateAmount',
        headerName: 'Paid To Date Amount',
        minWidth: 160,
        valueGetter: (params) => (params.data?.isDetailRow ? '' : params.data?.paidToDateAmount),
        valueFormatter: ({ value }) => value ? formatCurrency(value) : ''
      },
      {
        field: 'paidToDatePercent',
        headerName: '%',
        width: 90,
        valueGetter: (params) => (params.data?.isDetailRow ? '' : params.data?.paidToDatePercent),
        valueFormatter: ({ value }) => value ? formatPercent(value, 1) : ''
      }
    ];

    columns[0].colSpan = (params) => (params.data?.isDetailRow ? columns.length : 1);

    return columns;
  }, []);

  const getSummaryRowHeight = useCallback((params) => {
    if (!params.data?.isDetailRow) {
      return undefined;
    }
    return DETAIL_GRID_HEIGHT + DETAIL_ROW_PADDING;
  }, []);

  const gridContext = useMemo(() => ({
    toggleSummaryRow,
    expandedSummaryRows,
    subcontractorColumnDefs,
    getSubcontractorRowStyle,
    onGridReady,
    gridOptions
  }), [toggleSummaryRow, expandedSummaryRows, getSubcontractorRowStyle, onGridReady, gridOptions]);

  const handleGenerateReport = (event) => {
    event.preventDefault();

    // Validate all filter fields
    if (!filters.client) {
      toast.error('Please select a client', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return;
    }
    if (!filters.projects || filters.projects.length === 0) {
      toast.error('Please select at least one project', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return;
    }
    if (!filters.contracts || filters.contracts.length === 0) {
      toast.error('Please select at least one contract', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return;
    }
    if (!filters.startDate) {
      toast.error('Please select a start date', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return;
    }
    if (!filters.endDate) {
      toast.error('Please select an end date', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return;
    }

    // Validate date range
    if (new Date(filters.startDate) > new Date(filters.endDate)) {
      toast.error('Start date must be before end date', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return;
    }

    // Split data into summary and subcontractor tables
    const subcontractorRows = reportData.subcontractors.map((row, index) => ({
      id: `subcontractor-${index + 1}`,
      ...row
    }));

    const summaryRow = {
      id: 'summary-1',
      ...reportData.summary,
      subcontractors: subcontractorRows
    };

    setSummaryData([summaryRow]);
    setSubcontractorData(subcontractorRows);
    setExpandedSummaryRows(new Set([summaryRow.id]));
    setAppliedFilters(filters);
    setShowFilters(false);
    setHasGenerated(true);

    toast.success('Report generated successfully!', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  const handleEditFilters = () => {
    setShowFilters(true);
  };

  const handleExport = (format) => {
    setShowExportDropdown(false);
    toast.info(`Exporting report as ${format}...`, {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
    // TODO: Implement actual export functionality
  };

  const getLabel = (options, value, fallback) => {
    if (!value) return fallback;
    return options.find((opt) => opt.value === value)?.label || fallback;
  };

  const getMultipleLabels = (options, values) => {
    if (!values || values.length === 0) return 'None selected';
    return values.map(value => {
      const option = options.find(opt => opt.value === value);
      return option ? option.label : value;
    }).join(', ');
  };

  // Custom styles for React Select
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      padding: '2px',
      borderRadius: '8px',
      border: '1px solid rgba(142, 169, 78, 0.4)',
      background: 'rgba(255, 255, 255, 0.9)',
      fontSize: '13px',
      minHeight: '42px',
      '&:hover': {
        borderColor: 'rgba(142, 169, 78, 0.6)'
      }
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      border: '1px solid rgba(142, 169, 78, 0.3)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 1000
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '13px',
      color: '#2d4a1f',
      backgroundColor: state.isSelected
        ? 'rgba(142, 169, 78, 0.2)'
        : state.isFocused
        ? 'rgba(142, 169, 78, 0.1)'
        : 'white',
      '&:active': {
        backgroundColor: 'rgba(142, 169, 78, 0.3)'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#2d4a1f'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#4a7c59'
    })
  };

  return (
    <section>
      <ToastContainer />

      <div
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          borderRadius: '12px',
          border: '1px solid rgba(142, 169, 78, 0.25)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          padding: '20px',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: showFilters ? '15px' : 0, gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: '18px', color: '#1b5e20' }}>Filters</h2>
            {!showFilters && appliedFilters && (
              <div style={{ margin: '6px 0 0', fontSize: '13px', color: '#4a7c59', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <span><strong>Client:</strong> {getLabel(clientOptions, appliedFilters.client, 'All Clients')}</span>
                <span><strong>Projects:</strong> {getMultipleLabels(projectOptions, appliedFilters.projects)}</span>
                <span><strong>Contracts:</strong> {getMultipleLabels(allContractOptions, appliedFilters.contracts)}</span>
                <span><strong>Dates:</strong> {appliedFilters.startDate || 'Any'} – {appliedFilters.endDate || 'Any'}</span>
              </div>
            )}
          </div>
          {!showFilters && (
            <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
              <button
                type="button"
                onClick={handleEditFilters}
                title={isMobile ? 'Edit Filters' : ''}
                style={{
                  padding: isMobile ? '8px' : '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(142, 169, 78, 0.4)',
                  background: 'rgba(142, 169, 78, 0.1)',
                  color: '#1b5e20',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: isMobile ? '36px' : 'auto'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(142, 169, 78, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(142, 169, 78, 0.1)'}
              >
                {isMobile ? (
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      width: '20px',
                      height: '20px',
                      fill: '#1b5e20'
                    }}
                  >
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                ) : (
                  'Edit Filters'
                )}
              </button>

              <div ref={exportDropdownRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  title={isMobile ? 'Export' : ''}
                  style={{
                    padding: isMobile ? '8px' : '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(142, 169, 78, 0.4)',
                    background: showExportDropdown ? 'rgba(142, 169, 78, 0.2)' : 'rgba(142, 169, 78, 0.1)',
                    color: '#1b5e20',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: isMobile ? '0' : '6px',
                    minWidth: isMobile ? '36px' : 'auto'
                  }}
                  onMouseOver={(e) => {
                    if (!showExportDropdown) {
                      e.currentTarget.style.background = 'rgba(142, 169, 78, 0.2)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!showExportDropdown) {
                      e.currentTarget.style.background = 'rgba(142, 169, 78, 0.1)';
                    }
                  }}
                >
                  {isMobile ? (
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        width: '20px',
                        height: '20px',
                        fill: '#1b5e20'
                      }}
                    >
                      <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
                    </svg>
                  ) : (
                    <>
                      Export
                      <svg
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          width: '16px',
                          height: '16px',
                          fill: '#1b5e20',
                          transform: showExportDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        <path d="M7 10l5 5 5-5z"/>
                      </svg>
                    </>
                  )}
                </button>

                {showExportDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      right: 0,
                      background: 'white',
                      border: '1px solid rgba(142, 169, 78, 0.3)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      zIndex: 1000,
                      minWidth: '120px',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleExport('PDF')}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        border: 'none',
                        background: 'transparent',
                        color: '#2d4a1f',
                        fontSize: '13px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(142, 169, 78, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExport('Word')}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        border: 'none',
                        background: 'transparent',
                        color: '#2d4a1f',
                        fontSize: '13px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(142, 169, 78, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      Word
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExport('Excel')}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        border: 'none',
                        background: 'transparent',
                        color: '#2d4a1f',
                        fontSize: '13px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(142, 169, 78, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      Excel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {showFilters && (
          <form
            onSubmit={handleGenerateReport}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            {/* Step 1: Client Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#1b5e20', fontWeight: '600' }}>
                Step 1: Select Client
              </label>
              <Select
                value={clientOptions.find(opt => opt.value === filters.client) || null}
                onChange={(option) => handleFilterChange('client', option ? option.value : '')}
                options={clientOptions}
                styles={customSelectStyles}
                placeholder="Select a client..."
                isClearable
                isSearchable
              />
            </div>

            {/* Step 2: Projects Selection (shown only when client is selected) */}
            {filters.client && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: '#1b5e20', fontWeight: '600' }}>
                  Step 2: Select Projects {filters.projects.length > 0 && `(${filters.projects.length} selected)`}
                </label>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: '10px',
                  maxHeight: 'calc(3 * 40px + 2 * 10px)',
                  overflowY: 'auto',
                  padding: '12px',
                  border: '1px solid rgba(142, 169, 78, 0.3)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.5)'
                }}>
                  {filteredProjectOptions.length > 0 ? (
                    filteredProjectOptions.map(option => (
                      <label
                        key={option.value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: `1px solid ${filters.projects.includes(option.value) ? 'rgba(142, 169, 78, 0.6)' : 'rgba(142, 169, 78, 0.2)'}`,
                          background: filters.projects.includes(option.value) ? 'rgba(142, 169, 78, 0.15)' : 'rgba(255, 255, 255, 0.8)',
                          fontSize: '13px',
                          color: '#2d4a1f',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          userSelect: 'none'
                        }}
                        onMouseOver={(e) => {
                          if (!filters.projects.includes(option.value)) {
                            e.currentTarget.style.background = 'rgba(142, 169, 78, 0.08)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!filters.projects.includes(option.value)) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={filters.projects.includes(option.value)}
                          onChange={() => handleProjectToggle(option.value)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))
                  ) : (
                    <p style={{ margin: 0, color: '#4a7c59', fontSize: '13px', fontStyle: 'italic' }}>
                      No projects available for this client
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Contracts Selection (shown only when projects are selected) */}
            {filters.projects.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: '#1b5e20', fontWeight: '600' }}>
                  Step 3: Select Contracts {filters.contracts.length > 0 && `(${filters.contracts.length} selected)`}
                </label>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: '10px',
                  maxHeight: 'calc(3 * 40px + 2 * 10px)',
                  overflowY: 'auto',
                  padding: '12px',
                  border: '1px solid rgba(142, 169, 78, 0.3)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.5)'
                }}>
                  {filteredContractOptions.length > 0 ? (
                    filteredContractOptions.map(option => (
                      <label
                        key={option.value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: `1px solid ${filters.contracts.includes(option.value) ? 'rgba(142, 169, 78, 0.6)' : 'rgba(142, 169, 78, 0.2)'}`,
                          background: filters.contracts.includes(option.value) ? 'rgba(142, 169, 78, 0.15)' : 'rgba(255, 255, 255, 0.8)',
                          fontSize: '13px',
                          color: '#2d4a1f',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          userSelect: 'none'
                        }}
                        onMouseOver={(e) => {
                          if (!filters.contracts.includes(option.value)) {
                            e.currentTarget.style.background = 'rgba(142, 169, 78, 0.08)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!filters.contracts.includes(option.value)) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={filters.contracts.includes(option.value)}
                          onChange={() => handleContractToggle(option.value)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))
                  ) : (
                    <p style={{ margin: 0, color: '#4a7c59', fontSize: '13px', fontStyle: 'italic' }}>
                      No contracts available for selected projects
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Date Range (shown only when contracts are selected) */}
            {filters.contracts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '14px', color: '#1b5e20', fontWeight: '600', marginTop: '8px' }}>
                  Step 4: Select Date Range
                </label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: '15px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#4a7c59', maxWidth: '250px' }}>
                      Start Date
                      <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(142, 169, 78, 0.4)',
                          background: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          color: '#2d4a1f'
                        }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#4a7c59', maxWidth: '250px' }}>
                      End Date
                      <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(142, 169, 78, 0.4)',
                          background: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          color: '#2d4a1f'
                        }}
                      />
                    </label>
                  </div>

                  {/* Generate Report Button */}
                  <button
                    type="submit"
                    style={{
                      padding: '12px 20px',
                      background: 'rgba(142, 169, 78, 0.85)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      marginLeft: 'auto'
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
                    Generate Report
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>

      {/* Summary Table */}
      {summaryData.length > 0 && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '12px',
            border: '1px solid rgba(142, 169, 78, 0.25)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            padding: '20px',
            marginBottom: '20px'
          }}
        >
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#1b5e20', fontWeight: '600' }}>
            Contract Summary
          </h3>
          <div className="ag-theme-balham" style={{ width: '100%' }}>
            <AgGridReact
              gridOptions={gridOptions}
              rowData={summaryGridRows}
              columnDefs={summaryColumnDefs}
              defaultColDef={{
                resizable: true,
                sortable: true,
                minWidth: 120
              }}
              animateRows={true}
              suppressCellFocus={true}
              onGridReady={onGridReady}
              domLayout='autoHeight'
              getRowHeight={getSummaryRowHeight}
              context={gridContext}
            />
          </div>
        </div>
      )}

      {/* Goals and Business Spend Cards */}
      {subcontractorData.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          {/* Goals Table Card */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              borderRadius: '12px',
              border: '1px solid rgba(142, 169, 78, 0.25)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              padding: '20px'
            }}
          >
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#1b5e20', fontWeight: '600' }}>
              Overall Diversity Business and Workforce Hiring Goals
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(142, 169, 78, 0.3)' }}>
                    <th style={{ textAlign: 'left', padding: '10px 8px', color: '#1b5e20', fontWeight: '600' }}>Goal Name</th>
                    <th style={{ textAlign: 'right', padding: '10px 8px', color: '#1b5e20', fontWeight: '600' }}>Goal Value</th>
                    <th style={{ textAlign: 'right', padding: '10px 8px', color: '#1b5e20', fontWeight: '600' }}>%</th>
                    <th style={{ textAlign: 'right', padding: '10px 8px', color: '#1b5e20', fontWeight: '600' }}>Actuals</th>
                    <th style={{ textAlign: 'right', padding: '10px 8px', color: '#1b5e20', fontWeight: '600' }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(142, 169, 78, 0.15)' }}>
                    <td style={{ padding: '10px 8px', color: '#2d4a1f' }}>MBE (dollars)</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', color: '#2d4a1f' }}>$127,206,929.88</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', color: '#2d4a1f', fontWeight: '500' }}>36.00%</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', color: '#2d4a1f' }}>$11,962,330.80</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', color: '#2d4a1f', fontWeight: '500' }}>3.4%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Business Spend Pie Chart Card */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              borderRadius: '12px',
              border: '1px solid rgba(142, 169, 78, 0.25)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              padding: '20px'
            }}
          >
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#1b5e20', fontWeight: '600' }}>
              Business Spend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'MBE', value: 3.39, color: '#5969F3' },
                    { name: 'Non-Diverse', value: 95.56, color: '#6FE6C3' },
                    { name: 'WBE', value: 1.06, color: '#FEBF8F' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'MBE', value: 3.39, color: '#5969F3' },
                    { name: 'Non-Diverse', value: 95.56, color: '#6FE6C3' },
                    { name: 'WBE', value: 1.06, color: '#FEBF8F' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => `${value}: ${entry.payload.value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!hasGenerated && summaryData.length === 0 && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '12px',
            border: '1px solid rgba(142, 169, 78, 0.25)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            padding: '40px 20px',
            textAlign: 'center'
          }}
        >
          <p style={{ color: '#4a7c59', fontSize: '14px', fontStyle: 'italic', margin: 0 }}>
            Generate a report to display data here.
          </p>
        </div>
      )}

      {hasGenerated && summaryData.length === 0 && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '12px',
            border: '1px solid rgba(142, 169, 78, 0.25)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            padding: '40px 20px',
            textAlign: 'center'
          }}
        >
          <p style={{ color: '#4a7c59', fontSize: '14px', fontStyle: 'italic', margin: 0 }}>
            No results found for the selected filters.
          </p>
        </div>
      )}
    </section>
  );
};

export default ProjectExecutiveSummaryExtendedAggregate;

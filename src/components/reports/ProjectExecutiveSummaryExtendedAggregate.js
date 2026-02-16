import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import projectsData from '../../data/projects.json';
import contractsData from '../../data/contracts.json';
import { generateAggregateReportData } from '../../services/generateAggregateReportData';

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

const createFieldGetter = (field, rowType) => (params) => {
  const data = params.data;
  if (!data || data.rowType !== rowType) {
    return null;
  }
  return data[field];
};

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
const HierarchyCellRenderer = (params) => {
  const { data, context } = params;

  if (!data) {
    return null;
  }

  const { rowType, projectScope, contractScope, subContractor, hasChildren, id } = data;
  const isProject = rowType === 'projectGroup';
  const isContract = rowType === 'contractGroup';
  const indent = isProject ? 0 : isContract ? 20 : 42;
  const label = isProject
    ? projectScope
    : isContract
      ? contractScope
      : subContractor || contractScope || projectScope;

  const isExpandable = hasChildren && (isProject || isContract);
  const expanded = isProject
    ? context?.expandedProjects?.has(id)
    : isContract
      ? context?.expandedContracts?.has(id)
      : false;
  
  const iconClass = expanded ? 'ag-icon ag-icon-tree-open': 'ag-icon ag-icon-tree-closed';

  const handleToggle = (event) => {
    event?.stopPropagation();
    if (!isExpandable) return;
    if (isProject) {
      context?.toggleProject?.(id);
    } else if (isContract) {
      context?.toggleContract?.(id);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: `${indent}px` }}>
      {isExpandable ? (
        ( <span
          className={iconClass}
          onClick={isExpandable ? handleToggle : undefined}
          aria-disabled={!isExpandable}/>
        )
      ) : (
        <span style={{ width: '24px' }} />
      )}
      <span style={{ fontWeight: isProject ? 700 : isContract ? 600 : 400 }}>{label}</span>
    </div>
  );
};

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

const ProjectExecutiveSummaryExtendedAggregate = () => {
  const projectOptions = useMemo(() => createProjectOptions(projectsData), []);
  const allContractOptions = useMemo(() => createContractOptions(contractsData), []);
  const gridOptions = useMemo(() => ({ theme: 'legacy' }), []);
  const exportDropdownRef = useRef(null);
  const chartRef = useRef(null);
  const chartRef = useRef(null);

  const [filters, setFilters] = useState({
    client: '',
    projects: [],
    contracts: [],
    startDate: '',
    endDate: ''
  });
  const [summaryData, setSummaryData] = useState([]);
  const [subcontractorData, setSubcontractorData] = useState([]);
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [expandedContracts, setExpandedContracts] = useState(new Set());
  const [hasGenerated, setHasGenerated] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showFilterDetails, setShowFilterDetails] = useState(true);
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

  const summaryColumnDefs = useMemo(() => [
    {
      field: 'projectScope',
      headerName: 'Project / Contract / Subcontractor',
      minWidth: 260,
      cellRenderer: HierarchyCellRenderer
    },
    {
      field: 'contractor',
      headerName: 'Contractor, Ward, County & State',
      minWidth: 220,
      valueGetter: (params) => params.data?.rowType === 'contractGroup' ? params.data.contractor : ''
    },
    {
      field: 'originalContractAmount',
      headerName: 'Original Contract Amount',
      minWidth: 170,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'grandTotal') {
          return data.originalContractAmount;
        }
        return null;
      },
      valueFormatter: ({ value }) => value ? formatCurrency(value) : ''
    },
    {
      field: 'changeOrders',
      headerName: 'Change Orders',
      minWidth: 150,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'grandTotal') {
          return data.changeOrders;
        }
        return null;
      },
      valueFormatter: ({ value }) => value ? formatCurrency(value) : ''
    },
    {
      field: 'adjustedContractAmount',
      headerName: 'Adjusted Contract Amount',
      minWidth: 170,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'grandTotal') {
          return data.adjustedContractAmount;
        }
        return null;
      },
      valueFormatter: ({ value }) => value ? formatCurrency(value) : ''
    },
    {
      field: 'paidToDateAmount',
      headerName: 'Paid To Date Amount',
      minWidth: 160,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'grandTotal') {
          return data.paidToDateAmount;
        }
        return null;
      },
      valueFormatter: ({ value }) => value ? formatCurrency(value) : ''
    },
    {
      field: 'paidToDatePercent',
      headerName: '% Paid',
      width: 110,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'grandTotal') {
          return data.paidToDatePercent;
        }
        return null;
      },
      valueFormatter: percentFormatter(1)
    },
    {
      field: 'certificationAgency',
      headerName: 'Certification Agency',
      minWidth: 160,
      valueGetter: createFieldGetter('certificationAgency', 'subcontractor')
    },
    {
      field: 'lbeAdjusted',
      headerName: 'LBE Adjusted',
      minWidth: 130,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.lbeAdjusted;
        }
        return null;
      },
      valueFormatter: ({ value }) => value ? formatCurrency(value) : ''
    },
    {
      field: 'lbeAdjustedPercent',
      headerName: 'LBE %',
      width: 90,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.lbeAdjustedPercent;
        }
        return null;
      },
      valueFormatter: percentFormatter(1)
    },
    {
      field: 'mbeAdjusted',
      headerName: 'MBE Adjusted',
      minWidth: 130,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.mbeAdjusted;
        }
        return null;
      },
      valueFormatter: ({ value }) => value ? formatCurrency(value) : ''
    },
    {
      field: 'mbeAdjustedPercent',
      headerName: 'MBE %',
      width: 90,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.mbeAdjustedPercent;
        }
        return null;
      },
      valueFormatter: percentFormatter(1)
    },
    {
      field: 'wbeAdjusted',
      headerName: 'WBE Adjusted',
      minWidth: 130,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.wbeAdjusted;
        }
        return null;
      },
      valueFormatter: ({ value }) => value ? formatCurrency(value) : ''
    },
    {
      field: 'wbeAdjustedPercent',
      headerName: 'WBE %',
      width: 90,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.wbeAdjustedPercent;
        }
        return null;
      },
      valueFormatter: percentFormatter(1)
    },
    {
      field: 'sbeAdjusted',
      headerName: 'SBE Adjusted',
      minWidth: 130,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.sbeAdjusted;
        }
        return null;
      },
      valueFormatter: ({ value }) => value ? formatCurrency(value) : ''
    },
    {
      field: 'sbeAdjustedPercent',
      headerName: 'SBE %',
      width: 90,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.sbeAdjustedPercent;
        }
        return null;
      },
      valueFormatter: percentFormatter(1)
    },
    {
      field: 'vbeAdjusted',
      headerName: 'VBE Adjusted',
      minWidth: 130,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.vbeAdjusted;
        }
        return null;
      },
      valueFormatter: ({ value }) => value ? formatCurrency(value) : ''
    },
    {
      field: 'vbeAdjustedPercent',
      headerName: 'VBE %',
      width: 90,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.vbeAdjustedPercent;
        }
        return null;
      },
      valueFormatter: percentFormatter(1)
    },
    {
      field: 'lbePaidToDate',
      headerName: 'LBE Paid To Date',
      minWidth: 140,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.lbePaidToDate;
        }
        return null;
      },
      valueFormatter: ({ value }) => value ? formatCurrency(value) : ''
    },
    {
      field: 'lbePaidToDatePercent',
      headerName: 'LBE Paid %',
      width: 110,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.lbePaidToDatePercent;
        }
        return null;
      },
      valueFormatter: percentFormatter(2)
    },
    {
      field: 'mbePaidToDate',
      headerName: 'MBE Paid To Date',
      minWidth: 140,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.mbePaidToDate;
        }
        return null;
      },
      valueFormatter: ({ value }) => value ? formatCurrency(value) : ''
    },
    {
      field: 'mbePaidToDatePercent',
      headerName: 'MBE Paid %',
      width: 110,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.mbePaidToDatePercent;
        }
        return null;
      },
      valueFormatter: percentFormatter(2)
    },
    {
      field: 'wbePaidToDate',
      headerName: 'WBE Paid To Date',
      minWidth: 140,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.wbePaidToDate;
        }
        return null;
      },
      valueFormatter: ({ value }) => value ? formatCurrency(value) : ''
    },
    {
      field: 'wbePaidToDatePercent',
      headerName: 'WBE Paid %',
      width: 110,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.wbePaidToDatePercent;
        }
        return null;
      },
      valueFormatter: percentFormatter(2)
    },
    {
      field: 'sbePaidToDate',
      headerName: 'SBE Paid To Date',
      minWidth: 140,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.sbePaidToDate;
        }
        return null;
      },
      valueFormatter: ({ value }) => value ? formatCurrency(value) : ''
    },
    {
      field: 'sbePaidToDatePercent',
      headerName: 'SBE Paid %',
      width: 110,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.sbePaidToDatePercent;
        }
        return null;
      },
      valueFormatter: percentFormatter(2)
    },
    {
      field: 'vbePaidToDate',
      headerName: 'VBE Paid To Date',
      minWidth: 140,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.vbePaidToDate;
        }
        return null;
      },
      valueFormatter: ({ value }) => value ? formatCurrency(value) : ''
    },
    {
      field: 'vbePaidToDatePercent',
      headerName: 'VBE Paid %',
      width: 110,
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;
        if (data.rowType === 'projectGroup' || data.rowType === 'contractGroup' || data.rowType === 'subcontractor' || data.rowType === 'grandTotal') {
          return data.vbePaidToDatePercent;
        }
        return null;
      },
      valueFormatter: percentFormatter(2)
    }
  ], []);

  const projectHierarchy = useMemo(() => {
    if (!summaryData || summaryData.length === 0) {
      return [];
    }

    const projectMap = new Map();
    const contractMap = new Map();

    summaryData.forEach((row) => {
      if (row.rowType !== 'summary') {
        return;
      }

      const projectKey = row.projectScope || 'Unassigned Project';
      let projectEntry = projectMap.get(projectKey);

      if (!projectEntry) {
        projectEntry = {
          id: `project-${projectMap.size + 1}`,
          key: projectKey,
          label: projectKey,
          contracts: []
        };
        projectMap.set(projectKey, projectEntry);
      }

      const contractEntry = {
        id: `${row.id}-contract`,
        summary: row,
        subcontractors: []
      };

      projectEntry.contracts.push(contractEntry);
      contractMap.set(row.id, contractEntry);
    });

    summaryData.forEach((row) => {
      if (row.rowType === 'subcontractor') {
        const contractEntry = contractMap.get(row.parentSummaryId);
        if (contractEntry) {
          contractEntry.subcontractors.push(row);
        }
      }
    });

    return Array.from(projectMap.values());
  }, [summaryData]);

  useEffect(() => {
    if (!projectHierarchy.length) {
      setExpandedProjects(new Set());
      setExpandedContracts(new Set());
      return;
    }

    const projectIds = new Set(projectHierarchy.map((project) => project.id));
    const contractIds = new Set();

    projectHierarchy.forEach((project) => {
      project.contracts.forEach((contract) => {
        contractIds.add(contract.id);
      });
    });

    setExpandedProjects(projectIds);
    setExpandedContracts(contractIds);
  }, [projectHierarchy]);

  const toggleProject = useCallback((projectId) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  }, []);

  const toggleContract = useCallback((contractId) => {
    setExpandedContracts((prev) => {
      const next = new Set(prev);
      if (next.has(contractId)) {
        next.delete(contractId);
      } else {
        next.add(contractId);
      }
      return next;
    });
  }, []);

  const displayRows = useMemo(() => {
    const rows = [];

    // Helper to calculate sum of numeric values
    const sumField = (items, field) => {
      return items.reduce((sum, item) => {
        const value = Number(item[field]);
        return sum + (Number.isFinite(value) ? value : 0);
      }, 0);
    };

    // Helper to calculate weighted average percentage
    const calcWeightedPercent = (totalAmount, items, amountField, percentField) => {
      if (!totalAmount || totalAmount === 0) return 0;
      const weightedSum = items.reduce((sum, item) => {
        const amount = Number(item[amountField]);
        const percent = Number(item[percentField]);
        if (Number.isFinite(amount) && Number.isFinite(percent)) {
          return sum + (amount * percent / 100);
        }
        return sum;
      }, 0);
      return (weightedSum / totalAmount) * 100;
    };

    projectHierarchy.forEach((project) => {
      // Calculate project-level totals from all contracts
      const allContracts = project.contracts.map(c => c.summary);
      const projectTotals = {
        originalContractAmount: sumField(allContracts, 'originalContractAmount'),
        changeOrders: sumField(allContracts, 'changeOrders'),
        adjustedContractAmount: sumField(allContracts, 'adjustedContractAmount'),
        paidToDateAmount: sumField(allContracts, 'paidToDateAmount')
      };
      projectTotals.paidToDatePercent = projectTotals.adjustedContractAmount > 0
        ? (projectTotals.paidToDateAmount / projectTotals.adjustedContractAmount) * 100
        : 0;

      // Calculate project-level subcontractor totals from all subcontractors
      const allSubs = project.contracts.flatMap(c => c.subcontractors);
      projectTotals.lbeAdjusted = sumField(allSubs, 'lbeAdjusted');
      projectTotals.mbeAdjusted = sumField(allSubs, 'mbeAdjusted');
      projectTotals.wbeAdjusted = sumField(allSubs, 'wbeAdjusted');
      projectTotals.sbeAdjusted = sumField(allSubs, 'sbeAdjusted');
      projectTotals.vbeAdjusted = sumField(allSubs, 'vbeAdjusted');
      projectTotals.lbePaidToDate = sumField(allSubs, 'lbePaidToDate');
      projectTotals.mbePaidToDate = sumField(allSubs, 'mbePaidToDate');
      projectTotals.wbePaidToDate = sumField(allSubs, 'wbePaidToDate');
      projectTotals.sbePaidToDate = sumField(allSubs, 'sbePaidToDate');
      projectTotals.vbePaidToDate = sumField(allSubs, 'vbePaidToDate');

      // Calculate weighted average percentages for project
      projectTotals.lbeAdjustedPercent = calcWeightedPercent(projectTotals.lbeAdjusted, allSubs, 'lbeAdjusted', 'lbeAdjustedPercent');
      projectTotals.mbeAdjustedPercent = calcWeightedPercent(projectTotals.mbeAdjusted, allSubs, 'mbeAdjusted', 'mbeAdjustedPercent');
      projectTotals.wbeAdjustedPercent = calcWeightedPercent(projectTotals.wbeAdjusted, allSubs, 'wbeAdjusted', 'wbeAdjustedPercent');
      projectTotals.sbeAdjustedPercent = calcWeightedPercent(projectTotals.sbeAdjusted, allSubs, 'sbeAdjusted', 'sbeAdjustedPercent');
      projectTotals.vbeAdjustedPercent = calcWeightedPercent(projectTotals.vbeAdjusted, allSubs, 'vbeAdjusted', 'vbeAdjustedPercent');
      projectTotals.lbePaidToDatePercent = calcWeightedPercent(projectTotals.lbePaidToDate, allSubs, 'lbePaidToDate', 'lbePaidToDatePercent');
      projectTotals.mbePaidToDatePercent = calcWeightedPercent(projectTotals.mbePaidToDate, allSubs, 'mbePaidToDate', 'mbePaidToDatePercent');
      projectTotals.wbePaidToDatePercent = calcWeightedPercent(projectTotals.wbePaidToDate, allSubs, 'wbePaidToDate', 'wbePaidToDatePercent');
      projectTotals.sbePaidToDatePercent = calcWeightedPercent(projectTotals.sbePaidToDate, allSubs, 'sbePaidToDate', 'sbePaidToDatePercent');
      projectTotals.vbePaidToDatePercent = calcWeightedPercent(projectTotals.vbePaidToDate, allSubs, 'vbePaidToDate', 'vbePaidToDatePercent');

      rows.push({
        id: project.id,
        rowType: 'projectGroup',
        projectScope: project.label,
        hasChildren: project.contracts.length > 0,
        ...projectTotals
      });

      if (!expandedProjects.has(project.id)) {
        return;
      }

      project.contracts.forEach((contract) => {
        // Calculate contract-level totals from subcontractors
        const subs = contract.subcontractors;
        const contractTotals = {
          lbeAdjusted: sumField(subs, 'lbeAdjusted'),
          mbeAdjusted: sumField(subs, 'mbeAdjusted'),
          wbeAdjusted: sumField(subs, 'wbeAdjusted'),
          sbeAdjusted: sumField(subs, 'sbeAdjusted'),
          vbeAdjusted: sumField(subs, 'vbeAdjusted'),
          lbePaidToDate: sumField(subs, 'lbePaidToDate'),
          mbePaidToDate: sumField(subs, 'mbePaidToDate'),
          wbePaidToDate: sumField(subs, 'wbePaidToDate'),
          sbePaidToDate: sumField(subs, 'sbePaidToDate'),
          vbePaidToDate: sumField(subs, 'vbePaidToDate')
        };

        // Calculate weighted average percentages
        contractTotals.lbeAdjustedPercent = calcWeightedPercent(contractTotals.lbeAdjusted, subs, 'lbeAdjusted', 'lbeAdjustedPercent');
        contractTotals.mbeAdjustedPercent = calcWeightedPercent(contractTotals.mbeAdjusted, subs, 'mbeAdjusted', 'mbeAdjustedPercent');
        contractTotals.wbeAdjustedPercent = calcWeightedPercent(contractTotals.wbeAdjusted, subs, 'wbeAdjusted', 'wbeAdjustedPercent');
        contractTotals.sbeAdjustedPercent = calcWeightedPercent(contractTotals.sbeAdjusted, subs, 'sbeAdjusted', 'sbeAdjustedPercent');
        contractTotals.vbeAdjustedPercent = calcWeightedPercent(contractTotals.vbeAdjusted, subs, 'vbeAdjusted', 'vbeAdjustedPercent');
        contractTotals.lbePaidToDatePercent = calcWeightedPercent(contractTotals.lbePaidToDate, subs, 'lbePaidToDate', 'lbePaidToDatePercent');
        contractTotals.mbePaidToDatePercent = calcWeightedPercent(contractTotals.mbePaidToDate, subs, 'mbePaidToDate', 'mbePaidToDatePercent');
        contractTotals.wbePaidToDatePercent = calcWeightedPercent(contractTotals.wbePaidToDate, subs, 'wbePaidToDate', 'wbePaidToDatePercent');
        contractTotals.sbePaidToDatePercent = calcWeightedPercent(contractTotals.sbePaidToDate, subs, 'sbePaidToDate', 'sbePaidToDatePercent');
        contractTotals.vbePaidToDatePercent = calcWeightedPercent(contractTotals.vbePaidToDate, subs, 'vbePaidToDate', 'vbePaidToDatePercent');

        rows.push({
          ...contract.summary,
          ...contractTotals,
          id: contract.id,
          rowType: 'contractGroup',
          hasChildren: contract.subcontractors.length > 0
        });

        if (!expandedContracts.has(contract.id)) {
          return;
        }

        contract.subcontractors.forEach((sub) => {
          rows.push({
            ...sub,
            hasChildren: false
          });
        });
      });
    });

    // Calculate grand totals from all project rows
    if (rows.length > 0 && projectHierarchy.length > 0) {
      const allProjects = rows.filter(r => r.rowType === 'projectGroup');
      const grandTotals = {
        originalContractAmount: sumField(allProjects, 'originalContractAmount'),
        changeOrders: sumField(allProjects, 'changeOrders'),
        adjustedContractAmount: sumField(allProjects, 'adjustedContractAmount'),
        paidToDateAmount: sumField(allProjects, 'paidToDateAmount'),
        lbeAdjusted: sumField(allProjects, 'lbeAdjusted'),
        mbeAdjusted: sumField(allProjects, 'mbeAdjusted'),
        wbeAdjusted: sumField(allProjects, 'wbeAdjusted'),
        sbeAdjusted: sumField(allProjects, 'sbeAdjusted'),
        vbeAdjusted: sumField(allProjects, 'vbeAdjusted'),
        lbePaidToDate: sumField(allProjects, 'lbePaidToDate'),
        mbePaidToDate: sumField(allProjects, 'mbePaidToDate'),
        wbePaidToDate: sumField(allProjects, 'wbePaidToDate'),
        sbePaidToDate: sumField(allProjects, 'sbePaidToDate'),
        vbePaidToDate: sumField(allProjects, 'vbePaidToDate')
      };

      // Calculate percentages for grand totals
      grandTotals.paidToDatePercent = grandTotals.adjustedContractAmount > 0
        ? (grandTotals.paidToDateAmount / grandTotals.adjustedContractAmount) * 100
        : 0;

      // Get all subcontractors for weighted percentages
      const allSubsForTotal = projectHierarchy.flatMap(p => p.contracts.flatMap(c => c.subcontractors));
      grandTotals.lbeAdjustedPercent = calcWeightedPercent(grandTotals.lbeAdjusted, allSubsForTotal, 'lbeAdjusted', 'lbeAdjustedPercent');
      grandTotals.mbeAdjustedPercent = calcWeightedPercent(grandTotals.mbeAdjusted, allSubsForTotal, 'mbeAdjusted', 'mbeAdjustedPercent');
      grandTotals.wbeAdjustedPercent = calcWeightedPercent(grandTotals.wbeAdjusted, allSubsForTotal, 'wbeAdjusted', 'wbeAdjustedPercent');
      grandTotals.sbeAdjustedPercent = calcWeightedPercent(grandTotals.sbeAdjusted, allSubsForTotal, 'sbeAdjusted', 'sbeAdjustedPercent');
      grandTotals.vbeAdjustedPercent = calcWeightedPercent(grandTotals.vbeAdjusted, allSubsForTotal, 'vbeAdjusted', 'vbeAdjustedPercent');
      grandTotals.lbePaidToDatePercent = calcWeightedPercent(grandTotals.lbePaidToDate, allSubsForTotal, 'lbePaidToDate', 'lbePaidToDatePercent');
      grandTotals.mbePaidToDatePercent = calcWeightedPercent(grandTotals.mbePaidToDate, allSubsForTotal, 'mbePaidToDate', 'mbePaidToDatePercent');
      grandTotals.wbePaidToDatePercent = calcWeightedPercent(grandTotals.wbePaidToDate, allSubsForTotal, 'wbePaidToDate', 'wbePaidToDatePercent');
      grandTotals.sbePaidToDatePercent = calcWeightedPercent(grandTotals.sbePaidToDate, allSubsForTotal, 'sbePaidToDate', 'sbePaidToDatePercent');
      grandTotals.vbePaidToDatePercent = calcWeightedPercent(grandTotals.vbePaidToDate, allSubsForTotal, 'vbePaidToDate', 'vbePaidToDatePercent');

      rows.push({
        id: 'grand-total',
        rowType: 'grandTotal',
        projectScope: 'TOTAL',
        hasChildren: false,
        ...grandTotals
      });
    }

    return rows;
  }, [projectHierarchy, expandedProjects, expandedContracts]);

  const getRowStyle = useCallback((params) => {
    const { data } = params;
    if (!data) return null;

    if (data.rowType === 'grandTotal') {
      return {
        background: 'rgba(142, 169, 78, 0.3)',
        fontWeight: 800,
        borderTop: '3px solid rgba(142, 169, 78, 0.8)',
        borderBottom: '3px solid rgba(142, 169, 78, 0.8)'
      };
    }

    if (data.rowType === 'projectGroup') {
      return {
        background: 'rgba(142, 169, 78, 0.15)',
        fontWeight: 700
      };
    }

    if (data.rowType === 'contractGroup') {
      return {
        background: 'rgba(142, 169, 78, 0.08)',
        fontWeight: 600
      };
    }

    if (data.rowType === 'summary') {
      return {
        background: 'rgba(142, 169, 78, 0.06)',
        fontWeight: 600
      };
    }

    return null;
  }, []);


  const bottomCardsContainerStyle = useMemo(() => {
    if (isMobile) {
      return {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        width: '100%',
        marginBottom: '10px'
      };
    }

    return {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
      gap: '10px',
      marginBottom: '10px',
      alignItems: 'stretch'
    };
  }, [isMobile]);

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

    const mergedRows = generateAggregateReportData({
      selectedProjectNumbers: filters.projects,
      selectedContractNumbers: filters.contracts
    });

    setSummaryData(mergedRows);
    setSubcontractorData(mergedRows.filter((row) => row.rowType === 'subcontractor'));
    setAppliedFilters(filters);
    setShowFilters(false);
    setShowFilterDetails(false);
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

  const handleExport = async (format) => {
  const handleExport = async (format) => {
    setShowExportDropdown(false);

    if (format === 'PDF') {
      try {
        toast.info('Generating PDF...', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });

        const doc = new jsPDF('l', 'pt', 'a4'); // landscape, points, A4 size
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 40;
        let yPosition = margin;

        // Add title
        doc.setFontSize(16);
        doc.setTextColor(27, 94, 32); // #1b5e20
        doc.text('Project Executive Summary Extended Aggregate Report', margin, yPosition);
        yPosition += 25;

        // Add filter information
        doc.setFontSize(10);
        doc.setTextColor(74, 124, 89); // #4a7c59
        const clientLabel = getLabel(clientOptions, appliedFilters.client, 'N/A');
        doc.text(`Client: ${clientLabel}`, margin, yPosition);
        yPosition += 15;
        doc.text(`Date Range: ${appliedFilters.startDate || 'Any'} – ${appliedFilters.endDate || 'Any'}`, margin, yPosition);
        yPosition += 25;

        // Add main data table
        doc.setFontSize(12);
        doc.setTextColor(27, 94, 32);
        doc.text('Project Summary', margin, yPosition);
        yPosition += 15;

        // Prepare table data from displayRows
        const tableData = displayRows.map(row => {
          const indent = row.rowType === 'projectGroup' ? '' : row.rowType === 'contractGroup' ? '  ' : '    ';
          const label = row.rowType === 'projectGroup'
            ? row.projectScope
            : row.rowType === 'contractGroup'
              ? row.contractScope
              : row.subContractor || row.contractScope || row.projectScope;

          return [
            indent + label,
            row.originalContractAmount ? formatCurrency(row.originalContractAmount) : '',
            row.adjustedContractAmount ? formatCurrency(row.adjustedContractAmount) : '',
            row.paidToDateAmount ? formatCurrency(row.paidToDateAmount) : '',
            row.paidToDatePercent ? formatPercent(row.paidToDatePercent) : '',
            row.lbeAdjusted ? formatCurrency(row.lbeAdjusted) : '',
            row.mbeAdjusted ? formatCurrency(row.mbeAdjusted) : '',
            row.wbeAdjusted ? formatCurrency(row.wbeAdjusted) : ''
          ];
        });

        autoTable(doc, {
          startY: yPosition,
          head: [['Project/Contract/Subcontractor', 'Original Amount', 'Adjusted Amount', 'Paid To Date', '% Paid', 'LBE', 'MBE', 'WBE']],
          body: tableData,
          theme: 'grid',
          headStyles: {
            fillColor: [142, 169, 78],
            textColor: [255, 255, 255],
            fontSize: 8,
            fontStyle: 'bold'
          },
          bodyStyles: {
            fontSize: 7,
            textColor: [45, 74, 31]
          },
          alternateRowStyles: {
            fillColor: [245, 247, 242]
          },
          margin: { left: margin, right: margin },
          styles: {
            cellPadding: 4,
            overflow: 'linebreak',
            cellWidth: 'wrap'
          },
          columnStyles: {
            0: { cellWidth: 140 },
            1: { cellWidth: 70, halign: 'right' },
            2: { cellWidth: 70, halign: 'right' },
            3: { cellWidth: 70, halign: 'right' },
            4: { cellWidth: 50, halign: 'right' },
            5: { cellWidth: 70, halign: 'right' },
            6: { cellWidth: 70, halign: 'right' },
            7: { cellWidth: 70, halign: 'right' }
          },
          didParseCell: function(data) {
            const row = displayRows[data.row.index];
            if (row) {
              if (row.rowType === 'grandTotal') {
                data.cell.styles.fillColor = [142, 169, 78];
                data.cell.styles.textColor = [255, 255, 255];
                data.cell.styles.fontStyle = 'bold';
              } else if (row.rowType === 'projectGroup') {
                data.cell.styles.fillColor = [142, 169, 78, 0.15 * 255];
                data.cell.styles.fontStyle = 'bold';
              } else if (row.rowType === 'contractGroup') {
                data.cell.styles.fillColor = [142, 169, 78, 0.08 * 255];
                data.cell.styles.fontStyle = 'bold';
              }
            }
          }
        });

        // Add new page for Goals Table and Chart
        doc.addPage();
        yPosition = margin;

        // Add Goals Table
        doc.setFontSize(12);
        doc.setTextColor(27, 94, 32);
        doc.text('Overall Diversity Business and Workforce Hiring Goals', margin, yPosition);
        yPosition += 15;

        autoTable(doc, {
          startY: yPosition,
          head: [['Goal Name', 'Goal Value', '%', 'Actuals', '%']],
          body: [
            ['MBE (dollars)', '$127,206,929.88', '36.00%', '$11,962,330.80', '3.4%']
          ],
          theme: 'grid',
          headStyles: {
            fillColor: [142, 169, 78],
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: 'bold'
          },
          bodyStyles: {
            fontSize: 9,
            textColor: [45, 74, 31]
          },
          margin: { left: margin, right: margin },
          styles: {
            cellPadding: 8
          },
          columnStyles: {
            0: { cellWidth: 150 },
            1: { cellWidth: 120, halign: 'right' },
            2: { cellWidth: 80, halign: 'right' },
            3: { cellWidth: 120, halign: 'right' },
            4: { cellWidth: 80, halign: 'right' }
          }
        });

        yPosition = doc.lastAutoTable.finalY + 30;

        // Add Business Spend Chart
        if (chartRef.current) {
          doc.setFontSize(12);
          doc.setTextColor(27, 94, 32);
          doc.text('Business Spend', margin, yPosition);
          yPosition += 15;

          try {
            const canvas = await html2canvas(chartRef.current, {
              backgroundColor: '#ffffff',
              scale: 2
            });
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 400;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Check if image fits on current page
            if (yPosition + imgHeight > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
              doc.setFontSize(12);
              doc.setTextColor(27, 94, 32);
              doc.text('Business Spend (continued)', margin, yPosition);
              yPosition += 15;
            }

            doc.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
          } catch (error) {
            console.error('Error capturing chart:', error);
            doc.setFontSize(10);
            doc.setTextColor(200, 0, 0);
            doc.text('Chart could not be captured', margin, yPosition);
          }
        }

        // Save the PDF
        const fileName = `Project_Executive_Summary_${appliedFilters.client || 'Report'}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);

        toast.success('PDF exported successfully!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error('Failed to generate PDF. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      }
    } else {
      toast.info(`Exporting report as ${format}...`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      // TODO: Implement Word and Excel export functionality
    }
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

  const getContractNumbersSummary = useCallback((values) => {
    if (!values || values.length === 0) {
      return 'None';
    }

    return values
      .map((value) => {
        const contractOption = allContractOptions.find(opt => opt.value === value);
        return contractOption ? contractOption.value : value;
      })
      .join(', ');
  }, [allContractOptions]);

  const getContractNumbersSummary = useCallback((values) => {
    if (!values || values.length === 0) {
      return 'None';
    }

    return values
      .map((value) => {
        const contractOption = allContractOptions.find(opt => opt.value === value);
        return contractOption ? contractOption.value : value;
      })
      .join(', ');
  }, [allContractOptions]);

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
          marginBottom: '10px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: showFilters ? '15px' : 0, gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#1b5e20' }}>Filters</h2>
              {!showFilters && appliedFilters && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowFilterDetails(!showFilterDetails)}
                    title={showFilterDetails ? 'Collapse Filters' : 'Expand Filters'}
                    style={{
                      padding: '4px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1b5e20',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        width: '20px',
                        height: '20px',
                        fill: '#1b5e20',
                        transform: showFilterDetails ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </button>
                  {!showFilterDetails && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4a7c59', flexWrap: 'wrap' }}>
                      <span><strong>Client:</strong> {getLabel(clientOptions, appliedFilters.client, 'N/A')}</span>
                      <span style={{ color: '#ddd' }}>|</span>
                      {(() => {
                        const contractSummary = getContractNumbersSummary(appliedFilters.contracts);
                        const hasMultipleContracts = appliedFilters.contracts.length > 1;
                        return (
                          <span
                            style={{ cursor: hasMultipleContracts ? 'help' : 'default', borderBottom: hasMultipleContracts ? '1px dotted #4a7c59' : 'none' }}
                            data-tooltip-id={hasMultipleContracts ? 'contracts-tooltip' : undefined}
                            data-tooltip-content={hasMultipleContracts ? contractSummary : undefined}
                          >
                            <strong>Contracts:</strong> {contractSummary}
                          </span>
                        );
                      })()}
                      {(() => {
                        const contractSummary = getContractNumbersSummary(appliedFilters.contracts);
                        const hasMultipleContracts = appliedFilters.contracts.length > 1;
                        return (
                          <span
                            style={{ cursor: hasMultipleContracts ? 'help' : 'default', borderBottom: hasMultipleContracts ? '1px dotted #4a7c59' : 'none' }}
                            data-tooltip-id={hasMultipleContracts ? 'contracts-tooltip' : undefined}
                            data-tooltip-content={hasMultipleContracts ? contractSummary : undefined}
                          >
                            <strong>Contracts:</strong> {contractSummary}
                          </span>
                        );
                      })()}
                      <span style={{ color: '#ddd' }}>|</span>
                      <span><strong>Dates:</strong> {appliedFilters.startDate || 'Any'} – {appliedFilters.endDate || 'Any'}</span>
                    </div>
                  )}
                </>
              )}
            </div>
            {!showFilters && appliedFilters && showFilterDetails && (
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
                  display: isMobile ? 'flex' : 'grid',
                  flexDirection: isMobile ? 'row' : undefined,
                  flexWrap: isMobile ? 'wrap' : undefined,
                  gridTemplateColumns: isMobile ? undefined : 'repeat(3, 1fr)',
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
                  display: isMobile ? 'flex' : 'grid',
                  flexDirection: isMobile ? 'row' : undefined,
                  flexWrap: isMobile ? 'wrap' : undefined,
                  gridTemplateColumns: isMobile ? undefined : 'repeat(3, 1fr)',
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
            marginBottom: '10px'
          }}
        >
          <div className="ag-theme-balham" style={{ width: '100%' }}>
            <AgGridReact
              gridOptions={gridOptions}
              rowData={displayRows}
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
              getRowStyle={getRowStyle}
              context={{
                expandedProjects,
                expandedContracts,
                toggleProject,
                toggleContract
              }}
            />
          </div>
        </div>
      )}

      {/* Goals and Business Spend Cards */}
      {subcontractorData.length > 0 && (
        <div style={bottomCardsContainerStyle}>
          {/* Goals Table Card */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              borderRadius: '12px',
              border: '1px solid rgba(142, 169, 78, 0.25)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              padding: '20px',
              width: '100%',
              minWidth: 0,
              overflow: 'hidden'
            }}
          >
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#1b5e20', fontWeight: '600' }}>
              Overall Diversity Business and Workforce Hiring Goals
            </h3>
            <div style={{ overflowX: 'auto', width: '100%' }}>
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
            ref={chartRef}
            ref={chartRef}
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              borderRadius: '12px',
              border: '1px solid rgba(142, 169, 78, 0.25)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              padding: '20px',
              width: '100%',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#1b5e20', fontWeight: '600' }}>
              Business Spend
            </h3>
            <div style={{ width: '100%', minWidth: 0, flex: 1 }}>
              <ResponsiveContainer width="100%" height={isMobile ? 260 : 300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'MBE', value: 3.39, color: '#5969F3' },
                      { name: 'Non-Diverse', value: 95.56, color: '#62b29aff' },
                      { name: 'WBE', value: 1.06, color: '#d79461ff' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={isMobile ? 70 : 80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'MBE', value: 3.39, color: '#5969F3' },
                      { name: 'Non-Diverse', value: 95.56, color: '#62b29aff' },
                      { name: 'WBE', value: 1.06, color: '#d79461ff' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry) => `${value}: ${entry.payload.value}%`}
                    wrapperStyle={{ fontSize: isMobile ? '12px' : '13px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
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

      {/* React Tooltips */}
      <ReactTooltip
        id="projects-tooltip"
        place="bottom"
        style={{
          backgroundColor: '#2d4a1f',
          color: '#ffffff',
          borderRadius: '6px',
          fontSize: '13px',
          padding: '8px 12px',
          maxWidth: '400px',
          zIndex: 9999
        }}
      />
      <ReactTooltip
        id="contracts-tooltip"
        place="bottom"
        style={{
          backgroundColor: '#2d4a1f',
          color: '#ffffff',
          borderRadius: '6px',
          fontSize: '13px',
          padding: '8px 12px',
          maxWidth: '400px',
          zIndex: 9999
        }}
      />
    </section>
  );
};

export default ProjectExecutiveSummaryExtendedAggregate;

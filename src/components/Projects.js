import { useMemo, useCallback, useState, useEffect } from 'react';
import { useOutletContext, Link, useLocation } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import projectsData from '../data/projects.json';
import RightSideBar from './RightSideBar';
import QuickProjectDetails from './QuickProjectDetails';
import CreateProjectForm from './CreateProjectForm';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

const Projects = () => {
  const { mainShifted } = useOutletContext();
  const location = useLocation();

  // State for quick project details panel
  const [detailsPanelActive, setDetailsPanelActive] = useState(false);
  const [selectedProjectNumber, setSelectedProjectNumber] = useState(null);

  // State for create project form panel
  const [createFormActive, setCreateFormActive] = useState(false);

  // State for selected rows
  const [selectedRows, setSelectedRows] = useState([]);

  // State for search
  const [searchText, setSearchText] = useState('');
  const [activeSearchText, setActiveSearchText] = useState('');

  // Store grid API reference
  const [gridApi, setGridApi] = useState(null);

  // Handlers for details panel
  const openDetailsPanel = useCallback((projectNumber) => {
    setSelectedProjectNumber(projectNumber);
    setDetailsPanelActive(true);
  }, []);

  const closeDetailsPanel = useCallback(() => {
    setDetailsPanelActive(false);
    setSelectedProjectNumber(null);
  }, []);

  // Handlers for create form panel
  const openCreateForm = useCallback(() => {
    setCreateFormActive(true);
  }, []);

  const closeCreateForm = useCallback(() => {
    setCreateFormActive(false);
  }, []);

  const handleCreateProject = useCallback((formData) => {
    console.log('Creating project:', formData);
    // TODO: Add API call to create project
    alert('Project creation functionality will be implemented here.');
  }, []);

  // Filter data based on active search text
  const filteredData = useMemo(() => {
    if (!activeSearchText.trim()) {
      return projectsData;
    }

    const searchLower = activeSearchText.toLowerCase();
    return projectsData.filter(project => {
      const projectNumber = (project.ProjectNumber || '').toString().toLowerCase();
      const projectName = (project.ProjectName || '').toLowerCase();
      const clientName = (project.PrimaryAgencyName || '').toLowerCase();

      return projectNumber.includes(searchLower) ||
             projectName.includes(searchLower) ||
             clientName.includes(searchLower);
    });
  }, [activeSearchText]);

  // Create datasource for infinite scroll
  const datasource = useMemo(() => ({
    rowCount: filteredData.length,
    getRows: (params) => {
      console.log('Asking for rows:', params.startRow, 'to', params.endRow);

      // Simulate async data loading (you can add setTimeout to simulate server delay)
      const rowsThisBlock = filteredData.slice(params.startRow, params.endRow);

      // Call success callback with the row data
      params.successCallback(rowsThisBlock, filteredData.length);
    }
  }), [filteredData]);

  // Handle grid ready event to set datasource
  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    params.api.setGridOption('datasource', datasource);
  }, [datasource]);

  const gridOptions = useMemo(() => ({
    theme: 'legacy'
  }), []);

  // Handle row selection change
  const onSelectionChanged = useCallback((event) => {
    const selectedNodes = event.api.getSelectedNodes();
    setSelectedRows(selectedNodes.map(node => node.data));
  }, []);

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  // Handle search button click
  const handleSearch = useCallback(() => {
    setActiveSearchText(searchText);
    // Save search to sessionStorage
    sessionStorage.setItem('projectsSearchText', searchText);
  }, [searchText]);

  // Handle Enter key press in search input
  const handleSearchKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  // Update grid datasource when filtered data changes
  useEffect(() => {
    if (gridApi) {
      gridApi.setGridOption('datasource', datasource);
    }
  }, [gridApi, datasource]);

  // Handle search restoration/clearing on mount
  useEffect(() => {
    const shouldRestoreSearch = location.state?.restoreSearch;

    if (shouldRestoreSearch) {
      // Restore search from sessionStorage
      const savedSearch = sessionStorage.getItem('projectsSearchText') || '';
      setSearchText(savedSearch);
      setActiveSearchText(savedSearch);
    } else {
      // Clear search when navigating from menu
      sessionStorage.removeItem('projectsSearchText');
      sessionStorage.removeItem('projectDetailsSource');
      setSearchText('');
      setActiveSearchText('');
    }

    // Clear the location state after processing to prevent re-triggering
    window.history.replaceState({}, document.title);
  }, [location.state]);

  // Cell renderer for Project Number link
  const ProjectNumberRenderer = (params) => {
    const handleProjectLinkClick = () => {
      // Save the source page to sessionStorage
      sessionStorage.setItem('projectDetailsSource', 'projects');
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            openDetailsPanel(params.value);
          }}
          style={{
            color: '#1976d2',
            textDecoration: 'none',
            fontWeight: '600',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
          onMouseOut={(e) => e.target.style.textDecoration = 'none'}
        >
          {params.value}
        </a>
        <Link
          to={`/project/${params.value}`}
          state={{ from: 'projects', restoreSearch: true }}
          onClick={handleProjectLinkClick}
          title="View Full Details"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'rgba(25, 118, 210, 0.1)',
            transition: 'all 0.2s ease',
            textDecoration: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(25, 118, 210, 0.2)';
            e.currentTarget.style.transform = 'scale(1.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(25, 118, 210, 0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '14px', height: '14px', fill: '#1976d2' }}
          >
            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
          </svg>
        </Link>
      </div>
    );
  };

  // Column definitions
  const columnDefs = useMemo(() => [
    // {
    //   headerName: '',
    //   checkboxSelection: true,
    //   headerCheckboxSelection: true,
    //   width: 50,
    //   maxWidth: 50,
    //   resizable: false,
    //   sortable: false,
    //   filter: false,
    //   pinned: 'left'
    // },
    {
      field: 'ProjectNumber',
      headerName: 'Project Number',
      sortable: true,
      filter: true,
      width: 160,
      cellRenderer: ProjectNumberRenderer
    },
    {
      field: 'ProjectName',
      headerName: 'Project Name',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 250
    },
    {
      field: 'PrimaryAgencyName',
      headerName: 'Primary Agency',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 200
    },
    {
      field: 'ComplianceOfficerDisplay',
      headerName: 'Compliance Officer',
      sortable: true,
      filter: true,
      width: 180
    },
    {
      field: 'ProjectStatusDescription',
      headerName: 'Project Status',
      sortable: true,
      filter: true,
      width: 150,
      cellStyle: (params) => {
        if (params.value === 'Active') {
          return { color: '#2e7d32', fontWeight: '600' };
        } else if (params.value === 'Prelim') {
          return { color: '#1976d2', fontWeight: '600' };
        } else if (params.value === 'Complete') {
          return { color: '#616161', fontWeight: '600' };
        } else if (params.value === 'Inactive') {
          return { color: '#d32f2f', fontWeight: '600' };
        }
        return null;
      }
    }
  ], []);

  // Default column properties
  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true
  }), []);

  return (
    <div className={`main-wrapper ${mainShifted ? 'shifted' : ''}`}>
      <main>
        <div className="content-container">
          <div className="projects-toolbar">
            <div className="projects-search-wrapper">
              <div style={{ position: 'relative', flex: 1 }}>
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '18px',
                    height: '18px',
                    fill: '#8ea94e',
                    pointerEvents: 'none'
                  }}
                >
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input
                  type="text"
                  value={searchText}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Project Number, Project Name, Client Name"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 24px',
                    fontSize: '14px',
                    border: '1px solid rgba(142, 169, 78, 0.3)',
                    borderRadius: '8px 0 0 8px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    color: '#2d4a1f',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    borderRight: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(142, 169, 78, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <button
                className="projects-search-button"
                onClick={handleSearch}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(142, 169, 78, 1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(142, 169, 78, 0.85)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: '18px', height: '18px', fill: 'currentColor' }}
                >
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <span className="projects-search-label">Search</span>
              </button>
            </div>

            <div className="projects-create-wrapper">
              <button
                className="projects-create-button"
                onClick={openCreateForm}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(142, 169, 78, 1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(142, 169, 78, 0.85)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: '18px', height: '18px', fill: 'currentColor' }}
                  >
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                <span className="projects-create-label">Create New</span>
              </button>
            </div>
          </div>

          {/* AG Grid Table with Infinite Scroll */}
          <div className="grid-card">
            <div className="ag-theme-balham grid-container">
              <AgGridReact
                gridOptions={gridOptions}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowModelType="infinite"
                cacheBlockSize={100}
                cacheOverflowSize={2}
                maxConcurrentDatasourceRequests={1}
                infiniteInitialRowCount={1000}
                maxBlocksInCache={10}
                onGridReady={onGridReady}
                onSelectionChanged={onSelectionChanged}
                animateRows={true}
                rowSelection="multiple"
                alwaysShowVerticalScroll={true}
                alwaysShowHorizontalScroll={true}
                theme="legacy"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Quick Project Details Panel */}
      <RightSideBar
        isActive={detailsPanelActive}
        onClose={closeDetailsPanel}
        title={selectedProjectNumber ? `${selectedProjectNumber}` : 'Project Details'}
        headerActionLink={selectedProjectNumber ? `/project/${selectedProjectNumber}` : null}
      >
        {selectedProjectNumber && (
          <QuickProjectDetails projectNumber={selectedProjectNumber} />
        )}
      </RightSideBar>

      {/* Create Project Form Panel */}
      <RightSideBar
        isActive={createFormActive}
        onClose={closeCreateForm}
        title="Create New Project"
        minWidth={450}
      >
        <CreateProjectForm onClose={closeCreateForm} onSubmit={handleCreateProject} />
      </RightSideBar>
    </div>
  );
};

export default Projects;

import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Contracts from './components/Contracts';
import ContractDetails from './components/ContractDetails';
import ProjectDetails from './components/ProjectDetails';
import Reports from './components/Reports';
import ProjectDetailsTab from './components/projectTabs/ProjectDetailsTab';
import ProjectFundingTab from './components/projectTabs/ProjectFundingTab';
import ProjectGoalsTab from './components/projectTabs/ProjectGoalsTab';
import ProjectAwardCriteriaTab from './components/projectTabs/ProjectAwardCriteriaTab';
import ProjectWagesTradesTab from './components/projectTabs/ProjectWagesTradesTab';
import ProjectBidPackagesTab from './components/projectTabs/ProjectBidPackagesTab';
import ProjectContractsTab from './components/projectTabs/ProjectContractsTab';
import ProjectAttachmentsTab from './components/projectTabs/ProjectAttachmentsTab';
import ProjectNotesTab from './components/projectTabs/ProjectNotesTab';
import ContractDetailsTab from './components/contractTabs/ContractDetailsTab';
import ContractContractorsTab from './components/contractTabs/ContractContractorsTab';
import ContractCommitmentsTab from './components/contractTabs/ContractCommitmentsTab';
import ContractEmployeesTab from './components/contractTabs/ContractEmployeesTab';
import ContractSiteVisitsTab from './components/contractTabs/ContractSiteVisitsTab';
import ContractPayrollsTab from './components/contractTabs/ContractPayrollsTab';
import ContractChangeOrdersTab from './components/contractTabs/ContractChangeOrdersTab';
import ContractPaymentsTab from './components/contractTabs/ContractPaymentsTab';
import ContractDataImportTab from './components/contractTabs/ContractDataImportTab';
import ContractAddressMapTab from './components/contractTabs/ContractAddressMapTab';
import ContractAttachmentsTab from './components/contractTabs/ContractAttachmentsTab';
import ContractNotesTab from './components/contractTabs/ContractNotesTab';
import ProjectExecutiveSummaryExtendedAggregate from './components/reports/ProjectExecutiveSummaryExtendedAggregate';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/projects',
        element: <Projects />
      },
      {
        path: '/contracts',
        element: <Contracts />
      },
      {
        path: '/reports',
        element: <Reports />,
        children: [
          {
            index: true,
            element: <Navigate to="project-executive-summary-extended-aggregate" replace />
          },
          {
            path: 'project-executive-summary-extended-aggregate',
            element: <ProjectExecutiveSummaryExtendedAggregate />
          }
        ]
      },
      {
        path: '/project/:projectNumber',
        element: <ProjectDetails />,
        children: [
          {
            index: true,
            element: <Navigate to="details" replace />
          },
          {
            path: 'details',
            element: <ProjectDetailsTab />
          },
          {
            path: 'funding',
            element: <ProjectFundingTab />
          },
          {
            path: 'goals',
            element: <ProjectGoalsTab />
          },
          {
            path: 'award-criteria',
            element: <ProjectAwardCriteriaTab />
          },
          {
            path: 'wages-trades',
            element: <ProjectWagesTradesTab />
          },
          {
            path: 'bid-packages',
            element: <ProjectBidPackagesTab />
          },
          {
            path: 'contracts',
            element: <ProjectContractsTab />
          },
          {
            path: 'attachments',
            element: <ProjectAttachmentsTab />
          },
          {
            path: 'notes',
            element: <ProjectNotesTab />
          }
        ]
      },
      {
        path: '/contract/:contractNumber',
        element: <ContractDetails />,
        children: [
          {
            index: true,
            element: <Navigate to="details" replace />
          },
          {
            path: 'details',
            element: <ContractDetailsTab />
          },
          {
            path: 'contractors',
            element: <ContractContractorsTab />
          },
          {
            path: 'commitments',
            element: <ContractCommitmentsTab />
          },
          {
            path: 'employees',
            element: <ContractEmployeesTab />
          },
          {
            path: 'site-visits',
            element: <ContractSiteVisitsTab />
          },
          {
            path: 'payrolls',
            element: <ContractPayrollsTab />
          },
          {
            path: 'change-orders',
            element: <ContractChangeOrdersTab />
          },
          {
            path: 'payments',
            element: <ContractPaymentsTab />
          },
          {
            path: 'data-import',
            element: <ContractDataImportTab />
          },
          {
            path: 'address-map',
            element: <ContractAddressMapTab />
          },
          {
            path: 'attachments',
            element: <ContractAttachmentsTab />
          },
          {
            path: 'notes',
            element: <ContractNotesTab />
          }
        ]
      }
    ]
  }
]);

export default router;

import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import SecondaryHeader from './components/SecondaryHeader';
import NavSideBar from './components/NavSideBar';
import RightSideBar from './components/RightSideBar';
import Messages from './components/Messages';
import Notifications from './components/Notifications';
import FloatingActionButton from './components/FloatingActionButton';

function App() {
  const location = useLocation();

  // State management
  const [hamburgerActive, setHamburgerActive] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [mainShifted, setMainShifted] = useState(false);
  const [isMobileView, setIsMobileView] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 767;
  });
  const [messagesSidebarActive, setMessagesSidebarActive] = useState(false);
  const [messagesFloatVisible, setMessagesFloatVisible] = useState(true);
  const [notificationsSidebarActive, setNotificationsSidebarActive] = useState(false);
  const [anyRightSidebarActive, setAnyRightSidebarActive] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState('gpts');
  const [activeTab, setActiveTab] = useState('Projects');
  const activeSidebarIdsRef = useRef(new Set());

  // Home icon component for breadcrumbs
  const HomeIcon = () => (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '16px',
        height: '16px',
        fill: 'currentColor',
        display: 'inline-block',
        verticalAlign: 'middle',
        marginTop: '-2px'
      }}
    >
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  );

  // Page configurations for breadcrumbs and tabs
  const pageConfigs = {
    '/': {
      breadcrumbs: [
        { icon: <HomeIcon />, href: '/dashboard', active: false },
        { label: 'Dashboard', href: '/dashboard', active: true }
      ],
      pageTitle: 'Dashboard',
      tabs: [],
      tabsOverflow: false
    },
    '/dashboard': {
      breadcrumbs: [
        { icon: <HomeIcon />, href: '/dashboard', active: false },
        { label: 'Dashboard', href: '/dashboard', active: true }
      ],
      pageTitle: 'Dashboard',
      tabs: [],
      tabsOverflow: false
    },
    '/projects': {
      breadcrumbs: [
        { icon: <HomeIcon />, href: '/dashboard', active: false },
        { label: 'Projects', href: '/projects', active: true }
      ],
      pageTitle: 'Projects',
      tabs: [],
      tabsOverflow: false
    },
    '/contracts': {
      breadcrumbs: [
        { icon: <HomeIcon />, href: '/dashboard', active: false },
        { label: 'Contracts', href: '/contracts', active: true }
      ],
      pageTitle: 'Contracts',
      tabs: [],
      tabsOverflow: false
    },
    '/reports': {
      breadcrumbs: [
        { icon: <HomeIcon />, href: '/dashboard', active: false },
        { label: 'Reports', href: '/reports', active: true }
      ],
      pageTitle: 'Reports',
      tabs: [],
      tabsOverflow: false
    }
  };

  // Get current page configuration
  let currentPageConfig = pageConfigs[location.pathname] || pageConfigs['/'];

  // Handle dynamic project details route
  const projectMatch = location.pathname.match(/^\/project\/([^/]+)/);
  if (projectMatch) {
    const projectNumber = projectMatch[1];
    currentPageConfig = {
      breadcrumbs: [
        { icon: <HomeIcon />, href: '/dashboard', active: false },
        { label: 'Projects', href: '/projects', active: false },
        { label: projectNumber, href: `/project/${projectNumber}`, active: true }
      ],
      pageTitle: `Project Details`,
      tabs: [
        { label: 'Details', href: `/project/${projectNumber}/details` },
        { label: 'Funding', href: `/project/${projectNumber}/funding` },
        { label: 'Goals', href: `/project/${projectNumber}/goals` },
        { label: 'Award Criteria', href: `/project/${projectNumber}/award-criteria` },
        { label: 'Wages / Trades', href: `/project/${projectNumber}/wages-trades` },
        { label: 'Bid Packages', href: `/project/${projectNumber}/bid-packages` },
        { label: 'Contracts', href: `/project/${projectNumber}/contracts` },
        { label: 'Attachments', href: `/project/${projectNumber}/attachments` },
        { label: 'Notes', href: `/project/${projectNumber}/notes` }
      ],
      tabsOverflow: true
    };
  }
  const contractMatch = location.pathname.match(/^\/contract\/([^/]+)/);
  if (contractMatch) {
    const contractNumber = contractMatch[1];
    currentPageConfig = {
      breadcrumbs: [
        { icon: <HomeIcon />, href: '/dashboard', active: false },
        { label: 'Contracts', href: '/contracts', active: false },
        { label: contractNumber, href: `/contract/${contractNumber}`, active: true }
      ],
      pageTitle: `Contract Details`,
      tabs: [
        { label: 'Details', href: `/contract/${contractNumber}/details` },
        { label: 'Contractors', href: `/contract/${contractNumber}/contractors` },
        { label: 'Commitments', href: `/contract/${contractNumber}/commitments` },
        { label: 'Employees', href: `/contract/${contractNumber}/employees` },
        { label: 'Site Visits', href: `/contract/${contractNumber}/site-visits` },
        { label: 'Payrolls', href: `/contract/${contractNumber}/payrolls` },
        { label: 'Change Orders', href: `/contract/${contractNumber}/change-orders` },
        { label: 'Payments', href: `/contract/${contractNumber}/payments` },
        { label: 'Data Import', href: `/contract/${contractNumber}/data-import` },
        { label: 'Address Map', href: `/contract/${contractNumber}/address-map` },
        { label: 'Attachments', href: `/contract/${contractNumber}/attachments` },
        { label: 'Notes', href: `/contract/${contractNumber}/notes` }
      ],
      tabsOverflow: true
    };
  }

  const reportsMatch = location.pathname.match(/^\/reports\/([^/]+)/);
  if (reportsMatch) {
    const reportSlug = reportsMatch[1];
    let reportLabel = 'Reports';
    if (reportSlug === 'project-executive-summary-extended-aggregate') {
      reportLabel = 'Project Executive Summary (Extended) - Aggregate';
    }
    currentPageConfig = {
      breadcrumbs: [
        { icon: <HomeIcon />, href: '/dashboard', active: false },
        { label: 'Reports', href: '/reports', active: false },
        { label: reportLabel, href: `/reports/${reportSlug}`, active: true }
      ],
      pageTitle: reportLabel,
      tabs: [],
      tabsOverflow: false
    };
  }

  const enableTabsOverflow = currentPageConfig.tabsOverflow !== false;

  // Conversations data structure
  const [conversations, setConversations] = useState({
    'Sarah Johnson': {
      name: 'Sarah Johnson',
      initials: 'SJ',
      messages: [
        { id: 1, text: "Can you review the latest project updates?", sender: 'Sarah Johnson', time: '10:30 AM', isMe: false },
        { id: 2, text: "I've made some changes to the timeline.", sender: 'Sarah Johnson', time: '10:31 AM', isMe: false },
        { id: 3, text: "Sure, I'll take a look right away.", sender: 'Me', time: '10:35 AM', isMe: true }
      ]
    },
    'Michael Chen': {
      name: 'Michael Chen',
      initials: 'MC',
      messages: [
        { id: 1, text: "The contract documents have been uploaded.", sender: 'Michael Chen', time: '9:15 AM', isMe: false },
        { id: 2, text: "Please verify when you get a chance.", sender: 'Michael Chen', time: '9:15 AM', isMe: false },
        { id: 3, text: "Thanks! I'll review them now.", sender: 'Me', time: '9:20 AM', isMe: true }
      ]
    },
    'Emily Rodriguez': {
      name: 'Emily Rodriguez',
      initials: 'ER',
      messages: [
        { id: 1, text: "Meeting scheduled for tomorrow at 2 PM.", sender: 'Emily Rodriguez', time: '8:45 AM', isMe: false },
        { id: 2, text: "Please confirm your availability.", sender: 'Emily Rodriguez', time: '8:45 AM', isMe: false }
      ]
    },
    'David Park': {
      name: 'David Park',
      initials: 'DP',
      messages: [
        { id: 1, text: "Thanks for the quick turnaround on the audit report.", sender: 'David Park', time: 'Yesterday', isMe: false },
        { id: 2, text: "Everything looks good!", sender: 'David Park', time: 'Yesterday', isMe: false }
      ]
    }
  });

  const [selectedPerson, setSelectedPerson] = useState('Sarah Johnson');

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Project Updated', time: '5m ago', message: 'Project #2024-001 has been updated with new funding information.', unread: true },
    { id: 2, title: 'Contract Approved', time: '1h ago', message: 'Contract #C-2024-045 has been approved and is ready for execution.', unread: true },
    { id: 3, title: 'Payment Processed', time: '2h ago', message: 'Payment for Contract #C-2024-032 has been processed successfully.', unread: false },
    { id: 4, title: 'Document Uploaded', time: '5h ago', message: 'New compliance documents have been uploaded to Project #2024-003.', unread: true },
    { id: 5, title: 'System Maintenance', time: 'Yesterday', message: 'Scheduled system maintenance completed. All services are operational.', unread: false }
  ]);

  // Toggle hamburger and sidebar
  const toggleSidebar = () => {
    setHamburgerActive(!hamburgerActive);
    setSidebarActive(!sidebarActive);

    // On desktop, shift main content
    if (window.innerWidth > 767) {
      setMainShifted(!mainShifted);
    }
  };

  // Close sidebar when clicking overlay
  const closeSidebar = () => {
    setHamburgerActive(false);
    setSidebarActive(false);
    if (window.innerWidth > 767) {
      setMainShifted(false);
    }
  };

  // Toggle submenu
  const toggleSubmenu = (menuName) => {
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName);
  };

  // Handle submenu link click
  const handleSubmenuClick = (e, href) => {
    // Only prevent default for hash links, not for router links
    if (href.startsWith('#')) {
      e.preventDefault();
      console.log('Navigating to:', href);
    }
    // Close sidebar when route changes
    closeSidebar();
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 767;
      setIsMobileView(isMobile);
      if (isMobile) {
        setMainShifted(false);
      } else if (sidebarActive) {
        setMainShifted(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarActive]);

  // Header icon handlers
  const handleNotification = () => {
    setNotificationsSidebarActive(true);
  };

  const handleHelp = () => {
    alert('Help clicked!\n\nThis would typically open help documentation, user guide, or support resources.');
  };

  const handleProfile = () => {
    alert('Profile clicked!\n\nThis would typically navigate to the user profile page or open a profile menu.');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      window.location.href = '/login.html';
    }
  };

  // Notifications handlers
  const closeNotificationsSidebar = () => {
    setNotificationsSidebarActive(false);
  };

  const handleNotificationClick = (notificationId) => {
    setNotifications(notifications.map(notif =>
      notif.id === notificationId ? { ...notif, unread: false } : notif
    ));
    console.log('Notification clicked:', notifications.find(n => n.id === notificationId)?.title);
  };

  // Messages handlers
  const toggleMessagesSidebar = () => {
    setMessagesSidebarActive(true);
    setMessagesFloatVisible(false);
  };

  const closeMessagesSidebar = () => {
    setMessagesSidebarActive(false);
    setMessagesFloatVisible(true);
  };

  const handlePersonChange = (personName) => {
    setSelectedPerson(personName);
  };

  const handleSendMessage = (messageText) => {
    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'Me',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isMe: true
    };

    setConversations(prev => ({
      ...prev,
      [selectedPerson]: {
        ...prev[selectedPerson],
        messages: [...prev[selectedPerson].messages, newMessage]
      }
    }));
  };

  useEffect(() => {
    const handleRightSidebarToggle = (event) => {
      const { id, isActive } = event.detail || {};
      if (!id) return;

      if (isActive) {
        activeSidebarIdsRef.current.add(id);
      } else {
        activeSidebarIdsRef.current.delete(id);
      }

      setAnyRightSidebarActive(activeSidebarIdsRef.current.size > 0);
    };

    window.addEventListener('right-sidebar-toggle', handleRightSidebarToggle);

    return () => {
      window.removeEventListener('right-sidebar-toggle', handleRightSidebarToggle);
    };
  }, []);

  // Tab handlers - Update activeTab based on route
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    console.log('Tab clicked:', tabName);
  };

  // Count unread messages across all conversations (for badge)
  const unreadCount = Object.values(conversations).reduce((count, conv) => {
    // Check if conversation has any unread messages (messages from others, not me)
    const hasUnread = conv.messages.some(msg => !msg.isMe && msg.id > 3); // Simplified unread logic
    return count + (hasUnread ? 1 : 0);
  }, 0);
  const unreadNotificationCount = notifications.filter(n => n.unread).length;

  return (
    <div className="App">
      {/* Header */}
      <Header
        hamburgerActive={hamburgerActive}
        onToggleSidebar={toggleSidebar}
        onNotificationClick={handleNotification}
        onHelpClick={handleHelp}
        onProfileClick={handleProfile}
        onLogoutClick={handleLogout}
        notificationBadgeCount={unreadNotificationCount}
      />

      {/* Sidebar Overlay (for mobile) */}
      <div
        className={`sidebar-overlay ${sidebarActive ? 'active' : ''}`}
        onClick={closeSidebar}
      ></div>

      {/* Left Sidebar Navigation */}
      <NavSideBar
        isActive={sidebarActive}
        activeSubmenu={activeSubmenu}
        onToggleSubmenu={toggleSubmenu}
        onSubmenuClick={handleSubmenuClick}
        currentPath={location.pathname}
      />

      {/* Secondary Header Bar */}
      <SecondaryHeader
        // breadcrumbs={currentPageConfig.breadcrumbs}
        breadcrumbs={null}
        pageTitle={currentPageConfig.pageTitle}
        tabs={currentPageConfig.tabs}
        activeTab={activeTab}
        onTabClick={handleTabClick}
        enableOverflow={enableTabsOverflow}
      />

      {/* Route Outlet - Renders child routes */}
      <Outlet context={{ mainShifted }} />

      {/* Notifications Sidebar */}
      <RightSideBar
        isActive={notificationsSidebarActive}
        onClose={closeNotificationsSidebar}
        title="Notifications"
      >
        <Notifications notifications={notifications} onNotificationClick={handleNotificationClick} />
      </RightSideBar>

      {/* Messages Sidebar */}
      <RightSideBar
        isActive={messagesSidebarActive}
        onClose={closeMessagesSidebar}
        title="Messages"
      >
        <Messages
          conversations={conversations}
          selectedPerson={selectedPerson}
          onPersonChange={handlePersonChange}
          onSendMessage={handleSendMessage}
        />
      </RightSideBar>

      {/* Floating Messages Icon */}
      <FloatingActionButton
        isVisible={messagesFloatVisible && !anyRightSidebarActive}
        onClick={toggleMessagesSidebar}
        badge={unreadCount}
        title="Messages"
        icon={
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
          </svg>
        }
      />
    </div>
  );
}

export default App;

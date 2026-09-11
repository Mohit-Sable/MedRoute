import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Bot,
  MapPin,
  ScanLine,
  GitMerge,
  Archive,
  CheckSquare,
  BarChart3,
  AlertTriangle,
  QrCode,
  Cpu,
  Settings,
  Sparkles,
  OctagonAlert,
  ChevronRight
} from 'lucide-react';

export const Sidebar = ({ mobileOpen, onCloseMobile }) => {
  const {
    activeView,
    setActiveView,
    robots,
    tasks,
    alerts,
    emergencyStopRobot,
    globalEmergencyStop,
    resumeRobot
  } = useApp();

  const pendingTasksCount = tasks.filter(t => t.status === 'Pending' || t.status === 'Assigned').length;
  const criticalAlertsCount = alerts.filter(a => a.status === 'Active' && a.severity === 'CRITICAL').length;
  const activeRobotsCount = robots.filter(r => r.status !== 'Charging' && r.status !== 'Idle').length;

  const navItems = [
    { id: 'landing', label: 'Demo / Landing', icon: Sparkles, badge: 'Demo' },
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'fleet', label: 'Robot Fleet', icon: Bot, count: `${activeRobotsCount} Active` },
    { id: 'tracking', label: 'Live Floor Tracking', icon: MapPin },
    { id: 'scanner', label: 'AI Waste Scanner', icon: ScanLine, highlight: true },
    { id: 'segregation', label: 'Automated Segregation', icon: GitMerge },
    { id: 'waste', label: 'Waste Management', icon: Archive },
    { id: 'passport', label: 'Digital Passport', icon: QrCode },
    { id: 'tasks', label: 'Collection Tasks', icon: CheckSquare, count: pendingTasksCount },
    { id: 'analytics', label: 'Operational Analytics', icon: BarChart3 },
    { id: 'alerts', label: 'Safety & Alerts', icon: AlertTriangle, count: criticalAlertsCount, isCritical: criticalAlertsCount > 0 },
    { id: 'architecture', label: 'AMR Hardware Arch', icon: Cpu },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={onCloseMobile} />
      )}

      <aside className={`app-sidebar ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
        {/* Brand Banner */}
        <div className="sidebar-brand-box">
          <div className="brand-logo-icon">
            <span className="logo-cross">+</span>
            <span className="logo-pulse-ring" />
          </div>
          <div className="brand-text-container">
            <div className="brand-title">
              MedRoute <span className="brand-ai-badge">AI</span>
            </div>
            <div className="brand-tagline">AMR Waste Segregation & Chain of Custody</div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="sidebar-nav-container">
          <div className="nav-group-label">OPERATIONS</div>
          {navItems.slice(0, 6).map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link-btn ${isActive ? 'nav-active' : ''} ${item.highlight ? 'nav-highlight-ai' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-icon-wrap">
                  <Icon size={17} />
                </span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge-ai">{item.badge}</span>}
                {item.count !== undefined && item.count !== 0 && (
                  <span className={`nav-count-badge ${item.isCritical ? 'badge-critical-pulse' : ''}`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          <div className="nav-group-label" style={{ marginTop: '16px' }}>TRACEABILITY & SAFETY</div>
          {navItems.slice(6).map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link-btn ${isActive ? 'nav-active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-icon-wrap">
                  <Icon size={17} />
                </span>
                <span className="nav-label">{item.label}</span>
                {item.count !== undefined && item.count !== 0 && (
                  <span className={`nav-count-badge ${item.isCritical ? 'badge-critical-pulse' : ''}`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Safety Interlock Control */}
        <div className="sidebar-emergency-dock">
          <div className="emergency-box">
            <div className="emergency-header">
              <OctagonAlert size={15} className={globalEmergencyStop ? 'text-critical animate-pulse' : 'text-muted'} />
              <span>Fleet Safety Override</span>
            </div>
            {globalEmergencyStop ? (
              <button
                className="btn btn-sm btn-success w-full mt-2"
                onClick={() => resumeRobot(null)}
              >
                Resume All Motors
              </button>
            ) : (
              <button
                className="btn btn-sm btn-outline-danger w-full mt-2"
                onClick={() => emergencyStopRobot(null)}
              >
                EMERGENCY STOP (E-STOP)
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

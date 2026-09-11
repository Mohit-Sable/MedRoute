import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  ShieldCheck,
  AlertTriangle,
  Play,
  Pause,
  Sliders,
  Volume2,
  VolumeX,
  Menu,
  Building2,
  X,
  ChevronRight
} from 'lucide-react';

export const Header = ({ onToggleMobileMenu }) => {
  const {
    hospitalProfile,
    currentUser,
    alerts,
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    simulationRunning,
    setSimulationRunning,
    simulationSpeed,
    setSimulationSpeed,
    soundEnabled,
    setSoundEnabled,
    globalEmergencyStop,
    resumeRobot,
    isAlertDrawerOpen,
    setIsAlertDrawerOpen
  } = useApp();

  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const activeAlerts = alerts.filter(a => a.status === 'Active');
  const criticalCount = activeAlerts.filter(a => a.severity === 'CRITICAL').length;

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          className="mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="hospital-brand-header">
          <div className="hospital-icon-wrap">
            <Building2 size={18} className="text-hospital-blue" />
          </div>
          <div className="hospital-details">
            <span className="hospital-title">{hospitalProfile.name}</span>
            <span className="hospital-zone">{hospitalProfile.subTitle}</span>
          </div>
        </div>

        <div className="system-status-indicator">
          {globalEmergencyStop ? (
            <div className="status-pill status-pill-critical">
              <span className="pulse-dot bg-critical" />
              <span>EMERGENCY STOP ACTIVE</span>
              <button
                className="resume-btn"
                onClick={() => resumeRobot(null)}
                title="Clear emergency stop"
              >
                Clear Interlock
              </button>
            </div>
          ) : (
            <div className="status-pill status-pill-normal">
              <span className="pulse-dot bg-safe" />
              <ShieldCheck size={13} />
              <span>All Subsystems Operational</span>
            </div>
          )}
        </div>
      </div>

      <div className="header-center">
        <div className="search-box-container">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="global-search-input"
            placeholder="Search robots, waste IDs (e.g. MW-1021), ICU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchDropdown(true)}
            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 250)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <X size={13} />
            </button>
          )}

          {showSearchDropdown && searchQuery.trim().length > 0 && (
            <div className="search-quick-results">
              <div className="search-result-group">
                <span className="result-group-title">Quick Actions</span>
                <div
                  className="search-item"
                  onClick={() => { setActiveView('scanner'); setSearchQuery(''); }}
                >
                  <Search size={12} /> Launch AI Waste Scanner
                </div>
                <div
                  className="search-item"
                  onClick={() => { setActiveView('tracking'); setSearchQuery(''); }}
                >
                  <Search size={12} /> View Live Floor Map
                </div>
                <div
                  className="search-item"
                  onClick={() => { setActiveView('waste'); }}
                >
                  <Search size={12} /> Search Waste Registry for "{searchQuery}"
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="header-right">
        {/* Simulation Toggles */}
        <div className="simulation-toolbar">
          <button
            className={`sim-btn ${simulationRunning ? 'sim-active' : ''}`}
            onClick={() => setSimulationRunning(!simulationRunning)}
            title={simulationRunning ? 'Pause simulation tick' : 'Start simulation tick'}
          >
            {simulationRunning ? <Pause size={13} /> : <Play size={13} />}
            <span className="sim-label">{simulationRunning ? 'Sim: Active' : 'Sim: Paused'}</span>
          </button>

          <button
            className="sim-speed-btn"
            onClick={() => setSimulationSpeed(simulationSpeed === 1 ? 2 : simulationSpeed === 2 ? 5 : 1)}
            title="Toggle simulation speed (1x, 2x, 5x)"
          >
            {simulationSpeed}x
          </button>

          <button
            className={`sim-audio-btn ${soundEnabled ? 'audio-on' : 'audio-off'}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute sound effects' : 'Enable audio feedback'}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>

        {/* Alerts Bell */}
        <div className="notification-bell-wrap">
          <button
            className="header-icon-btn"
            onClick={() => setIsAlertDrawerOpen(!isAlertDrawerOpen)}
            aria-label="View Safety Alerts"
          >
            <Bell size={18} />
            {activeAlerts.length > 0 && (
              <span className={`alert-badge-counter ${criticalCount > 0 ? 'badge-blink-critical' : ''}`}>
                {activeAlerts.length}
              </span>
            )}
          </button>

          {/* Quick Dropdown Drawer */}
          {isAlertDrawerOpen && (
            <div className="alerts-flyout">
              <div className="flyout-header">
                <div className="flyout-title">
                  <AlertTriangle size={15} className="text-amber" />
                  <span>Active System Alerts ({activeAlerts.length})</span>
                </div>
                <button
                  className="close-flyout-btn"
                  onClick={() => setIsAlertDrawerOpen(false)}
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flyout-list">
                {activeAlerts.slice(0, 4).map(alert => (
                  <div
                    key={alert.id}
                    className={`flyout-alert-item alert-border-${alert.severity.toLowerCase()}`}
                    onClick={() => {
                      setActiveView('alerts');
                      setIsAlertDrawerOpen(false);
                    }}
                  >
                    <div className="alert-item-top">
                      <span className={`badge badge-${alert.severity === 'CRITICAL' ? 'critical' : alert.severity === 'WARNING' ? 'warning' : 'info'}`}>
                        {alert.severity}
                      </span>
                      <span className="alert-time">{alert.timestamp}</span>
                    </div>
                    <p className="alert-item-msg">{alert.message}</p>
                    <div className="alert-item-loc">Location: {alert.location}</div>
                  </div>
                ))}
              </div>

              <div className="flyout-footer">
                <button
                  className="btn btn-primary btn-sm w-full"
                  onClick={() => {
                    setActiveView('alerts');
                    setIsAlertDrawerOpen(false);
                  }}
                >
                  Open Full Alert Center <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="user-profile-header">
          <div className="user-avatar-badge">{currentUser.avatar}</div>
          <div className="user-text-info">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-role">{currentUser.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

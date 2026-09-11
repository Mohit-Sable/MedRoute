import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCircle2,
  Clock,
  MapPin,
  Bot,
  Filter,
  Check,
  RotateCcw
} from 'lucide-react';

export const AlertsView = () => {
  const { alerts, acknowledgeAlert, resolveAlert, triggerAlert } = useApp();
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ACTIVE');

  const filteredAlerts = alerts.filter(a => {
    const matchesSev = filterSeverity === 'ALL' || a.severity === filterSeverity;
    const matchesStat =
      filterStatus === 'ALL' ||
      (filterStatus === 'ACTIVE' && a.status !== 'Resolved') ||
      a.status.toUpperCase() === filterStatus;
    return matchesSev && matchesStat;
  });

  return (
    <div className="alerts-view-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Hospital Bio-Safety & Fleet Alert Center</h1>
          <p>Real-time hazardous overfill warnings, AMR sensor faults, and overdue collection notices</p>
        </div>

        <div className="page-actions">
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => triggerAlert()}
            title="Simulate a new hospital safety warning"
          >
            <AlertTriangle size={14} /> Trigger Test Warning
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card mb-4">
        <div className="card-body py-3">
          <div className="task-filter-toolbar">
            <div className="filter-pills-group">
              {[
                { id: 'ACTIVE', label: 'Active Alerts' },
                { id: 'ALL', label: 'All Alerts' },
                { id: 'RESOLVED', label: 'Resolved History' }
              ].map(f => (
                <button
                  key={f.id}
                  className={`task-filter-pill ${filterStatus === f.id ? 'pill-active' : ''}`}
                  onClick={() => setFilterStatus(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="filter-dropdown-wrap">
              <label className="filter-label">Severity Tier:</label>
              <select
                className="form-control filter-select"
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical Only</option>
                <option value="WARNING">Warnings</option>
                <option value="INFO">Info Notices</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="alerts-feed-container">
        {filteredAlerts.length === 0 ? (
          <div className="card text-center py-12 text-muted">
            <CheckCircle2 size={32} className="text-safe mx-auto mb-2" />
            <p className="font-semibold">No alerts matching current filters.</p>
            <span className="text-xs">All hospital telemetry and bio-waste compartments within safe parameters.</span>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'CRITICAL';
            const isWarning = alert.severity === 'WARNING';
            const isResolved = alert.status === 'Resolved';
            const isAck = alert.status === 'Acknowledged';

            return (
              <div
                key={alert.id}
                className={`alert-expanded-card card ${isCritical ? 'border-l-critical' : isWarning ? 'border-l-warning' : 'border-l-info'} ${isResolved ? 'opacity-60' : ''}`}
              >
                <div className="alert-card-top-row">
                  <div className="alert-severity-badge-wrap">
                    <span className={`badge ${isCritical ? 'badge-critical' : isWarning ? 'badge-warning' : 'badge-info'}`}>
                      {isCritical ? <ShieldAlert size={12} /> : <AlertTriangle size={12} />}
                      {alert.severity}
                    </span>
                    <span className="alert-id-code font-mono">{alert.id}</span>
                    <span className="alert-type-tag">{alert.type.replace(/_/g, ' ')}</span>
                  </div>

                  <div className="alert-meta-top">
                    <span className="alert-time font-mono">
                      <Clock size={12} className="inline-icon" /> {alert.timestamp}
                    </span>
                    <span className={`badge ${isResolved ? 'badge-safe' : isAck ? 'badge-info' : 'badge-warning'}`}>
                      {alert.status}
                    </span>
                  </div>
                </div>

                <div className="alert-message-body">
                  <h3 className="alert-msg-headline">{alert.message}</h3>

                  <div className="alert-location-tags">
                    <span className="tag-pill">
                      <MapPin size={12} /> Location: <strong>{alert.location}</strong>
                    </span>
                    <span className="tag-pill">
                      <Bot size={12} /> Robot: <strong>{alert.robotId}</strong>
                    </span>
                  </div>

                  <div className="alert-recommended-box">
                    <strong>Recommended Corrective Action:</strong>
                    <p>{alert.recommendedAction}</p>
                  </div>
                </div>

                <div className="alert-card-actions-bar">
                  {!isResolved && (
                    <>
                      {alert.status === 'Active' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          <Check size={13} /> Acknowledge Alert
                        </button>
                      )}
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        <CheckCircle2 size={13} /> Mark Resolved
                      </button>
                    </>
                  )}
                  {isResolved && (
                    <span className="text-safe text-xs font-semibold flex-center-gap">
                      <CheckCircle2 size={13} /> Corrective Protocol Completed & Logged
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

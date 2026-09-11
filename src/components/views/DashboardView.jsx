import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Weight,
  Bot,
  Clock,
  AlertTriangle,
  Timer,
  CheckCircle2,
  BatteryCharging,
  BatteryMedium,
  MapPin,
  TrendingUp,
  Activity,
  ArrowRight,
  ExternalLink,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';

export const DashboardView = () => {
  const {
    robots,
    tasks,
    alerts,
    analyticsData,
    activityLog,
    setActiveView,
    setSelectedRobotId,
    openPassport,
    wasteRecords
  } = useApp();

  const pendingTasks = tasks.filter(t => t.status === 'Pending' || t.status === 'Assigned');
  const pendingTasksCount = pendingTasks.length;
  const activeAlerts = alerts.filter(a => a.status === 'Active');
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'CRITICAL');
  const criticalAlertsCount = criticalAlerts.length;
  const activeRobotsCount = robots.filter(r => r.status !== 'Charging' && r.status !== 'Idle').length;

  // Calculate dynamic waste weight collected from real waste records
  const totalWasteWeightToday = parseFloat(
    wasteRecords.reduce((acc, curr) => acc + (parseFloat(curr.weightKg) || 0), 0).toFixed(1)
  );

  return (
    <div className="dashboard-container">
      {/* Top Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Hospital Command Center</h1>
          <p>Real-time autonomous biomedical-waste collection telemetry & chain-of-custody</p>
        </div>

        <div className="page-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveView('tracking')}>
            <MapPin size={14} /> Full Floor Plan
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveView('scanner')}>
            <Bot size={14} /> Launch Scanner
          </button>
        </div>
      </div>

      {/* Top KPI Cards (6 Cards) */}
      <div className="kpi-grid">
        <div className="kpi-card accent-blue">
          <div className="kpi-header">
            <span className="kpi-label">Waste Tracked Today</span>
            <div className="kpi-icon-wrap"><Weight size={18} /></div>
          </div>
          <div className="kpi-value">{totalWasteWeightToday || analyticsData.kpis.wasteTodayKg} <span className="text-unit">kg</span></div>
          <div className="kpi-subtext">
            <TrendingUp size={13} className="text-safe" />
            <span>{wasteRecords.length} records in custody ledger</span>
          </div>
        </div>

        <div className="kpi-card accent-green">
          <div className="kpi-header">
            <span className="kpi-label">Active AMR Robots</span>
            <div className="kpi-icon-wrap"><Bot size={18} /></div>
          </div>
          <div className="kpi-value">{activeRobotsCount} <span className="text-unit">/ {robots.length}</span></div>
          <div className="kpi-subtext">
            <span className="badge-dot bg-safe" />
            <span>{robots.length > 0 ? `${activeRobotsCount} active, ${robots.length - activeRobotsCount} idle/docked` : 'No robots connected'}</span>
          </div>
        </div>

        <div className="kpi-card accent-amber">
          <div className="kpi-header">
            <span className="kpi-label">Pending Tasks</span>
            <div className="kpi-icon-wrap"><Clock size={18} /></div>
          </div>
          <div className="kpi-value">{pendingTasksCount}</div>
          <div className="kpi-subtext">
            <span>{pendingTasksCount > 0 ? `Next: ${pendingTasks[0].department} (${pendingTasks[0].wasteType})` : 'All tasks cleared'}</span>
          </div>
        </div>

        <div className="kpi-card accent-red">
          <div className="kpi-header">
            <span className="kpi-label">Critical Alerts</span>
            <div className="kpi-icon-wrap"><AlertTriangle size={18} /></div>
          </div>
          <div className="kpi-value text-critical">{criticalAlertsCount}</div>
          <div className="kpi-subtext">
            <span>{criticalAlertsCount > 0 ? criticalAlerts[0].message.slice(0, 32) + '...' : 'Zero critical hazards'}</span>
          </div>
        </div>

        <div className="kpi-card accent-blue">
          <div className="kpi-header">
            <span className="kpi-label">Avg. Collection Time</span>
            <div className="kpi-icon-wrap"><Timer size={18} /></div>
          </div>
          <div className="kpi-value">{analyticsData.kpis.avgCollectionTimeMinutes} <span className="text-unit">min</span></div>
          <div className="kpi-subtext text-safe">
            <span>-14% speed optimization</span>
          </div>
        </div>

        <div className="kpi-card accent-purple">
          <div className="kpi-header">
            <span className="kpi-label">Segregation Accuracy</span>
            <div className="kpi-icon-wrap"><CheckCircle2 size={18} /></div>
          </div>
          <div className="kpi-value text-ai">{analyticsData.kpis.segregationAccuracy}%</div>
          <div className="kpi-subtext">
            <span>Verified by Edge Vision AI</span>
          </div>
        </div>
      </div>

      {/* Main Command Grid */}
      <div className="dashboard-main-grid">
        {/* Left Column: Live Robots & Floor Map Snapshot */}
        <div className="dashboard-col-primary">
          {/* Section A: Live Robot Status Panel */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Bot size={17} className="text-hospital-blue" />
                <span>Live AMR Fleet Telemetry</span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveView('fleet')}
              >
                Fleet Manager <ChevronRight size={13} />
              </button>
            </div>

            <div className="card-body">
              <div className="robots-status-grid">
                {robots.map(robot => {
                  const isCharging = robot.status === 'Charging';
                  return (
                    <div
                      key={robot.id}
                      className="robot-mini-card"
                      onClick={() => {
                        setSelectedRobotId(robot.id);
                        setActiveView('fleet');
                      }}
                    >
                      <div className="robot-mini-header">
                        <div className="robot-name-group">
                          <span className="robot-id-tag">{robot.id}</span>
                          <span className="robot-full-name">{robot.name}</span>
                        </div>
                        <span className={`badge ${robot.status === 'Collecting' ? 'badge-safe' : isCharging ? 'badge-info' : 'badge-warning'}`}>
                          <span className="badge-dot" />
                          {robot.status}
                        </span>
                      </div>

                      <div className="robot-telemetry-row">
                        <div className="telemetry-item">
                          <span className="telem-label">Battery</span>
                          <div className="battery-display">
                            {isCharging ? (
                              <BatteryCharging size={16} className="text-info" />
                            ) : (
                              <BatteryMedium size={16} className={robot.battery < 40 ? 'text-amber' : 'text-safe'} />
                            )}
                            <span className="telem-value">{robot.battery}%</span>
                          </div>
                          <div className="battery-progress-bar">
                            <div
                              className={`battery-fill ${robot.battery < 40 ? 'bg-warning' : 'bg-safe'}`}
                              style={{ width: `${robot.battery}%` }}
                            />
                          </div>
                        </div>

                        <div className="telemetry-item">
                          <span className="telem-label">Floor / Location</span>
                          <span className="telem-value font-mono">
                            Floor {robot.floor} • {robot.location}
                          </span>
                        </div>

                        <div className="telemetry-item">
                          <span className="telem-label">Current Load</span>
                          <span className="telem-value font-mono">
                            {robot.loadPercentage}% ({robot.totalWeightKg} kg)
                          </span>
                          <div className="battery-progress-bar">
                            <div
                              className="battery-fill bg-info"
                              style={{ width: `${robot.loadPercentage}%` }}
                            />
                          </div>
                        </div>

                        <div className="telemetry-item">
                          <span className="telem-label">Destination</span>
                          <span className="telem-value text-destination">
                            {robot.destination || 'Standby'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section B: Hospital Floor Map Snapshot */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <MapPin size={17} className="text-hospital-blue" />
                <span>Hospital Floor Map — Real-Time AMR Tracking</span>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setActiveView('tracking')}
              >
                Interactive Floor Navigator <ExternalLink size={13} />
              </button>
            </div>

            <div className="card-body">
              <div className="floor-plan-preview-container">
                {/* SVG Mini Floor Map */}
                <svg viewBox="0 0 850 480" className="floor-svg-canvas">
                  {/* Grid background */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.75" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="#f8fafc" />
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Corridors */}
                  <path
                    d="M 120 380 L 170 380 L 170 150 L 740 150 L 740 300 L 460 300 L 460 410"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 280 260 L 560 260 L 560 380"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Active Route Dash Path */}
                  <path
                    d="M 120 380 L 170 380 L 170 150 L 440 130 L 560 260 L 460 410"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    className="animated-dash-path"
                  />

                  {/* Room Nodes */}
                  {/* Charging Station */}
                  <g transform="translate(40, 340)">
                    <rect width="110" height="70" rx="8" fill="#f0f9ff" stroke="#0284c7" strokeWidth="1.5" />
                    <text x="55" y="32" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0369a1">CHARGING BAY</text>
                    <text x="55" y="50" textAnchor="middle" fontSize="10" fill="#64748b">Dock 1 & 2 (FL1)</text>
                  </g>

                  {/* Ward A */}
                  <g transform="translate(120, 90)">
                    <rect width="120" height="75" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
                    <text x="60" y="35" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a">Ward A</text>
                    <text x="60" y="52" textAnchor="middle" fontSize="10" fill="#64748b">Surgical • FL2</text>
                  </g>

                  {/* ICU */}
                  <g transform="translate(390, 80)">
                    <rect width="130" height="85" rx="8" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.8" />
                    <text x="65" y="36" textAnchor="middle" fontSize="13" fontWeight="800" fill="#b91c1c">ICU SUITE</text>
                    <text x="65" y="54" textAnchor="middle" fontSize="10" fill="#991b1b">High Biohazard • FL2</text>
                    <circle cx="115" cy="20" r="4" fill="#dc2626" />
                  </g>

                  {/* Laboratory */}
                  <g transform="translate(680, 90)">
                    <rect width="130" height="75" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
                    <text x="65" y="35" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a">Pathology Lab</text>
                    <text x="65" y="52" textAnchor="middle" fontSize="10" fill="#64748b">Diagnostic • FL3</text>
                  </g>

                  {/* Emergency */}
                  <g transform="translate(230, 220)">
                    <rect width="130" height="80" rx="8" fill="#fffbeb" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="65" y="36" textAnchor="middle" fontSize="12" fontWeight="700" fill="#b45309">Emergency ED</text>
                    <text x="65" y="54" textAnchor="middle" fontSize="10" fill="#78350f">Trauma Bay • FL1</text>
                  </g>

                  {/* Pharmacy */}
                  <g transform="translate(510, 220)">
                    <rect width="130" height="80" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
                    <text x="65" y="36" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a">Central Pharmacy</text>
                    <text x="65" y="54" textAnchor="middle" fontSize="10" fill="#64748b">Cleanroom • FL1</text>
                  </g>

                  {/* Ward B */}
                  <g transform="translate(690, 260)">
                    <rect width="120" height="75" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
                    <text x="60" y="35" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a">Ward B</text>
                    <text x="60" y="52" textAnchor="middle" fontSize="10" fill="#64748b">Pediatric • FL2</text>
                  </g>

                  {/* Waste Storage */}
                  <g transform="translate(390, 370)">
                    <rect width="160" height="75" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.8" />
                    <text x="80" y="35" textAnchor="middle" fontSize="12" fontWeight="800" fill="#065f46">SECURE STORAGE</text>
                    <text x="80" y="52" textAnchor="middle" fontSize="10" fill="#047857">Vault & Autoclaves (B1)</text>
                  </g>

                  {/* Animated Robot 1 Marker (Near ICU) */}
                  <g transform="translate(440, 140)">
                    <circle cx="0" cy="0" r="16" fill="#0284c7" fillOpacity="0.2" className="animate-beacon" />
                    <circle cx="0" cy="0" r="9" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
                    <text x="0" y="22" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0284c7">RB-001 (Collecting)</text>
                  </g>

                  {/* Robot 2 Marker (Charging Dock) */}
                  <g transform="translate(90, 380)">
                    <circle cx="0" cy="0" r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    <text x="0" y="18" textAnchor="middle" fontSize="9" fontWeight="600" fill="#059669">RB-002 (Docked)</text>
                  </g>
                </svg>

                <div className="floor-map-legend">
                  <div className="legend-item"><span className="legend-dot bg-blue" /> AMR Active Transit</div>
                  <div className="legend-item"><span className="legend-dot bg-red" /> Critical Zone (ICU)</div>
                  <div className="legend-item"><span className="legend-dot bg-amber" /> Emergency / Trauma</div>
                  <div className="legend-item"><span className="legend-dot bg-green" /> Secure Vault (B1)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Charts & Live Activity Stream */}
        <div className="dashboard-col-secondary">
          {/* Section C: Waste Distribution Chart */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Layers size={17} className="text-hospital-blue" />
                <span>Waste Distribution by Stream</span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveView('segregation')}
              >
                Sort Diverter <ChevronRight size={13} />
              </button>
            </div>

            <div className="card-body">
              <div className="distribution-bars-list">
                {analyticsData.categoryDistribution.map(cat => (
                  <div key={cat.category} className="dist-item">
                    <div className="dist-item-top">
                      <span className="dist-cat-name" style={{ color: cat.color }}>
                        {cat.category}
                      </span>
                      <span className="dist-cat-stats">
                        {cat.weightKg} kg <strong>({cat.percentage}%)</strong>
                      </span>
                    </div>
                    <div className="dist-progress-bar">
                      <div
                        className="dist-progress-fill"
                        style={{
                          width: `${cat.percentage * 2.2}%`,
                          backgroundColor: cat.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section D: 7-Day Collection Trend */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <TrendingUp size={17} className="text-hospital-blue" />
                <span>7-Day Waste Collection Trend</span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveView('analytics')}
              >
                Analytics <ChevronRight size={13} />
              </button>
            </div>

            <div className="card-body">
              <div className="trend-chart-container">
                {/* SVG Bar Chart */}
                <svg viewBox="0 0 340 140" className="trend-svg">
                  {analyticsData.sevenDayTrend.map((d, i) => {
                    const barHeight = (d.weightKg / 160) * 90;
                    const x = 20 + i * 46;
                    const y = 110 - barHeight;
                    const isToday = i === analyticsData.sevenDayTrend.length - 1;
                    return (
                      <g key={d.day}>
                        {/* Background track */}
                        <rect x={x} y="20" width="26" height="90" rx="4" fill="#f1f5f9" />
                        {/* Value Bar */}
                        <rect
                          x={x}
                          y={y}
                          width="26"
                          height={barHeight}
                          rx="4"
                          fill={isToday ? '#0284c7' : '#94a3b8'}
                        />
                        {/* Day label */}
                        <text x={x + 13} y="128" textAnchor="middle" fontSize="10" fill="#64748b">
                          {d.day.split(' ')[0]}
                        </text>
                        {/* Kg label */}
                        <text x={x + 13} y={y - 5} textAnchor="middle" fontSize="9" fontWeight="600" fill="#0f172a">
                          {d.weightKg}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Section E: Recent Real-Time Activity Log */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Activity size={17} className="text-hospital-blue" />
                <span>Real-Time Activity Stream</span>
              </div>
              <span className="badge badge-safe">
                <span className="badge-dot" /> Live Telemetry
              </span>
            </div>

            <div className="card-body p-0">
              <div className="recent-activity-feed">
                {activityLog.slice(0, 6).map(act => (
                  <div key={act.id} className="activity-feed-row">
                    <div className="act-bullet-wrap">
                      <span className={`act-bullet type-${act.type}`} />
                    </div>
                    <div className="act-content">
                      <p className="act-text">{act.text}</p>
                      <span className="act-time">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Play,
  Pause,
  RotateCcw,
  OctagonAlert,
  MapPin,
  Bot,
  BatteryMedium,
  Gauge,
  Compass,
  AlertTriangle,
  ShieldCheck,
  Send,
  Building,
  Layers,
  ChevronRight
} from 'lucide-react';
import { DEFAULT_ROUTE_COORDINATES } from '../../data/mockData';

export const LiveTrackingView = () => {
  const {
    robots,
    selectedRobotId,
    setSelectedRobotId,
    simulationRunning,
    setSimulationRunning,
    emergencyStopRobot,
    resumeRobot,
    sendRobotToBase,
    dispatchRobot,
    globalEmergencyStop,
    setActiveView
  } = useApp();

  const [selectedFloor, setSelectedFloor] = useState(2); // 1, 2, 3, or 'B1'
  const [showObstacleAlert, setShowObstacleAlert] = useState(true);

  const activeRobot = robots.find(r => r.id === (selectedRobotId || 'RB-001')) || robots[0];
  const currentWaypoint = DEFAULT_ROUTE_COORDINATES[activeRobot.currentWaypointIndex] || DEFAULT_ROUTE_COORDINATES[0];

  return (
    <div className="tracking-view-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Live Hospital Floor Tracking</h1>
          <p>Real-time autonomous navigation, LiDAR SLAM pathing & obstacle avoidance</p>
        </div>

        <div className="page-actions">
          {/* Floor selector tabs */}
          <div className="floor-selector-pill">
            <span className="floor-sel-label">Level:</span>
            {[
              { id: 'B1', label: 'B1 (Vault)' },
              { id: 1, label: 'Floor 1 (ED/Pharma)' },
              { id: 2, label: 'Floor 2 (ICU/Wards)' },
              { id: 3, label: 'Floor 3 (Pathology)' }
            ].map(fl => (
              <button
                key={fl.id}
                className={`floor-btn ${selectedFloor === fl.id ? 'floor-btn-active' : ''}`}
                onClick={() => setSelectedFloor(fl.id)}
              >
                {fl.label}
              </button>
            ))}
          </div>

          <button
            className={`btn btn-sm ${simulationRunning ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setSimulationRunning(!simulationRunning)}
          >
            {simulationRunning ? <Pause size={14} /> : <Play size={14} />}
            <span>{simulationRunning ? 'Pause Route' : 'Resume Route'}</span>
          </button>
        </div>
      </div>

      {/* Main Tracking Layout: Interactive SVG Map (Left) + Telemetry & Mission Control Panel (Right) */}
      <div className="tracking-grid-layout">
        {/* Vector Floor Map Area */}
        <div className="card tracking-map-card">
          <div className="card-header">
            <div className="card-title">
              <Compass size={17} className="text-hospital-blue" />
              <span>Hospital Blueprint & Navigation Costmap — Level {selectedFloor}</span>
            </div>

            <div className="map-quick-status">
              <span className="badge badge-safe">
                <span className="badge-dot" /> SLAM Online (±2cm accuracy)
              </span>
            </div>
          </div>

          <div className="card-body p-0 map-interactive-viewport">
            {/* Real-time Map SVG */}
            <svg viewBox="0 0 920 540" className="live-floor-svg">
              {/* Background Architectural Grid */}
              <defs>
                <pattern id="trackGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="0.75" />
                </pattern>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
              </defs>

              <rect width="100%" height="100%" fill="#f8fafc" />
              <rect width="100%" height="100%" fill="url(#trackGrid)" />

              {/* Main Structural Corridors (Grey Thick Paths) */}
              <path
                d="M 120 420 L 180 420 L 180 160 L 760 160 L 760 340 L 480 340 L 480 440"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 300 280 L 580 280 L 580 400"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Waypoint Connection Lines */}
              <path
                d="M 100 420 L 180 420 L 180 160 L 460 140 L 580 280 L 480 440"
                fill="none"
                stroke="#0284c7"
                strokeWidth="3.5"
                strokeDasharray="8 6"
                className="animated-dash-path"
              />

              {/* Department Rooms with Floor-Aware Highlighting */}
              {/* Charging Dock Bay (Level 1) */}
              <g transform="translate(30, 370)" style={{ opacity: selectedFloor === 1 || selectedFloor === 'B1' ? 1 : 0.45, transition: 'opacity 0.3s' }}>
                <rect width="130" height="90" rx="10" fill="#f0f9ff" stroke={selectedFloor === 1 ? '#0284c7' : '#cbd5e1'} strokeWidth={selectedFloor === 1 ? 3 : 1.5} />
                <text x="65" y="38" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0369a1">CHARGING DOCKS</text>
                <text x="65" y="58" textAnchor="middle" fontSize="10.5" fill="#64748b">Bay 1 & Bay 2 (FL1)</text>
                <circle cx="110" cy="25" r="4" fill="#10b981" />
              </g>

              {/* Ward A (Surgical - Level 2) */}
              <g transform="translate(120, 90)" style={{ opacity: selectedFloor === 2 ? 1 : 0.45, transition: 'opacity 0.3s' }}>
                <rect width="130" height="90" rx="10" fill="#ffffff" stroke={selectedFloor === 2 ? '#0284c7' : '#e2e8f0'} strokeWidth={selectedFloor === 2 ? 3 : 1.5} />
                <text x="65" y="38" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a">Ward A</text>
                <text x="65" y="56" textAnchor="middle" fontSize="11" fill="#64748b">Surgical • Beds 1-20</text>
                <text x="65" y="74" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0d9488">Level 2</text>
              </g>

              {/* ICU Suite (Critical Red - Level 2) */}
              <g transform="translate(400, 80)" style={{ opacity: selectedFloor === 2 ? 1 : 0.45, transition: 'opacity 0.3s' }}>
                <rect width="150" height="100" rx="10" fill="#fef2f2" stroke="#dc2626" strokeWidth={selectedFloor === 2 ? 3.5 : 1.5} />
                <text x="75" y="38" textAnchor="middle" fontSize="14" fontWeight="800" fill="#b91c1c">ICU ISOLATION</text>
                <text x="75" y="58" textAnchor="middle" fontSize="11" fill="#991b1b">Biohazard Level 3</text>
                <text x="75" y="76" textAnchor="middle" fontSize="10" fontWeight="700" fill="#dc2626">High Priority Station</text>
                <circle cx="130" cy="25" r="5" fill="#dc2626" className="animate-beacon" />
              </g>

              {/* Pathology Laboratory (Level 3) */}
              <g transform="translate(700, 90)" style={{ opacity: selectedFloor === 3 ? 1 : 0.45, transition: 'opacity 0.3s' }}>
                <rect width="140" height="90" rx="10" fill="#ffffff" stroke={selectedFloor === 3 ? '#6366f1' : '#e2e8f0'} strokeWidth={selectedFloor === 3 ? 3 : 1.5} />
                <text x="70" y="38" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a">Pathology Lab</text>
                <text x="70" y="56" textAnchor="middle" fontSize="11" fill="#64748b">Culture & Micro Bio</text>
                <text x="70" y="74" textAnchor="middle" fontSize="10" fontWeight="600" fill="#6366f1">Level 3</text>
              </g>

              {/* Emergency Department (Level 1) */}
              <g transform="translate(240, 240)" style={{ opacity: selectedFloor === 1 ? 1 : 0.45, transition: 'opacity 0.3s' }}>
                <rect width="140" height="95" rx="10" fill="#fffbeb" stroke={selectedFloor === 1 ? '#d97706' : '#f59e0b'} strokeWidth={selectedFloor === 1 ? 3 : 1.5} />
                <text x="70" y="38" textAnchor="middle" fontSize="13" fontWeight="800" fill="#b45309">Emergency (ED)</text>
                <text x="70" y="58" textAnchor="middle" fontSize="11" fill="#78350f">Trauma Bay 1 & 2</text>
                <text x="70" y="76" textAnchor="middle" fontSize="10" fontWeight="600" fill="#d97706">Level 1</text>
              </g>

              {/* Central Pharmacy (Level 1) */}
              <g transform="translate(530, 240)" style={{ opacity: selectedFloor === 1 ? 1 : 0.45, transition: 'opacity 0.3s' }}>
                <rect width="140" height="95" rx="10" fill="#ffffff" stroke={selectedFloor === 1 ? '#0284c7' : '#e2e8f0'} strokeWidth={selectedFloor === 1 ? 3 : 1.5} />
                <text x="70" y="38" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a">Pharmacy</text>
                <text x="70" y="58" textAnchor="middle" fontSize="11" fill="#64748b">Cytotoxic Storage</text>
                <text x="70" y="76" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0284c7">Level 1</text>
              </g>

              {/* Ward B (Pediatrics - Level 2) */}
              <g transform="translate(710, 280)" style={{ opacity: selectedFloor === 2 ? 1 : 0.45, transition: 'opacity 0.3s' }}>
                <rect width="130" height="90" rx="10" fill="#ffffff" stroke={selectedFloor === 2 ? '#0284c7' : '#e2e8f0'} strokeWidth={selectedFloor === 2 ? 3 : 1.5} />
                <text x="65" y="38" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a">Ward B</text>
                <text x="65" y="56" textAnchor="middle" fontSize="11" fill="#64748b">Pediatric Suites</text>
                <text x="65" y="74" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0d9488">Level 2</text>
              </g>

              {/* Basement Secure Waste Depository (B1) */}
              <g transform="translate(410, 390)" style={{ opacity: selectedFloor === 'B1' ? 1 : 0.45, transition: 'opacity 0.3s' }}>
                <rect width="180" height="100" rx="10" fill="#ecfdf5" stroke="#10b981" strokeWidth={selectedFloor === 'B1' ? 3.5 : 1.5} />
                <text x="90" y="38" textAnchor="middle" fontSize="13" fontWeight="800" fill="#065f46">SECURE DEPOSITORY</text>
                <text x="90" y="58" textAnchor="middle" fontSize="11" fill="#047857">Vault & Autoclaves (B1)</text>
                <text x="90" y="76" textAnchor="middle" fontSize="10" fontWeight="700" fill="#059669">Final Destination</text>
                <circle cx="160" cy="25" r="5" fill="#10b981" />
              </g>

              {/* Dynamic Obstacle Simulation Indicator in Corridor */}
              {showObstacleAlert && (
                <g transform="translate(280, 160)">
                  <circle cx="0" cy="0" r="14" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
                  <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="800" fill="#dc2626">!</text>
                  <text x="0" y="-18" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#b91c1c">Gurney Detour (Costmap)</text>
                </g>
              )}

              {/* Live Animated Robot 1 Marker */}
              <g
                transform={`translate(${currentWaypoint.x}, ${currentWaypoint.y})`}
                style={{ transition: 'transform 1.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                {/* Sonar Sensor Radar Ring */}
                <circle cx="0" cy="0" r="28" fill="#0284c7" fillOpacity="0.15" className="animate-beacon" />
                <circle cx="0" cy="0" r="16" fill="#0284c7" fillOpacity="0.3" />
                <circle cx="0" cy="0" r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="3" />

                {/* Heading Arrow Indicator */}
                <path d="M 0 -10 L 4 -2 L -4 -2 Z" fill="#ffffff" />

                {/* Robot Label Tag */}
                <rect x="-42" y="16" width="84" height="22" rx="4" fill="#0f172a" opacity="0.9" />
                <text x="0" y="31" textAnchor="middle" fontSize="10" fontWeight="700" fill="#ffffff">
                  RB-001 (0.8m/s)
                </text>
              </g>

              {/* Robot 2 Docked Marker */}
              <g transform="translate(90, 415)">
                <circle cx="0" cy="0" r="9" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                <rect x="-35" y="14" width="70" height="20" rx="4" fill="#065f46" />
                <text x="0" y="28" textAnchor="middle" fontSize="9" fontWeight="700" fill="#ffffff">
                  RB-002 (34%)
                </text>
              </g>
            </svg>

            {/* Bottom Status bar for the floor */}
            <div className="map-toolbar-footer">
              <div className="route-legend-group">
                <div className="leg-item"><span className="leg-dot bg-blue" /> Robot 01 (ICU Mission)</div>
                <div className="leg-item"><span className="leg-dot bg-green" /> Robot 02 (Docked Bay 2)</div>
                <div className="leg-item"><span className="leg-dot bg-red" /> Obstacle Detour</div>
              </div>

              <div className="map-controls-group">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowObstacleAlert(!showObstacleAlert)}
                >
                  {showObstacleAlert ? 'Hide Obstacle Overlay' : 'Show Obstacle Overlay'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Panel: Live Telemetry & Mission Control Panel */}
        <div className="tracking-side-panel">
          {/* Mission Control Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Bot size={17} className="text-hospital-blue" />
                <span>Mission Control: {activeRobot.id}</span>
              </div>
              <span className="badge badge-safe">
                <span className="badge-dot" /> {activeRobot.status}
              </span>
            </div>

            <div className="card-body">
              <div className="telemetry-compact-list">
                <div className="telem-row">
                  <span className="t-label">Assigned Route:</span>
                  <span className="t-val font-mono">{activeRobot.activeRoute.join(' → ')}</span>
                </div>

                <div className="telem-row">
                  <span className="t-label">Current Waypoint:</span>
                  <span className="t-val font-bold text-hospital-blue">{currentWaypoint.name}</span>
                </div>

                <div className="telem-row">
                  <span className="t-label">Next Destination:</span>
                  <span className="t-val">{activeRobot.destination}</span>
                </div>

                <div className="telem-row">
                  <span className="t-label">Speed & Kinematics:</span>
                  <span className="t-val font-mono">{activeRobot.speed} m/s (Target 1.0 m/s)</span>
                </div>

                <div className="telem-row">
                  <span className="t-label">Estimated Arrival (ETA):</span>
                  <span className="t-val font-mono font-bold text-safe">~1.8 min</span>
                </div>

                <div className="telem-row">
                  <span className="t-label">Battery Level:</span>
                  <div className="t-val flex-center-gap">
                    <BatteryMedium size={15} className="text-safe" />
                    <span>{activeRobot.battery}%</span>
                  </div>
                </div>

                <div className="telem-row">
                  <span className="t-label">Payload Load:</span>
                  <span className="t-val font-mono">{activeRobot.loadPercentage}% ({activeRobot.totalWeightKg} kg)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mission-actions-stack mt-4">
                <div className="action-buttons-row">
                  <button
                    className="btn btn-secondary btn-sm flex-1"
                    onClick={() => setSimulationRunning(!simulationRunning)}
                  >
                    {simulationRunning ? <Pause size={13} /> : <Play size={13} />}
                    {simulationRunning ? 'Pause Route' : 'Resume'}
                  </button>

                  <button
                    className="btn btn-secondary btn-sm flex-1"
                    onClick={() => sendRobotToBase(activeRobot.id)}
                  >
                    <RotateCcw size={13} /> Return to Dock
                  </button>
                </div>

                {activeRobot.sensors.emergencyStop.includes('HALT') || globalEmergencyStop ? (
                  <button
                    className="btn btn-success btn-sm w-full mt-2"
                    onClick={() => resumeRobot(activeRobot.id)}
                  >
                    <Play size={13} /> Clear E-Stop & Resume Patrol
                  </button>
                ) : (
                  <button
                    className="btn btn-danger btn-sm w-full mt-2"
                    onClick={() => emergencyStopRobot(activeRobot.id)}
                  >
                    <OctagonAlert size={14} /> EMERGENCY STOP (HALT MOTORS)
                  </button>
                )}
              </div>

              {/* Quick Dispatch Assignment */}
              <div className="quick-dispatch-box mt-4">
                <span className="dispatch-title">Quick Dispatch Waypoint</span>
                <div className="dispatch-btns-grid">
                  <button
                    className="btn-dispatch"
                    onClick={() => dispatchRobot(activeRobot.id, 'ICU Isolation Suite')}
                  >
                    ICU
                  </button>
                  <button
                    className="btn-dispatch"
                    onClick={() => dispatchRobot(activeRobot.id, 'Emergency Trauma')}
                  >
                    Emergency
                  </button>
                  <button
                    className="btn-dispatch"
                    onClick={() => dispatchRobot(activeRobot.id, 'Central Pharmacy')}
                  >
                    Pharmacy
                  </button>
                  <button
                    className="btn-dispatch"
                    onClick={() => dispatchRobot(activeRobot.id, 'Secure Storage B1')}
                  >
                    Storage B1
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Status & Sensor Check */}
          <div className="card mt-3">
            <div className="card-header">
              <div className="card-title">
                <ShieldCheck size={16} className="text-safe" />
                <span>Sensory Safety Status</span>
              </div>
            </div>
            <div className="card-body">
              <div className="safety-checks-grid">
                <div className="safety-check-item">
                  <span className="badge-dot bg-safe" />
                  <span>Obstacle Avoidance: Active</span>
                </div>
                <div className="safety-check-item">
                  <span className="badge-dot bg-safe" />
                  <span>LiDAR SLAM: 30m range</span>
                </div>
                <div className="safety-check-item">
                  <span className="badge-dot bg-safe" />
                  <span>Hatch Locks: Sealed</span>
                </div>
                <div className="safety-check-item">
                  <span className="badge-dot bg-safe" />
                  <span>Spill Catch Basin: Dry</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

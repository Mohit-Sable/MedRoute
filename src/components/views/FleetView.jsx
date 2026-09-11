import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  BatteryCharging,
  BatteryMedium,
  Wifi,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  Play,
  RotateCcw,
  OctagonAlert,
  ChevronRight,
  Cpu,
  Layers,
  CheckCircle,
  ExternalLink,
  Lock,
  Compass
} from 'lucide-react';

export const FleetView = () => {
  const {
    robots,
    selectedRobotId,
    setSelectedRobotId,
    setActiveView,
    emergencyStopRobot,
    resumeRobot,
    sendRobotToBase,
    globalEmergencyStop
  } = useApp();

  const [activeTab, setActiveTab] = useState('telemetry'); // 'telemetry' | 'sensors' | 'compartments' | 'logs'
  const activeRobot = robots.find(r => r.id === (selectedRobotId || 'RB-001')) || robots[0];

  if (!activeRobot || robots.length === 0) {
    return (
      <div className="fleet-view-container">
        <div className="card p-6 text-center">
          <Bot size={48} className="text-muted mb-3 mx-auto" />
          <h3>No Autonomous Mobile Robots Registered</h3>
          <p className="text-muted mb-4">No rovers are currently detected or connected to the fleet management hub.</p>
          <button className="btn btn-primary btn-sm mx-auto" onClick={() => setActiveView('dashboard')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fleet-view-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Autonomous Mobile Robot (AMR) Fleet</h1>
          <p>Supervise battery health, real-time kinematics, sensory perception & payload capacity</p>
        </div>

        <div className="page-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveView('tracking')}>
            <Compass size={14} /> Open Live Map
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => emergencyStopRobot(null)}
          >
            <OctagonAlert size={14} /> Emergency Stop All AMRs
          </button>
        </div>
      </div>

      {/* Fleet Overview Cards Grid */}
      <div className="fleet-cards-grid">
        {robots.map(robot => {
          const isSelected = robot.id === activeRobot.id;
          const isCharging = robot.status === 'Charging';
          return (
            <div
              key={robot.id}
              className={`robot-fleet-card card ${isSelected ? 'fleet-card-selected' : ''}`}
              onClick={() => setSelectedRobotId(robot.id)}
            >
              <div className="fleet-card-top">
                <div className="fleet-card-id-wrap">
                  <div className="amr-icon-box">
                    <Bot size={22} className="text-hospital-blue" />
                  </div>
                  <div>
                    <div className="fleet-amr-id">{robot.id}</div>
                    <div className="fleet-amr-name">{robot.name}</div>
                  </div>
                </div>

                <div className="fleet-card-status">
                  <span className={`badge ${robot.status === 'Collecting' ? 'badge-safe' : isCharging ? 'badge-info' : 'badge-warning'}`}>
                    <span className="badge-dot" /> {robot.status}
                  </span>
                </div>
              </div>

              <div className="fleet-card-metrics">
                <div className="fleet-metric-col">
                  <span className="fleet-m-label">Battery Level</span>
                  <div className="fleet-m-val flex-center-gap">
                    {isCharging ? <BatteryCharging size={16} className="text-info" /> : <BatteryMedium size={16} className={robot.battery < 40 ? 'text-amber' : 'text-safe'} />}
                    <span>{robot.battery}%</span>
                  </div>
                  <div className="battery-progress-bar">
                    <div
                      className={`battery-fill ${robot.battery < 40 ? 'bg-warning' : 'bg-safe'}`}
                      style={{ width: `${robot.battery}%` }}
                    />
                  </div>
                </div>

                <div className="fleet-metric-col">
                  <span className="fleet-m-label">Floor & Zone</span>
                  <div className="fleet-m-val font-mono">
                    FL {robot.floor} • {robot.location}
                  </div>
                  <span className="fleet-m-sub">Dest: {robot.destination || 'Standby'}</span>
                </div>

                <div className="fleet-metric-col">
                  <span className="fleet-m-label">Payload Capacity</span>
                  <div className="fleet-m-val font-mono">
                    {robot.loadPercentage}% ({robot.totalWeightKg} / {robot.maxWeightKg} kg)
                  </div>
                  <div className="battery-progress-bar">
                    <div
                      className="battery-fill bg-info"
                      style={{ width: `${robot.loadPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="fleet-metric-col">
                  <span className="fleet-m-label">Task Assignment</span>
                  <div className="fleet-m-val">
                    {robot.currentTask ? (
                      <span className="badge badge-info">{robot.currentTask}</span>
                    ) : (
                      <span className="text-muted">No Active Task</span>
                    )}
                  </div>
                  <span className="fleet-m-sub">Speed: {robot.speed} m/s</span>
                </div>
              </div>

              <div className="fleet-card-footer">
                <div className="fleet-connection-info">
                  <Wifi size={13} className="text-safe" />
                  <span>{robot.connectionStatus}</span>
                </div>
                <div className="fleet-maintenance-info">
                  <Wrench size={13} className="text-muted" />
                  <span>Last Maint: {robot.lastMaintenance}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Robot Detailed Inspector Drawer / Section */}
      <div className="card robot-detail-panel mt-4">
        <div className="card-header">
          <div className="card-title">
            <Bot size={18} className="text-hospital-blue" />
            <span>Inspector: {activeRobot.name} ({activeRobot.id})</span>
            <span className="badge badge-info font-mono">{activeRobot.model}</span>
          </div>

          <div className="detail-panel-actions">
            {activeRobot.status !== 'Charging' && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => sendRobotToBase(activeRobot.id)}
              >
                <RotateCcw size={13} /> Send to Dock
              </button>
            )}

            {activeRobot.sensors.emergencyStop.includes('HALT') || globalEmergencyStop ? (
              <button
                className="btn btn-success btn-sm"
                onClick={() => resumeRobot(activeRobot.id)}
              >
                <Play size={13} /> Clear E-Stop & Resume
              </button>
            ) : (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => emergencyStopRobot(activeRobot.id)}
              >
                <OctagonAlert size={13} /> Emergency Stop
              </button>
            )}
          </div>
        </div>

        {/* Inspector Sub-Tabs */}
        <div className="inspector-tabs-nav">
          <button
            className={`inspector-tab-btn ${activeTab === 'telemetry' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('telemetry')}
          >
            Kinematics & Telemetry
          </button>
          <button
            className={`inspector-tab-btn ${activeTab === 'sensors' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('sensors')}
          >
            Sensors & Perception Health
          </button>
          <button
            className={`inspector-tab-btn ${activeTab === 'compartments' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('compartments')}
          >
            Internal Waste Compartments
          </button>
          <button
            className={`inspector-tab-btn ${activeTab === 'logs' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            Mission & Maintenance History
          </button>
        </div>

        <div className="card-body">
          {activeTab === 'telemetry' && (
            <div className="inspector-telemetry-grid">
              <div className="telem-stat-box">
                <span className="stat-label">Navigation Status</span>
                <span className="stat-value">{activeRobot.status}</span>
                <span className="stat-hint">Floor {activeRobot.floor} • Waypoint {activeRobot.location}</span>
              </div>
              <div className="telem-stat-box">
                <span className="stat-label">Current Velocity</span>
                <span className="stat-value font-mono">{activeRobot.speed} m/s</span>
                <span className="stat-hint">Max speed capped at 1.2 m/s for hospital pedestrian safety</span>
              </div>
              <div className="telem-stat-box">
                <span className="stat-label">Battery Level (State of Charge)</span>
                <span className="stat-value font-mono">{activeRobot.battery}%</span>
                <span className="stat-hint">Battery SOH: 98% (LiFePO4 48V 35Ah)</span>
              </div>
              <div className="telem-stat-box">
                <span className="stat-label">Payload Weight</span>
                <span className="stat-value font-mono">{activeRobot.totalWeightKg} kg</span>
                <span className="stat-hint">Load factor: {activeRobot.loadPercentage}% of 40kg max</span>
              </div>
              <div className="telem-stat-box">
                <span className="stat-label">Wi-Fi & Telemetry Link</span>
                <span className="stat-value font-mono">{activeRobot.signalStrength}% RSSI</span>
                <span className="stat-hint">Hospital 5G / Wi-Fi 6 Low-Latency roaming</span>
              </div>
              <div className="telem-stat-box">
                <span className="stat-label">Active Route Coordinates</span>
                <span className="stat-value font-mono">{activeRobot.activeRoute.join(' → ')}</span>
                <span className="stat-hint">Dynamic costmap obstacle avoidance active</span>
              </div>
            </div>
          )}

          {activeTab === 'sensors' && (
            <div className="inspector-sensors-list">
              <div className="sensor-row">
                <div className="sensor-name-wrap">
                  <ShieldCheck size={16} className="text-safe" />
                  <div>
                    <strong>360° LiDAR Scanner</strong>
                    <div className="sensor-desc">Slamtec RPLiDAR S2 (30m range, 10Hz obstacle map)</div>
                  </div>
                </div>
                <span className="badge badge-safe">Online • {activeRobot.sensors.lidar}</span>
              </div>

              <div className="sensor-row">
                <div className="sensor-name-wrap">
                  <ShieldCheck size={16} className="text-safe" />
                  <div>
                    <strong>3D Depth Perception Cameras</strong>
                    <div className="sensor-desc">Dual Intel RealSense D435i forward & rear obstacle avoidance</div>
                  </div>
                </div>
                <span className="badge badge-safe">Active • {activeRobot.sensors.depthCameras}</span>
              </div>

              <div className="sensor-row">
                <div className="sensor-name-wrap">
                  <ShieldCheck size={16} className="text-safe" />
                  <div>
                    <strong>Ultrasonic Proximity Array</strong>
                    <div className="sensor-desc">8-sensor ring for low-reflectivity transparent IV drip detection</div>
                  </div>
                </div>
                <span className="badge badge-safe">Normal • {activeRobot.sensors.ultrasonic}</span>
              </div>

              <div className="sensor-row">
                <div className="sensor-name-wrap">
                  <Lock size={16} className="text-hospital-blue" />
                  <div>
                    <strong>Compartment Electronic Interlocks</strong>
                    <div className="sensor-desc">Automated solenoid locks with UV-C biological isolation seal</div>
                  </div>
                </div>
                <span className="badge badge-safe">{activeRobot.sensors.compartmentLocks}</span>
              </div>

              <div className="sensor-row">
                <div className="sensor-name-wrap">
                  <ShieldCheck size={16} className="text-safe" />
                  <div>
                    <strong>Bio-Fluid Spill & Leak Sensors</strong>
                    <div className="sensor-desc">Capacitive catch-basin probes detect accidental container rupture</div>
                  </div>
                </div>
                <span className="badge badge-safe">{activeRobot.sensors.spillDetection}</span>
              </div>

              <div className="sensor-row">
                <div className="sensor-name-wrap">
                  <Cpu size={16} className="text-ai" />
                  <div>
                    <strong>Edge AI Neural Processing Unit</strong>
                    <div className="sensor-desc">NVIDIA Jetson Orin Nano (40 TOPS) running YOLO-Waste v8</div>
                  </div>
                </div>
                <span className="badge badge-ai">{activeRobot.sensors.edgeAI}</span>
              </div>

              <div className="sensor-row">
                <div className="sensor-name-wrap">
                  <OctagonAlert size={16} className={activeRobot.sensors.emergencyStop.includes('HALT') ? 'text-critical' : 'text-safe'} />
                  <div>
                    <strong>Hardware Emergency Stop (E-Stop)</strong>
                    <div className="sensor-desc">Physical mushroom push-button + remote wireless safety relay</div>
                  </div>
                </div>
                <span className={`badge ${activeRobot.sensors.emergencyStop.includes('HALT') ? 'badge-critical' : 'badge-safe'}`}>
                  {activeRobot.sensors.emergencyStop}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'compartments' && (
            <div className="inspector-compartments-grid">
              {Object.entries(activeRobot.compartments).map(([key, comp]) => {
                const isWarning = comp.status === 'Warning' || comp.fill >= 80;
                return (
                  <div key={key} className="comp-inspector-card card">
                    <div className="comp-card-top">
                      <span className="comp-name uppercase">{key} Compartment</span>
                      <span className={`badge ${isWarning ? 'badge-warning' : 'badge-safe'}`}>
                        {comp.status}
                      </span>
                    </div>
                    <div className="comp-card-stat">
                      <span className="comp-fill-val">{comp.fill}%</span>
                      <span className="comp-weight-val">({comp.weightKg} / {comp.maxKg} kg)</span>
                    </div>
                    <div className="battery-progress-bar">
                      <div
                        className={`battery-fill ${isWarning ? 'bg-warning' : 'bg-safe'}`}
                        style={{ width: `${comp.fill}%` }}
                      />
                    </div>
                    <div className="comp-hatch-status">
                      <Lock size={12} /> Hatch Solenoid Sealed
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="inspector-history-list">
              <div className="history-item">
                <div className="history-time">10:27 AM</div>
                <div className="history-text">Collected 1.2 kg Sharps waste from ICU Bed 12 isolation dock.</div>
              </div>
              <div className="history-item">
                <div className="history-time">09:15 AM</div>
                <div className="history-text">Transferred 3.4 kg Recyclable plastics to Basement 1 vault.</div>
              </div>
              <div className="history-item">
                <div className="history-time">08:42 AM</div>
                <div className="history-text">Cleared collection task TSK-1017 for ICU sharps container.</div>
              </div>
              <div className="history-item">
                <div className="history-time">06:00 AM</div>
                <div className="history-text">Daily boot sequence completed: LiDAR, ToF cameras, battery SOH verified.</div>
              </div>
              <div className="history-item">
                <div className="history-time">2026-09-02</div>
                <div className="history-text">Scheduled 60-day preventive maintenance: drive wheel tire inspection and UV seal sterilization.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  Cpu,
  Eye,
  Zap,
  Radio,
  Layers,
  ShieldCheck,
  RotateCw,
  QrCode,
  HardDrive,
  Wifi,
  Cloud,
  Lock,
  Compass,
  Sparkles
} from 'lucide-react';

export const SystemArchitectureView = () => {
  const hardwareModules = [
    {
      title: 'Perception & Vision System',
      icon: Eye,
      color: '#6366f1',
      items: [
        'Dual Intel RealSense D435i depth cameras (front & rear)',
        '360° Slamtec RPLiDAR S2 (30m laser range, 10Hz scan)',
        '8-element ultrasonic proximity ring for transparent glass/plastics'
      ]
    },
    {
      title: 'Edge AI Neural Processor',
      icon: Cpu,
      color: '#0284c7',
      items: [
        'NVIDIA Jetson Orin Nano (40 TOPS AI compute)',
        'Real-time TensorRT YOLOv8 inference (18.4ms latency)',
        'Local neural inference with zero cloud-latency dependence'
      ]
    },
    {
      title: 'Drive Kinematics & Power',
      icon: Zap,
      color: '#eab308',
      items: [
        'Dual 250W Brushless DC (BLDC) planetary hub motors',
        'Optical quadrature wheel encoders (1024 CPR for odometry)',
        '48V 35Ah LiFePO4 battery pack with autonomous magnetic docking'
      ]
    },
    {
      title: 'Hermetic Waste Compartments',
      icon: Lock,
      color: '#dc2626',
      items: [
        '5 sealed compartments (Sharps, Infectious, Pharma, Plastic, General)',
        'Motorized chute diverter servo mechanism',
        'Integrated UV-C sterilization LEDs & spill catch basin sensors'
      ]
    },
    {
      title: 'Weight & RFID Verification',
      icon: QrCode,
      color: '#0d9488',
      items: [
        'Four-point strain gauge load cells (±10g precision)',
        'HF 13.56 MHz RFID reader for nurse & bin tag authentication',
        'Automated 2D DataMatrix / QR scanner for medication vials'
      ]
    },
    {
      title: 'Hospital IoT & Telemetry Link',
      icon: Wifi,
      color: '#8b5cf6',
      items: [
        'Wi-Fi 6 (802.11ax) dual-band with 802.11r seamless roaming',
        'MQTT telemetry streaming over hospital TLS 1.3 network',
        'Elevator IoT API integration for autonomous multi-floor transit'
      ]
    }
  ];

  return (
    <div className="arch-view-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>AMR Hardware & System Architecture</h1>
          <p>Technical integration blueprint: physical robotics, edge intelligence, and hospital command layer</p>
        </div>
      </div>

      {/* Layer Hierarchy Schematic */}
      <div className="card mb-4">
        <div className="card-header">
          <div className="card-title">
            <Layers size={17} className="text-hospital-blue" />
            <span>End-to-End System Hierarchy</span>
          </div>
          <span className="badge badge-info">Hardware-to-Cloud Topology</span>
        </div>

        <div className="card-body">
          <div className="system-stack-diagram">
            <div className="stack-level level-4">
              <div className="stack-level-num">LEVEL 4</div>
              <div className="stack-level-info">
                <strong>Hospital Command & Traceability Cloud (MedRoute AI Web Application)</strong>
                <p>Digital Waste Passport registry, fleet dispatch, audit manifests, hospital ERP/EHR integration.</p>
              </div>
            </div>

            <div className="stack-connector">↕ Hospital Wi-Fi 6 / 5G Dedicated Medical Slice (MQTT over TLS)</div>

            <div className="stack-level level-3">
              <div className="stack-level-num">LEVEL 3</div>
              <div className="stack-level-info">
                <strong>Autonomous Navigation & Mission Executive (ROS 2 Humble / Nav2)</strong>
                <p>Global costmaps, dynamic obstacle replanning, multi-floor elevator dispatch, recovery behaviors.</p>
              </div>
            </div>

            <div className="stack-connector">↕ High-Speed Internal IPC & CAN-Bus (1 Mbps)</div>

            <div className="stack-level level-2">
              <div className="stack-level-num">LEVEL 2</div>
              <div className="stack-level-info">
                <strong>Edge AI Perception & Physical Waste Segregation (NVIDIA Jetson Orin)</strong>
                <p>YOLOv8 deep learning vision, motorized diverter chute control, interlock solenoid locks, load cells.</p>
              </div>
            </div>

            <div className="stack-connector">↕ Safety Hardware Interlocks & Power Distribution</div>

            <div className="stack-level level-1">
              <div className="stack-level-num">LEVEL 1</div>
              <div className="stack-level-info">
                <strong>Physical Mobile Robot Hardware (Battery-Electric AMR Chassis)</strong>
                <p>LiDAR, depth cameras, BLDC hub drives, LiFePO4 battery, mechanical E-stop, 5 biohazard compartments.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Subsystem Modules Grid */}
      <div className="section-block">
        <div className="section-title-wrap">
          <h2 className="section-title">Physical Robot Subsystems Detail</h2>
          <p className="section-subtitle">Components engineered for clinical hospital environments and cleanroom standards</p>
        </div>

        <div className="hardware-modules-grid">
          {hardwareModules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <div key={i} className="card hw-module-card">
                <div className="hw-card-top">
                  <div className="hw-icon-box" style={{ background: `${mod.color}15`, color: mod.color }}>
                    <Icon size={20} />
                  </div>
                  <h3 className="hw-module-title">{mod.title}</h3>
                </div>

                <ul className="hw-items-list">
                  {mod.items.map((item, idx) => (
                    <li key={idx}>
                      <span className="hw-bullet-dot" style={{ background: mod.color }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

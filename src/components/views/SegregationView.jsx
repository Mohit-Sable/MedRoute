import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GitMerge,
  ScanLine,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Thermometer,
  Weight,
  Clock,
  ArrowDown,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Syringe,
  Biohazard,
  Pill,
  Recycle,
  Trash2
} from 'lucide-react';

export const SegregationView = () => {
  const {
    compartments,
    highlightedCompartment,
    setHighlightedCompartment,
    scannedResult,
    setActiveView
  } = useApp();

  const [activeStep, setActiveStep] = useState(4); // 0 to 4 in pipeline

  const pipelineStages = [
    { id: 'input', label: 'Waste Input', desc: 'Waste placed on intake tray or presented to camera', icon: Layers },
    { id: 'ai', label: 'AI Identification', desc: 'Computer vision runs neural classification (18ms)', icon: ScanLine },
    { id: 'decision', label: 'Category Decision', desc: 'Rules engine determines hazard tier & bio-stream', icon: Sparkles },
    { id: 'diverter', label: 'Sorting Diverter', desc: 'Motorized servo diverter aligns intake chute', icon: GitMerge },
    { id: 'compartment', label: 'Hermetic Compartment', desc: 'Pneumatic door seals and UV-C sterilization triggers', icon: Lock }
  ];

  const getCompartmentIcon = (code) => {
    switch (code) {
      case 'SHARPS': return Syringe;
      case 'INFECTIOUS': return Biohazard;
      case 'PHARMACEUTICAL': return Pill;
      case 'PLASTIC': return Recycle;
      case 'GENERAL': default: return Trash2;
    }
  };

  return (
    <div className="segregation-view-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Automated Waste Segregation System</h1>
          <p>Zero-cross-contamination motorized sorting diverters & sealed hazardous containment</p>
        </div>

        <div className="page-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveView('scanner')}>
            <ScanLine size={14} /> Scan New Waste Item
          </button>
        </div>
      </div>

      {/* 5-Step Sorting Diverter Pipeline Visualization */}
      <div className="card pipeline-card">
        <div className="card-header">
          <div className="card-title">
            <GitMerge size={17} className="text-hospital-blue" />
            <span>Automated Physical Sorting Pipeline (Intake → Chute Diverter)</span>
          </div>
          <span className="badge badge-safe">
            <span className="badge-dot" /> Interlocks Armed
          </span>
        </div>

        <div className="card-body">
          <div className="pipeline-steps-flow">
            {pipelineStages.map((stg, i) => {
              const Icon = stg.icon;
              const isCurrent = activeStep === i;
              return (
                <div
                  key={stg.id}
                  className={`pipeline-step-item ${isCurrent ? 'pipeline-step-current' : ''}`}
                  onClick={() => setActiveStep(i)}
                >
                  <div className="step-badge-number">{i + 1}</div>
                  <div className="step-icon-circle">
                    <Icon size={20} />
                  </div>
                  <div className="step-title">{stg.label}</div>
                  <div className="step-desc">{stg.desc}</div>
                  {i < pipelineStages.length - 1 && (
                    <div className="pipeline-connector-line">
                      <ArrowRight size={14} className="connector-arrow" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {highlightedCompartment && (
            <div className="pipeline-highlight-alert">
              <Sparkles size={16} className="text-ai" />
              <span>
                Active Scanner Target: <strong>{highlightedCompartment}</strong> compartment motorized diverter aligned.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 5 Dedicated Compartment Cards */}
      <div className="section-block mt-4">
        <div className="section-title-wrap">
          <h2 className="section-title">AMR Multi-Compartment Storage Monitoring</h2>
          <p className="section-subtitle">Real-time fill sensors, capacitive load cells & biological containment statuses</p>
        </div>

        <div className="compartments-cards-grid">
          {compartments.map(comp => {
            const Icon = getCompartmentIcon(comp.id);
            const isHighlighted = highlightedCompartment === comp.id;
            const isWarning = comp.status === 'Warning' || comp.fillPercentage >= 80;

            return (
              <div
                key={comp.id}
                className={`comp-monitor-card card ${isHighlighted ? 'comp-card-highlighted' : ''}`}
                style={{
                  borderTop: `4px solid ${comp.colorHex}`
                }}
                onClick={() => setHighlightedCompartment(comp.id)}
              >
                <div className="comp-card-header-row">
                  <div className="comp-icon-title-wrap">
                    <div className="comp-icon-box" style={{ background: `${comp.colorHex}15`, color: comp.colorHex }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="comp-name-title">{comp.name}</h3>
                      <span className="comp-short-badge" style={{ color: comp.colorHex }}>
                        {comp.shortCode}
                      </span>
                    </div>
                  </div>

                  <span className={`badge ${isWarning ? 'badge-warning' : 'badge-safe'}`}>
                    <span className="badge-dot" /> {comp.status}
                  </span>
                </div>

                {/* Fill Percentage & Weight Gauge */}
                <div className="comp-gauge-section">
                  <div className="gauge-values-row">
                    <div className="fill-metric">
                      <span className="metric-number font-mono">{comp.fillPercentage}%</span>
                      <span className="metric-label">Capacity Fill</span>
                    </div>
                    <div className="weight-metric text-right">
                      <span className="metric-number font-mono">{comp.currentWeightKg} kg</span>
                      <span className="metric-label">of {comp.capacityKg} kg Max</span>
                    </div>
                  </div>

                  <div className="compartment-fill-track">
                    <div
                      className="compartment-fill-bar"
                      style={{
                        width: `${comp.fillPercentage}%`,
                        backgroundColor: comp.colorHex
                      }}
                    />
                  </div>
                </div>

                {/* Sensor & Telemetry Metrics */}
                <div className="comp-sensors-meta">
                  <div className="comp-meta-row">
                    <span className="meta-lbl">
                      <Clock size={12} /> Last Collection:
                    </span>
                    <span className="meta-val font-mono">{comp.lastCollectionTime}</span>
                  </div>

                  <div className="comp-meta-row">
                    <span className="meta-lbl">
                      <Thermometer size={12} /> Chamber Temp:
                    </span>
                    <span className="meta-val font-mono">{comp.sensorTemp}</span>
                  </div>

                  <div className="comp-meta-row">
                    <span className="meta-lbl">
                      <Lock size={12} /> Interlock:
                    </span>
                    <span className="meta-val text-safe">{comp.lockState}</span>
                  </div>

                  <div className="comp-meta-row">
                    <span className="meta-lbl">
                      <ShieldCheck size={12} /> Destruction:
                    </span>
                    <span className="meta-val text-destruct">{comp.targetDisposal}</span>
                  </div>
                </div>

                {/* Quick Simulation Trigger Button */}
                <div className="comp-card-actions mt-3">
                  <button
                    className="btn btn-secondary btn-sm w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHighlightedCompartment(comp.id);
                    }}
                  >
                    {isHighlighted ? 'Diverter Activated' : 'Simulate Routing to Bin'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

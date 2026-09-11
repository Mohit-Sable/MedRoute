import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ScanLine,
  GitMerge,
  Bot,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Lock,
  Layers,
  Activity,
  Award
} from 'lucide-react';

export const LandingView = () => {
  const { setActiveView, triggerScan } = useApp();

  const workflowSteps = [
    {
      num: '01',
      title: 'IDENTIFY',
      icon: ScanLine,
      color: '#6366f1',
      desc: 'Edge computer vision neural network scans item, estimates weight, and flags biohazard risk within 20 milliseconds.'
    },
    {
      num: '02',
      title: 'SEGREGATE',
      icon: GitMerge,
      color: '#0d9488',
      desc: 'Automated motorized diverters route waste into the correct sealed compartment (Sharps, Infectious, Pharma, Plastic, General).'
    },
    {
      num: '03',
      title: 'COLLECT',
      icon: Bot,
      color: '#0284c7',
      desc: 'Autonomous Mobile Robot (AMR) navigates hospital corridors, manages elevator transits, and clears collection tasks.'
    },
    {
      num: '04',
      title: 'TRACK',
      icon: QrCode,
      color: '#d97706',
      desc: 'Unique Digital Waste Passport generated with cryptographic custody hash, QR code, timestamps, and geolocation.'
    },
    {
      num: '05',
      title: 'TRANSFER',
      icon: Lock,
      color: '#10b981',
      desc: 'Secure handoff at basement bio-waste depository vault for licensed certified destruction or eco-recycling.'
    }
  ];

  const innovationPillars = [
    {
      icon: ShieldCheck,
      title: 'Zero-Touch Infection Defense',
      desc: 'Eliminates healthcare worker exposure to dangerous needle-stick injuries and aerosolized pathogens during routine ward waste handling.'
    },
    {
      icon: Layers,
      title: '96.2% AI Segregation Accuracy',
      desc: 'Prevents expensive regulatory penalties and dangerous contamination by ensuring cytotoxic and sharps waste never enter municipal streams.'
    },
    {
      icon: Activity,
      title: 'End-to-End Audit Compliance',
      desc: 'Hospital infection control officers gain full digital chain-of-custody manifests from patient bedside to incinerator chamber.'
    },
    {
      icon: Award,
      title: 'Autonomous Mobile Robotics (AMR)',
      desc: 'Heavy-payload 40kg battery-electric rover with 360° LiDAR, ultrasonic proximity arrays, and hospital Wi-Fi 6 roaming.'
    }
  ];

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <div className="landing-hero-card">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} className="text-ai" />
            <span>Autonomous AMR Hospital Operations Platform</span>
          </div>
          <h1 className="hero-title">
            MedRoute <span className="text-gradient-blue">AI</span>
          </h1>
          <p className="hero-tagline">
            Autonomous Biomedical Waste Collection & Traceability
          </p>
          <p className="hero-description">
            AI-assisted identification, automated segregation, autonomous mobile robot collection, and end-to-end digital tracking for safer hospital waste management.
          </p>

          <div className="hero-cta-group">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setActiveView('dashboard')}
            >
              Enter Hospital Command Center <ArrowRight size={18} />
            </button>

            <button
              className="btn btn-secondary btn-lg"
              onClick={() => {
                setActiveView('scanner');
                triggerScan();
              }}
            >
              <ScanLine size={17} className="text-ai" /> Test AI Waste Scanner
            </button>
          </div>

          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <span className="hero-stat-value">96.2%</span>
              <span className="hero-stat-label">Segregation Accuracy</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-item">
              <span className="hero-stat-value">8.4 min</span>
              <span className="hero-stat-label">Avg. Collection Time</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-item">
              <span className="hero-stat-value">100%</span>
              <span className="hero-stat-label">Digital Traceability</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-item">
              <span className="hero-stat-value">0 Incidents</span>
              <span className="hero-stat-label">Needle-Stick Injuries</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Step Workflow Section */}
      <div className="section-block">
        <div className="section-header-center">
          <h2 className="section-title">The Complete Autonomous Waste Lifecycle</h2>
          <p className="section-subtitle">
            From generation in ICU bedside wards to certified destruction in secure basement vaults.
          </p>
        </div>

        <div className="workflow-grid">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="workflow-card">
                <div className="workflow-step-num" style={{ color: step.color }}>
                  {step.num}
                </div>
                <div className="workflow-icon-box" style={{ background: `${step.color}15`, color: step.color }}>
                  <Icon size={22} />
                </div>
                <h3 className="workflow-step-title">{step.title}</h3>
                <p className="workflow-step-desc">{step.desc}</p>
                {idx < workflowSteps.length - 1 && (
                  <div className="workflow-arrow-connector">→</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Four Innovation Pillars */}
      <div className="section-block">
        <div className="section-header-center">
          <h2 className="section-title">Why MedRoute AI Solves Critical Hospital Challenges</h2>
          <p className="section-subtitle">
            Addressing regulatory scrutiny, biological safety hazards, and manual porter inefficiencies.
          </p>
        </div>

        <div className="pillars-grid">
          {innovationPillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div key={i} className="pillar-card card">
                <div className="pillar-icon-box">
                  <Icon size={20} className="text-hospital-blue" />
                </div>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-desc">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Interactive Jump Links */}
      <div className="demo-launcher-banner card">
        <div className="launcher-left">
          <h3>Explore Platform Modules Directly</h3>
          <p>Jump to any simulated subsystem to inspect live operational data and automated workflows.</p>
        </div>
        <div className="launcher-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveView('tracking')}>
            <MapPin size={14} /> Live Floor Map
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveView('fleet')}>
            <Bot size={14} /> Robot Fleet Telemetry
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveView('segregation')}>
            <GitMerge size={14} /> 5-Compartment Diverter
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveView('passport')}>
            <QrCode size={14} /> Digital Waste Passport
          </button>
        </div>
      </div>

      {/* Transparency Note */}
      <div className="disclaimer-banner mt-4">
        <CheckCircle2 size={16} className="text-hospital-blue" />
        <span>
          <strong>Prototype Concept Notice:</strong> MedRoute AI is a demonstrative healthcare operations prototype built to model autonomous robotic waste collection, computer vision inference, and digital chain-of-custody. Real-world deployment integrates with certified medical waste disposal protocols and hospital AMR safety standards.
        </span>
      </div>
    </div>
  );
};

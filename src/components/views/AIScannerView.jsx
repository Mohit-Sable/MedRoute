import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AI_DEMO_SAMPLES } from '../../data/mockData';
import {
  ScanLine,
  Upload,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Box,
  Layers,
  Cpu,
  Info,
  GitMerge,
  QrCode
} from 'lucide-react';

export const AIScannerView = () => {
  const {
    selectedScanSample,
    setSelectedScanSample,
    scannedResult,
    isScanning,
    triggerScan,
    routeScannedWaste,
    setActiveView,
    openPassport
  } = useApp();

  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [routedSuccessRecord, setRoutedSuccessRecord] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleCustomUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Phase 7: Edge case validation (size & MIME type)
    if (!file.type.startsWith('image/')) {
      setUploadError('Invalid file type. Please upload a standard image file (JPEG, PNG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File exceeds 10MB limit. Please upload a smaller image file.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onerror = () => {
      setUploadError('Failed to read image file. Please try again.');
    };
    reader.onload = (uploadEvent) => {
      setUploadedImagePreview(uploadEvent.target?.result);
      // Create custom sample object with simulated inference
      const customSample = {
        id: `custom-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        category: 'Infectious',
        recommendedCompartment: 'INFECTIOUS',
        confidence: 88.5,
        riskLevel: 'High',
        actionPrompt: 'Route to Infectious Compartment (Simulated Demo Model)',
        color: '#eab308',
        weightEstimate: '0.22 kg',
        dimensions: 'Estimated via Depth Map',
        features: ['User uploaded image', 'Simulated bounding box', 'Biological hazard classification'],
        isCustom: true
      };
      setSelectedScanSample(customSample);
      triggerScan(customSample);
    };
    reader.readAsDataURL(file);
  };

  const handleRouteAction = () => {
    const newRecord = routeScannedWaste(scannedResult || selectedScanSample);
    if (newRecord) {
      setRoutedSuccessRecord(newRecord);
    }
  };

  const currentItem = scannedResult || selectedScanSample;

  return (
    <div className="scanner-view-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>AI Biomedical Waste Identification Scanner</h1>
          <p>Edge computer vision neural inference for automated biomedical waste classification & routing</p>
        </div>

        <div className="page-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => triggerScan(selectedScanSample)}
            disabled={isScanning}
          >
            {isScanning ? <RotateCw size={14} className="animate-spin" /> : <ScanLine size={14} />}
            <span>{isScanning ? 'Inferencing...' : 'Run AI Inference'}</span>
          </button>
        </div>
      </div>

      {/* Main Scanner Layout: Left Camera / Viewfinder + Right AI Analysis Panel */}
      <div className="scanner-split-grid">
        {/* LEFT: Camera / Viewfinder Box */}
        <div className="card scanner-camera-card">
          <div className="card-header">
            <div className="card-title">
              <ScanLine size={17} className="text-ai" />
              <span>MedRoute AMR Viewfinder • 4K Optical & Depth Feed</span>
            </div>
            <span className="badge badge-ai">
              <Cpu size={12} /> Jetson TensorRT (FP16)
            </span>
          </div>

          <div className="card-body p-0">
            <div className="camera-viewfinder-screen">
              {/* Laser Scan Animation Line */}
              {isScanning && <div className="scanner-laser-line animate-laser" />}

              {/* Viewfinder Bounding Corner Reticles */}
              <div className="viewfinder-reticle top-left" />
              <div className="viewfinder-reticle top-right" />
              <div className="viewfinder-reticle bottom-left" />
              <div className="viewfinder-reticle bottom-right" />

              {/* Center Crosshair */}
              <div className="viewfinder-crosshair" />

              {/* Sample Visual Representation (SVG Canvas or Uploaded Image) */}
              <div className="sample-visual-stage">
                {uploadedImagePreview ? (
                  <img src={uploadedImagePreview} alt="Uploaded Waste" className="uploaded-preview-img" />
                ) : (
                  <div className="vector-sample-artwork">
                    {currentItem.imageSvgType === 'syringe' && (
                      <svg viewBox="0 0 200 200" className="waste-artwork-svg">
                        <line x1="30" y1="170" x2="60" y2="140" stroke="#94a3b8" strokeWidth="3" />
                        <rect x="55" y="65" width="40" height="90" rx="4" transform="rotate(-45 75 110)" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" />
                        <line x1="60" y1="90" x2="110" y2="140" stroke="#dc2626" strokeWidth="3" strokeDasharray="3 3" />
                        <rect x="85" y="35" width="20" height="40" rx="2" transform="rotate(-45 95 55)" fill="#64748b" />
                        <circle cx="40" cy="160" r="4" fill="#dc2626" />
                      </svg>
                    )}

                    {currentItem.imageSvgType === 'gauze' && (
                      <svg viewBox="0 0 200 200" className="waste-artwork-svg">
                        <rect x="40" y="40" width="120" height="120" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="3" />
                        <path d="M 60 70 Q 90 60 110 80 Q 130 100 140 120" fill="none" stroke="#dc2626" strokeWidth="12" strokeLinecap="round" opacity="0.8" />
                        <circle cx="85" cy="110" r="14" fill="#991b1b" opacity="0.85" />
                      </svg>
                    )}

                    {currentItem.imageSvgType === 'ampoule' && (
                      <svg viewBox="0 0 200 200" className="waste-artwork-svg">
                        <rect x="75" y="70" width="50" height="90" rx="6" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" />
                        <rect x="88" y="35" width="24" height="35" rx="3" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
                        <rect x="80" y="95" width="40" height="40" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                        <text x="100" y="118" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0369a1">Rx 5mg</text>
                      </svg>
                    )}

                    {currentItem.imageSvgType === 'iv-bag' && (
                      <svg viewBox="0 0 200 200" className="waste-artwork-svg">
                        <rect x="60" y="40" width="80" height="110" rx="12" fill="#f0fdfa" stroke="#0d9488" strokeWidth="2.5" />
                        <path d="M 100 150 L 100 180 Q 120 190 140 180" fill="none" stroke="#0d9488" strokeWidth="4" />
                        <line x1="75" y1="75" x2="125" y2="75" stroke="#99f6e4" strokeWidth="2" />
                        <line x1="75" y1="95" x2="125" y2="95" stroke="#99f6e4" strokeWidth="2" />
                      </svg>
                    )}

                    {currentItem.imageSvgType === 'packaging' && (
                      <svg viewBox="0 0 200 200" className="waste-artwork-svg">
                        <rect x="50" y="60" width="100" height="80" rx="4" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
                        <line x1="50" y1="90" x2="150" y2="90" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
                        <text x="100" y="112" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">STERILE WRAP</text>
                      </svg>
                    )}

                    {currentItem.isCustom && (
                      <div className="custom-sample-badge">Custom Upload Sample</div>
                    )}
                  </div>
                )}
              </div>

              {/* Simulated Deep Learning Bounding Box Overlay */}
              <div className="ai-bounding-box-overlay">
                <div className="bounding-box-tag">
                  {currentItem.name} • {currentItem.confidence}%
                </div>
              </div>

              {/* Viewfinder Telemetry Overlay */}
              <div className="viewfinder-overlay-meta">
                <span>ISO 400 • f/2.0 • Depth: 0.35m</span>
                <span className="font-mono">FOV: 86° Wide Angle</span>
              </div>
            </div>

            {/* Demo Sample Selector Strip */}
            <div className="sample-selector-strip">
              <span className="selector-title">Select Preset Test Waste Samples:</span>
              <div className="sample-buttons-row">
                {AI_DEMO_SAMPLES.map(sample => {
                  const isSelected = selectedScanSample.id === sample.id && !uploadedImagePreview;
                  return (
                    <button
                      key={sample.id}
                      className={`sample-pill-btn ${isSelected ? 'sample-pill-active' : ''}`}
                      onClick={() => {
                        setUploadedImagePreview(null);
                        setSelectedScanSample(sample);
                        triggerScan(sample);
                      }}
                    >
                      <span className="sample-pill-dot" style={{ background: sample.color }} />
                      <span>{sample.name.split(' (')[0]}</span>
                    </button>
                  );
                })}

                {/* Custom Image Upload Button */}
                <label className="sample-pill-btn sample-upload-btn">
                  <Upload size={12} />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {uploadError && (
                <div className="badge badge-critical mt-2" style={{ width: '100%', justifyContent: 'flex-start', padding: '6px 10px' }}>
                  <AlertTriangle size={13} /> {uploadError}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: AI Analysis Panel */}
        <div className="card scanner-analysis-card">
          <div className="card-header">
            <div className="card-title">
              <Sparkles size={17} className="text-ai" />
              <span>Edge AI Classification Inference</span>
            </div>
            {isScanning ? (
              <span className="badge badge-ai">
                <RotateCw size={11} className="animate-spin" /> Neural Pass...
              </span>
            ) : (
              <span className="badge badge-safe">
                <CheckCircle2 size={11} /> Inference Complete
              </span>
            )}
          </div>

          <div className="card-body">
            {/* Classification Result Fields */}
            <div className="ai-result-fields">
              <div className="ai-result-group">
                <span className="ai-field-label">Detected Object</span>
                <div className="ai-detected-name">{currentItem.name}</div>
              </div>

              <div className="ai-result-row">
                <div className="ai-result-group flex-1">
                  <span className="ai-field-label">Waste Category</span>
                  <span className={`badge badge-cat-${currentItem.category.toLowerCase()}`}>
                    {currentItem.category}
                  </span>
                </div>

                <div className="ai-result-group flex-1">
                  <span className="ai-field-label">Biohazard Risk Level</span>
                  <span className={`badge ${currentItem.riskLevel === 'Critical' ? 'badge-critical' : currentItem.riskLevel === 'High' ? 'badge-warning' : 'badge-info'}`}>
                    <ShieldAlert size={12} /> {currentItem.riskLevel} Risk
                  </span>
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="ai-confidence-box">
                <div className="conf-label-row">
                  <span className="ai-field-label">Confidence Score</span>
                  <div className="flex-center-gap">
                    {currentItem.confidence < 80 && (
                      <span className="badge badge-warning text-xs">
                        <AlertTriangle size={11} /> Manual Verification Recommended
                      </span>
                    )}
                    <span className="conf-score-value font-mono font-bold text-ai">
                      {currentItem.confidence}%
                    </span>
                  </div>
                </div>
                <div className="confidence-track">
                  <div
                    className="confidence-fill"
                    style={{
                      width: `${currentItem.confidence}%`,
                      background: currentItem.confidence < 80 ? '#f59e0b' : undefined
                    }}
                  />
                </div>
                <span className="conf-model-info">
                  Convolutional Backbone: MobileNet-V3 + YOLOv8 Segmentation (TensorRT FP16)
                </span>
              </div>

              {/* Recommended Compartment Routing */}
              <div className="recommended-route-box">
                <span className="ai-field-label">Recommended AMR Compartment</span>
                <div className="rec-compartment-pill" style={{ borderColor: currentItem.color }}>
                  <Layers size={18} style={{ color: currentItem.color }} />
                  <div>
                    <strong style={{ color: currentItem.color }}>
                      ROUTE TO {currentItem.recommendedCompartment} COMPARTMENT
                    </strong>
                    <div className="rec-details">
                      Weight: {currentItem.weightEstimate} • Dimensions: {currentItem.dimensions}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Breakdown */}
              <div className="ai-features-box">
                <span className="ai-field-label">Detected Spectral & Physical Features</span>
                <ul className="features-list">
                  {currentItem.features?.map((f, i) => (
                    <li key={i}>
                      <CheckCircle2 size={13} className="text-safe" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Routing Action Button */}
              <div className="routing-actions-footer mt-4">
                <button
                  className="btn btn-primary btn-lg w-full"
                  onClick={handleRouteAction}
                >
                  <GitMerge size={16} /> Assign & Route to Compartment
                </button>

                {routedSuccessRecord && (
                  <div className="route-success-banner mt-3">
                    <CheckCircle2 size={16} className="text-safe" />
                    <div className="success-banner-text">
                      <span>Assigned to <strong>{routedSuccessRecord.compartment}</strong>! Passport ID: <code>{routedSuccessRecord.wasteId}</code></span>
                      <button
                        className="btn btn-secondary btn-sm mt-1"
                        onClick={() => openPassport(routedSuccessRecord)}
                      >
                        <QrCode size={13} /> Open Digital Passport
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Regulatory & Demo Disclaimer */}
            <div className="disclaimer-banner mt-4">
              <Info size={16} className="text-hospital-blue" />
              <span>
                <strong>Demonstration Inference:</strong> Object classified using the prototype waste-classification workflow. Simulated deep-learning inference for demonstration purposes. Real AMR deployment integrates multi-spectral cameras and RFID cross-checks.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

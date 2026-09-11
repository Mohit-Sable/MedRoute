import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Bot,
  MapPin,
  Building2,
  X,
  Printer,
  Download,
  FileCheck,
  Hash,
  AlertTriangle,
  ArrowDown
} from 'lucide-react';

export const PassportModal = ({ record, onClose }) => {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog passport-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header passport-modal-header">
          <div className="passport-badge-title">
            <QrCode size={20} className="text-hospital-blue" />
            <div>
              <div className="passport-label">DIGITAL WASTE PASSPORT</div>
              <div className="passport-id-num font-mono">{record.wasteId}</div>
            </div>
          </div>
          <button className="close-flyout-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Passport Details & Timeline */}
        <div className="modal-body passport-content-body">
          {/* Top Summary Banner with QR Code Visual */}
          <div className="passport-hero-banner">
            <div className="passport-qr-box">
              {/* Stylized Vector QR Code */}
              <svg viewBox="0 0 100 100" className="passport-qr-svg">
                {/* QR Pattern Simulation */}
                <rect width="100" height="100" fill="#ffffff" />
                {/* Corner Markers */}
                <rect x="8" y="8" width="24" height="24" fill="#0f172a" rx="3" />
                <rect x="12" y="12" width="16" height="16" fill="#ffffff" rx="2" />
                <rect x="16" y="16" width="8" height="8" fill="#0284c7" />

                <rect x="68" y="8" width="24" height="24" fill="#0f172a" rx="3" />
                <rect x="72" y="12" width="16" height="16" fill="#ffffff" rx="2" />
                <rect x="76" y="16" width="8" height="8" fill="#0284c7" />

                <rect x="8" y="68" width="24" height="24" fill="#0f172a" rx="3" />
                <rect x="12" y="72" width="16" height="16" fill="#ffffff" rx="2" />
                <rect x="16" y="76" width="8" height="8" fill="#0284c7" />

                {/* Random Data Dots */}
                <rect x="38" y="10" width="6" height="6" fill="#0f172a" />
                <rect x="50" y="14" width="6" height="6" fill="#0f172a" />
                <rect x="38" y="26" width="6" height="6" fill="#0f172a" />
                <rect x="42" y="38" width="8" height="8" fill="#0284c7" />
                <rect x="56" y="44" width="6" height="6" fill="#0f172a" />
                <rect x="18" y="42" width="6" height="6" fill="#0f172a" />
                <rect x="70" y="42" width="8" height="8" fill="#0f172a" />
                <rect x="82" y="54" width="6" height="6" fill="#0f172a" />
                <rect x="44" y="60" width="8" height="8" fill="#0f172a" />
                <rect x="60" y="72" width="6" height="6" fill="#0284c7" />
                <rect x="76" y="78" width="8" height="8" fill="#0f172a" />
                <rect x="48" y="84" width="6" height="6" fill="#0f172a" />
              </svg>
              <span className="qr-scan-hint font-mono">{record.qrCode || record.wasteId}</span>
            </div>

            <div className="passport-hero-info">
              <div className="passport-item-title">{record.itemName}</div>
              <div className="passport-meta-tags">
                <span className={`badge badge-cat-${record.category.toLowerCase()}`}>
                  {record.category}
                </span>
                <span className={`badge ${record.riskLevel === 'Critical' ? 'badge-critical' : record.riskLevel === 'High' ? 'badge-warning' : 'badge-info'}`}>
                  {record.riskLevel} Risk
                </span>
                <span className="badge badge-safe">
                  <CheckCircle2 size={11} /> {record.status}
                </span>
              </div>

              <div className="passport-core-grid">
                <div className="passport-kv">
                  <span className="kv-label">Source Dept:</span>
                  <span className="kv-val font-semibold">{record.sourceDepartment} (Floor {record.floor})</span>
                </div>
                <div className="passport-kv">
                  <span className="kv-label">AMR Collector:</span>
                  <span className="kv-val font-mono">{record.robotId}</span>
                </div>
                <div className="passport-kv">
                  <span className="kv-label">Weight (Load):</span>
                  <span className="kv-val font-mono font-bold text-dark">{record.weightKg} kg</span>
                </div>
                <div className="passport-kv">
                  <span className="kv-label">Verification Hash:</span>
                  <span className="kv-val font-mono text-muted text-xs">{record.verificationHash}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Custody Timeline Step Progression */}
          <div className="passport-timeline-section mt-4">
            <h3 className="timeline-heading">
              <FileCheck size={16} className="text-hospital-blue" />
              <span>Chain of Custody & Lifecycle Progression</span>
            </h3>

            <div className="custody-timeline-track">
              {record.timeline?.map((event, idx) => {
                const isDone = event.status === 'done';
                const isProgress = event.status === 'in-progress';
                return (
                  <div key={idx} className={`custody-step ${isDone ? 'step-done' : isProgress ? 'step-active' : 'step-pending'}`}>
                    <div className="step-marker-col">
                      <div className="step-dot">
                        {isDone ? <CheckCircle2 size={14} /> : <Clock size={12} />}
                      </div>
                      {idx < record.timeline.length - 1 && <div className="step-line" />}
                    </div>

                    <div className="step-content-card">
                      <div className="step-header-row">
                        <span className="step-name">{event.step}</span>
                        <span className="step-time font-mono">{event.time}</span>
                      </div>
                      <div className="step-meta-row">
                        <span className="step-actor"><strong>Actor:</strong> {event.actor}</span>
                        <span className="step-location"><strong>Location:</strong> {event.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Compliance & Disposal Protocol Box */}
          <div className="compliance-protocol-card mt-4">
            <div className="protocol-title">
              <ShieldCheck size={16} className="text-safe" />
              <span>Certified Destruction Protocol</span>
            </div>
            <div className="protocol-body">
              <div><strong>Disposal Method:</strong> {record.disposalMethod}</div>
              <div><strong>Final Destination Vault:</strong> {record.destination}</div>
              <div><strong>Regulatory Standard:</strong> Bio-Medical Waste Management Rules (Schedule II & WHO Guidelines)</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
            <Printer size={14} /> Print Manifest Certificate
          </button>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Close Passport
          </button>
        </div>
      </div>
    </div>
  );
};

export const PassportView = () => {
  const { selectedWasteRecord, wasteRecords, setSelectedWasteRecord } = useApp();

  return (
    <div className="passport-standalone-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Digital Waste Passport Explorer</h1>
          <p>Inspect immutable biological waste custody tokens, transit logs & compliance verification</p>
        </div>

        <div className="page-actions">
          <select
            className="form-control"
            value={selectedWasteRecord?.wasteId}
            onChange={(e) => {
              const rec = wasteRecords.find(r => r.wasteId === e.target.value);
              if (rec) setSelectedWasteRecord(rec);
            }}
          >
            {wasteRecords.map(r => (
              <option key={r.id} value={r.wasteId}>
                {r.wasteId} — {r.itemName} ({r.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card passport-full-view">
        <PassportModal
          record={selectedWasteRecord || wasteRecords[0]}
          onClose={() => {}}
        />
      </div>
    </div>
  );
};

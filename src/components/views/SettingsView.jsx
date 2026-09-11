import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building,
  Sliders,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  Shield,
  Save,
  AlertTriangle
} from 'lucide-react';

export const SettingsView = () => {
  const {
    hospitalProfile,
    setHospitalProfile,
    simulationSpeed,
    setSimulationSpeed,
    soundEnabled,
    setSoundEnabled,
    warningThreshold,
    setWarningThreshold,
    addActivity,
    playBeep
  } = useApp();

  const [localProfile, setLocalProfile] = useState({ ...hospitalProfile });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setHospitalProfile(localProfile);
    setSaveSuccess(true);
    addActivity('Hospital operations settings updated.', 'system');
    playBeep(700, 'sine', 0.15);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="settings-view-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>System Settings & Operational Configurations</h1>
          <p>Configure hospital identity, simulation telemetry rates, and biohazard safety thresholds</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Hospital Profile Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Building size={17} className="text-hospital-blue" />
              <span>Hospital Facility Identity</span>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Hospital Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={localProfile.name}
                  onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Facility Subtitle / Campus</label>
                <input
                  type="text"
                  className="form-control"
                  value={localProfile.subTitle}
                  onChange={(e) => setLocalProfile({ ...localProfile, subTitle: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group flex-1">
                  <label className="form-label">Bio-Waste License Code</label>
                  <input
                    type="text"
                    className="form-control font-mono"
                    value={localProfile.facilityCode}
                    onChange={(e) => setLocalProfile({ ...localProfile, facilityCode: e.target.value })}
                  />
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Active Ward Zone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={localProfile.zone}
                    onChange={(e) => setLocalProfile({ ...localProfile, zone: e.target.value })}
                  />
                </div>
              </div>

              {saveSuccess && (
                <div className="badge badge-safe mb-3">
                  <CheckCircle2 size={12} /> Facility settings saved successfully!
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-primary btn-sm">
                <Save size={14} /> Save Configuration
              </button>
            </div>
          </form>
        </div>

        {/* Simulation & Threshold Controls */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Sliders size={17} className="text-hospital-blue" />
              <span>AMR Simulation & Telemetry Parameters</span>
            </div>
          </div>

          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Simulation Clock Acceleration</label>
              <div className="sim-speed-selector">
                {[1, 2, 5].map(spd => (
                  <button
                    key={spd}
                    className={`btn ${simulationSpeed === spd ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    onClick={() => setSimulationSpeed(spd)}
                  >
                    {spd}x Real-time
                  </button>
                ))}
              </div>
              <span className="text-xs text-muted mt-1 block">
                Controls AMR waypoint travel velocity and AI inference speed.
              </span>
            </div>

            <div className="form-group mt-4">
              <label className="form-label">Compartment Overfill Warning Threshold ({warningThreshold}%)</label>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={warningThreshold}
                onChange={(e) => setWarningThreshold(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-muted mt-1 block">
                Triggers visual warning badges and alert notifications when compartment exceeds capacity.
              </span>
            </div>

            <div className="form-group mt-4">
              <label className="form-label">Audio Feedback Effects</label>
              <button
                className={`btn ${soundEnabled ? 'btn-secondary' : 'btn-primary'} btn-sm flex-center-gap`}
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 size={14} className="text-hospital-blue" /> : <VolumeX size={14} />}
                <span>{soundEnabled ? 'Web Audio Feedback: Enabled' : 'Muted (Audio Off)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

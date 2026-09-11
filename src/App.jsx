import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { LandingView } from './components/views/LandingView';
import { DashboardView } from './components/views/DashboardView';
import { FleetView } from './components/views/FleetView';
import { LiveTrackingView } from './components/views/LiveTrackingView';
import { AIScannerView } from './components/views/AIScannerView';
import { SegregationView } from './components/views/SegregationView';
import { WasteRegistryView } from './components/views/WasteRegistryView';
import { PassportView, PassportModal } from './components/views/PassportModal';
import { TasksView } from './components/views/TasksView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { AlertsView } from './components/views/AlertsView';
import { SystemArchitectureView } from './components/views/SystemArchitectureView';
import { SettingsView } from './components/views/SettingsView';

const MainContent = () => {
  const {
    activeView,
    isPassportModalOpen,
    selectedWasteRecord,
    closePassport
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'landing':
        return <LandingView />;
      case 'dashboard':
        return <DashboardView />;
      case 'fleet':
        return <FleetView />;
      case 'tracking':
        return <LiveTrackingView />;
      case 'scanner':
        return <AIScannerView />;
      case 'segregation':
        return <SegregationView />;
      case 'waste':
        return <WasteRegistryView />;
      case 'passport':
        return <PassportView />;
      case 'tasks':
        return <TasksView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'alerts':
        return <AlertsView />;
      case 'architecture':
        return <SystemArchitectureView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="content-container">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Digital Waste Passport Modal */}
      {isPassportModalOpen && (
        <PassportModal
          record={selectedWasteRecord}
          onClose={closePassport}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

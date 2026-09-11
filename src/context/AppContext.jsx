import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_USER,
  INITIAL_ROBOTS,
  INITIAL_COMPARTMENTS,
  INITIAL_TASKS,
  INITIAL_WASTE_RECORDS,
  INITIAL_ALERTS,
  INITIAL_ACTIVITY_LOG,
  AI_DEMO_SAMPLES,
  ANALYTICS_DATA,
  DEFAULT_ROUTE_COORDINATES
} from '../data/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Navigation & Modal State
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedRobotId, setSelectedRobotId] = useState(null);
  const [selectedWasteRecord, setSelectedWasteRecord] = useState(INITIAL_WASTE_RECORDS[0]);
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Hospital & User
  const [currentUser] = useState(INITIAL_USER);
  const [hospitalProfile, setHospitalProfile] = useState({
    name: 'Metro General Hospital - Central Campus',
    subTitle: 'Level 1 Trauma & Quaternary Research Center',
    facilityCode: 'MGH-BIO-9942',
    zone: 'Zone 4 - Acute Care Wings'
  });
  const [warningThreshold, setWarningThreshold] = useState(85);

  // Core Dynamic State
  const [robots, setRobots] = useState(INITIAL_ROBOTS);
  const [compartments, setCompartments] = useState(INITIAL_COMPARTMENTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [wasteRecords, setWasteRecords] = useState(INITIAL_WASTE_RECORDS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [activityLog, setActivityLog] = useState(INITIAL_ACTIVITY_LOG);

  // AI Scanner & Segregation Highlighting
  const [selectedScanSample, setSelectedScanSample] = useState(AI_DEMO_SAMPLES[0]);
  const [scannedResult, setScannedResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [highlightedCompartment, setHighlightedCompartment] = useState(null);

  // Simulation Controls
  const [simulationRunning, setSimulationRunning] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1x, 2x, 5x
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Emergency state
  const [globalEmergencyStop, setGlobalEmergencyStop] = useState(false);

  // Sound effect generator using Web Audio API
  const playBeep = useCallback((freq = 520, type = 'sine', duration = 0.12) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context policy safe fallback
    }
  }, [soundEnabled]);

  // Log new activity helper
  const addActivity = useCallback((text, type = 'system') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivityLog(prev => [
      { id: `act-${Date.now()}`, text, time: timeStr, type },
      ...prev.slice(0, 24)
    ]);
  }, []);

  // Action: Open Passport
  const openPassport = useCallback((recordOrId) => {
    if (typeof recordOrId === 'string') {
      const found = wasteRecords.find(r => r.wasteId === recordOrId || r.id === recordOrId);
      if (found) setSelectedWasteRecord(found);
    } else {
      setSelectedWasteRecord(recordOrId);
    }
    setIsPassportModalOpen(true);
    playBeep(640, 'sine', 0.1);
  }, [wasteRecords, playBeep]);

  const closePassport = useCallback(() => {
    setIsPassportModalOpen(false);
  }, []);

  // Action: Trigger AI Waste Scan
  const triggerScan = useCallback((sample = selectedScanSample) => {
    setIsScanning(true);
    setScannedResult(null);
    playBeep(440, 'triangle', 0.2);

    // Simulate deep learning vision latency
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult({
        ...sample,
        scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        scanSessionId: `SCN-${Math.floor(100000 + Math.random() * 900000)}`,
        modelRuntime: 'Edge TensorRT (18.4ms)',
        rawBoundingBox: { x: 22, y: 18, width: 56, height: 64 }
      });
      setHighlightedCompartment(sample.recommendedCompartment);
      playBeep(880, 'sine', 0.25);

      addActivity(
        `AI inference identified ${sample.name} (${sample.confidence}% conf) -> Assigned to ${sample.recommendedCompartment}.`,
        'scan'
      );
    }, 1400 / simulationSpeed);
  }, [selectedScanSample, simulationSpeed, playBeep, addActivity]);

  // Action: Route Scanned Item to Compartment & Create Digital Record
  const routeScannedWaste = useCallback((scanItem = scannedResult) => {
    if (!scanItem) return null;

    const newIdNum = 426 + wasteRecords.length - 13;
    const newWasteId = `MW-2026-${String(newIdNum).padStart(6, '0')}`;
    const weightNum = parseFloat(scanItem.weightEstimate) || 0.8;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newRecord = {
      id: `rec-${Date.now()}`,
      wasteId: newWasteId,
      category: scanItem.category,
      itemName: scanItem.name,
      sourceDepartment: 'ICU',
      floor: 2,
      robotId: 'RB-001',
      timestamp: timeStr,
      date: new Date().toISOString().split('T')[0],
      weightKg: weightNum,
      riskLevel: scanItem.riskLevel,
      status: 'Collected',
      destination: 'Secure Bio-Waste Storage (B1)',
      compartment: scanItem.recommendedCompartment,
      confidenceScore: scanItem.confidence,
      disposalMethod: 'Certified Medical Autoclave & Secure Neutralization',
      verificationHash: `SHA256:${Math.random().toString(16).substring(2, 14)}...`,
      qrCode: `${newWasteId}-ICU-${scanItem.recommendedCompartment}-RB001`,
      timeline: [
        { step: 'Waste Generated', time: timeStr, location: 'ICU Mobile Unit', actor: 'Dr. Evelyn Vance', status: 'done' },
        { step: 'AI Identified', time: timeStr, location: 'MedRoute AMR Viewfinder', actor: `Vision AI (${scanItem.confidence}%)`, status: 'done' },
        { step: 'Robot Assigned', time: timeStr, location: 'Autonomous AMR Dock', actor: 'MedRoute Rover 01', status: 'done' },
        { step: 'Waste Collected', time: timeStr, location: 'ICU Procedure Station', actor: 'Robot-01 (Auto-Hatch)', status: 'done' },
        { step: 'In-Transit to Storage', time: 'In-Transit', location: 'Corridor 2B', actor: 'Robot-01', status: 'in-progress' },
        { step: 'Transferred to Storage', time: 'Pending', location: 'Secure Storage B1', actor: 'Vault Depository', status: 'pending' },
        { step: 'Final Certified Disposal', time: 'Pending', location: 'Certified Incinerator Plant', actor: 'Govt Contractor', status: 'pending' }
      ]
    };

    // Update waste records
    setWasteRecords(prev => [newRecord, ...prev]);

    // Update compartment fill & weight
    setCompartments(prev => prev.map(comp => {
      if (comp.id === scanItem.recommendedCompartment) {
        const newWeight = parseFloat((comp.currentWeightKg + weightNum).toFixed(1));
        const newFill = Math.min(100, Math.round((newWeight / comp.capacityKg) * 100));
        return {
          ...comp,
          currentWeightKg: newWeight,
          fillPercentage: newFill,
          lastCollectionTime: timeStr,
          status: newFill >= warningThreshold ? 'Warning' : comp.status
        };
      }
      return comp;
    }));

    // Update robot load
    setRobots(prev => prev.map(rb => {
      if (rb.id === 'RB-001') {
        const updatedWeight = parseFloat((rb.totalWeightKg + weightNum).toFixed(1));
        const updatedLoad = Math.min(100, Math.round((updatedWeight / rb.maxWeightKg) * 100));
        return {
          ...rb,
          totalWeightKg: updatedWeight,
          loadPercentage: updatedLoad
        };
      }
      return rb;
    }));

    addActivity(
      `Waste ${newWasteId} sorted into ${scanItem.recommendedCompartment} (${weightNum} kg). Digital Passport generated.`,
      'collection'
    );

    playBeep(980, 'sine', 0.15);
    return newRecord;
  }, [scannedResult, wasteRecords.length, addActivity, playBeep]);

  // Action: Create Task
  const createTask = useCallback((taskData) => {
    const nextNum = 1024 + tasks.length - 10;
    const assignedId = taskData.assignedRobot || (robots[0]?.status === 'Idle' ? robots[0].id : null);
    const newTask = {
      id: `TSK-${nextNum}`,
      department: taskData.department || 'ICU',
      floor: taskData.floor || 2,
      wasteType: taskData.wasteType || 'Infectious',
      priority: taskData.priority || 'Medium',
      assignedRobot: assignedId,
      status: assignedId ? 'Assigned' : 'Pending',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completedAt: null,
      eta: '8 min',
      requester: taskData.requester || currentUser.name,
      notes: taskData.notes || 'Automated hospital task request'
    };

    setTasks(prev => [newTask, ...prev]);
    if (assignedId) {
      setRobots(prev => prev.map(r => r.id === assignedId ? { ...r, currentTask: newTask.id, status: r.status === 'Idle' ? 'Assigned' : r.status } : r));
    }
    setIsNewTaskModalOpen(false);
    addActivity(`New task ${newTask.id} created for ${newTask.department} (${newTask.wasteType}).`, 'task');
    playBeep(600, 'sine', 0.12);
  }, [tasks.length, robots, currentUser.name, addActivity, playBeep]);

  // Action: Update Task Status
  const updateTaskStatus = useCallback((taskId, newStatus) => {
    let targetRobotId = null;
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        targetRobotId = t.assignedRobot;
        const isDone = newStatus === 'Completed';
        return {
          ...t,
          status: newStatus,
          completedAt: isDone ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t.completedAt,
          eta: isDone ? 'Done' : t.eta
        };
      }
      return t;
    }));

    if (newStatus === 'Completed' && targetRobotId) {
      setRobots(prev => prev.map(r => r.id === targetRobotId ? { ...r, currentTask: null, status: r.status === 'Collecting' ? 'Idle' : r.status } : r));
    }

    addActivity(`Task ${taskId} status changed to ${newStatus}.`, 'task');
    playBeep(520, 'sine', 0.1);
  }, [addActivity, playBeep]);

  // Action: Trigger Simulated Warning / Alert
  const triggerAlert = useCallback((customAlert = null) => {
    const alertId = `ALT-${Math.floor(200 + Math.random() * 800)}`;
    const newAlert = customAlert || {
      id: alertId,
      severity: 'WARNING',
      type: 'CAPACITY_WARNING',
      message: 'Simulated Warning: Compartment sensor detected pressure spike in secondary seal.',
      robotId: 'RB-001',
      location: 'Ward A - Corridor 2A',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recommendedAction: 'Verify physical hatch seal integrity and cycle automated lock.',
      status: 'Active'
    };

    setAlerts(prev => [newAlert, ...prev]);
    addActivity(`Safety alert ${newAlert.id} triggered (${newAlert.severity}): ${newAlert.message}`, 'alert');
    playBeep(380, 'sawtooth', 0.25);
    return newAlert;
  }, [addActivity, playBeep]);

  // Action: Acknowledge & Resolve Alert
  const acknowledgeAlert = useCallback((alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Acknowledged' } : a));
    addActivity(`Alert ${alertId} acknowledged by ${currentUser.name}.`, 'alert');
    playBeep(480, 'sine', 0.1);
  }, [currentUser.name, addActivity, playBeep]);

  const resolveAlert = useCallback((alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Resolved' } : a));
    addActivity(`Alert ${alertId} resolved.`, 'alert');
    playBeep(720, 'sine', 0.12);
  }, [addActivity, playBeep]);

  // Action: Emergency Stop
  const emergencyStopRobot = useCallback((robotId) => {
    setRobots(prev => prev.map(r => {
      if (!robotId || r.id === robotId) {
        return {
          ...r,
          status: 'Idle',
          speed: 0,
          sensors: { ...r.sensors, emergencyStop: 'TRIGGERED / HALT' }
        };
      }
      return r;
    }));
    setGlobalEmergencyStop(true);

    const alertId = `ALT-${Math.floor(110 + Math.random() * 50)}`;
    setAlerts(prev => [
      {
        id: alertId,
        severity: 'CRITICAL',
        type: 'EMERGENCY_STOP',
        message: `EMERGENCY STOP manually triggered on ${robotId || 'ALL ROBOTS'}! All drives halted.`,
        robotId: robotId || 'ALL',
        location: 'Manual Remote Override',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedAction: 'Verify physical area clear before clearing emergency interlock.',
        status: 'Active'
      },
      ...prev
    ]);

    addActivity(`EMERGENCY STOP engaged for ${robotId || 'Fleet'}. Motors powered down.`, 'alert');
    playBeep(260, 'sawtooth', 0.5);
  }, [addActivity, playBeep]);

  const resumeRobot = useCallback((robotId) => {
    setRobots(prev => prev.map(r => {
      if (!robotId || r.id === robotId) {
        return {
          ...r,
          status: r.isCharging ? 'Charging' : 'Navigating',
          speed: r.isCharging ? 0 : 0.8,
          sensors: { ...r.sensors, emergencyStop: 'Ready / Disengaged' }
        };
      }
      return r;
    }));
    setGlobalEmergencyStop(false);
    addActivity(`Emergency stop cleared. ${robotId || 'AMR fleet'} returned to active navigation.`, 'robot');
    playBeep(680, 'sine', 0.15);
  }, [addActivity, playBeep]);

  // Action: Return robot to charging base
  const sendRobotToBase = useCallback((robotId) => {
    setRobots(prev => prev.map(r => {
      if (r.id === robotId) {
        return {
          ...r,
          status: 'Returning',
          destination: 'Base Charging Dock 1',
          speed: 0.9,
          activeRoute: [r.location, 'Corridor West', 'Charging Station'],
          currentWaypointIndex: 0
        };
      }
      return r;
    }));
    addActivity(`${robotId} rerouted to Base Charging Station.`, 'robot');
    playBeep(550, 'sine', 0.12);
  }, [addActivity, playBeep]);

  // Action: Assign dispatch destination
  const dispatchRobot = useCallback((robotId, destination) => {
    setRobots(prev => prev.map(r => {
      if (r.id === robotId) {
        return {
          ...r,
          status: 'Navigating',
          destination: destination,
          speed: 0.8,
          isCharging: false
        };
      }
      return r;
    }));
    addActivity(`${robotId} dispatched to ${destination}.`, 'robot');
    playBeep(620, 'sine', 0.12);
  }, [addActivity, playBeep]);

  // Simulation Loop: updates robot waypoints, battery, and speed smoothly
  useEffect(() => {
    if (!simulationRunning || globalEmergencyStop) return;

    const interval = setInterval(() => {
      setRobots(prev => prev.map(rb => {
        if (rb.id === 'RB-001') {
          // Advance waypoint index
          const nextIndex = (rb.currentWaypointIndex + 1) % DEFAULT_ROUTE_COORDINATES.length;
          const targetNode = DEFAULT_ROUTE_COORDINATES[nextIndex];
          const isAtStorage = targetNode.name === 'Secure Waste Storage';
          const isAtICU = targetNode.name === 'ICU Isolation Suite';

          // Battery slow drift
          const nextBattery = Math.max(15, rb.battery - 0.05);

          return {
            ...rb,
            currentWaypointIndex: nextIndex,
            location: isAtICU ? 'ICU' : isAtStorage ? 'Waste Storage' : targetNode.name,
            floor: targetNode.floor,
            destination: DEFAULT_ROUTE_COORDINATES[(nextIndex + 1) % DEFAULT_ROUTE_COORDINATES.length].name,
            battery: parseFloat(nextBattery.toFixed(1)),
            speed: isAtICU || isAtStorage ? 0.2 : 0.85
          };
        } else if (rb.id === 'RB-002') {
          // RB-002 is charging, slowly increase battery
          const nextBattery = Math.min(100, rb.battery + 0.15);
          return {
            ...rb,
            battery: parseFloat(nextBattery.toFixed(1))
          };
        }
        return rb;
      }));
    }, 3000 / simulationSpeed);

    return () => clearInterval(interval);
  }, [simulationRunning, globalEmergencyStop, simulationSpeed]);

  const value = {
    // Nav & Modals
    activeView,
    setActiveView,
    selectedRobotId,
    setSelectedRobotId,
    selectedWasteRecord,
    setSelectedWasteRecord,
    isPassportModalOpen,
    setIsPassportModalOpen,
    isNewTaskModalOpen,
    setIsNewTaskModalOpen,
    isAlertDrawerOpen,
    setIsAlertDrawerOpen,
    searchQuery,
    setSearchQuery,
    openPassport,
    closePassport,

    // Hospital & User
    currentUser,
    hospitalProfile,
    setHospitalProfile,
    warningThreshold,
    setWarningThreshold,

    // Entities
    robots,
    setRobots,
    compartments,
    setCompartments,
    tasks,
    setTasks,
    wasteRecords,
    setWasteRecords,
    alerts,
    setAlerts,
    activityLog,
    analyticsData: ANALYTICS_DATA,

    // Scanner & Segregation
    selectedScanSample,
    setSelectedScanSample,
    scannedResult,
    isScanning,
    highlightedCompartment,
    setHighlightedCompartment,
    triggerScan,
    routeScannedWaste,

    // Task & Alert actions
    createTask,
    updateTaskStatus,
    triggerAlert,
    acknowledgeAlert,
    resolveAlert,

    // Robot Remote Controls
    emergencyStopRobot,
    resumeRobot,
    sendRobotToBase,
    dispatchRobot,
    globalEmergencyStop,

    // Simulation
    simulationRunning,
    setSimulationRunning,
    simulationSpeed,
    setSimulationSpeed,
    soundEnabled,
    setSoundEnabled,
    playBeep,
    addActivity
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

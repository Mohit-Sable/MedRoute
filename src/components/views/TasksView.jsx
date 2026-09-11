import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEPARTMENTS } from '../../data/mockData';
import {
  CheckSquare,
  Plus,
  Bot,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Filter,
  ArrowRight,
  Sparkles,
  Building,
  UserCheck,
  ChevronDown
} from 'lucide-react';

export const TasksView = () => {
  const {
    tasks,
    robots,
    createTask,
    updateTaskStatus,
    isNewTaskModalOpen,
    setIsNewTaskModalOpen
  } = useApp();

  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');

  // Form state for creating a new task
  const [formData, setFormData] = useState({
    department: 'ICU',
    floor: 2,
    wasteType: 'Sharps',
    priority: 'Critical',
    assignedRobot: 'RB-001',
    notes: 'Urgent bedside disposal required'
  });

  const handleSubmitNewTask = (e) => {
    e.preventDefault();
    createTask(formData);
    setFormData({
      department: 'ICU',
      floor: 2,
      wasteType: 'Sharps',
      priority: 'High',
      assignedRobot: 'RB-001',
      notes: ''
    });
  };

  const filteredTasks = tasks.filter(t => {
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'ACTIVE' && t.status !== 'Completed' && t.status !== 'Failed') ||
      t.status.toUpperCase() === filterStatus;

    const matchesPriority = filterPriority === 'ALL' || t.priority.toUpperCase() === filterPriority;
    return matchesStatus && matchesPriority;
  });

  return (
    <div className="tasks-view-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Biomedical Waste Collection Tasks</h1>
          <p>Autonomous AMR dispatch queue, priority scheduling & bedside collection management</p>
        </div>

        <div className="page-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsNewTaskModalOpen(true)}
          >
            <Plus size={15} /> Create Collection Task
          </button>
        </div>
      </div>

      {/* Filter Tabs & Toolbar */}
      <div className="card mb-4">
        <div className="card-body py-3">
          <div className="task-filter-toolbar">
            <div className="filter-pills-group">
              {[
                { id: 'ALL', label: 'All Tasks' },
                { id: 'ACTIVE', label: 'Active & Pending' },
                { id: 'COMPLETED', label: 'Completed' }
              ].map(f => (
                <button
                  key={f.id}
                  className={`task-filter-pill ${filterStatus === f.id ? 'pill-active' : ''}`}
                  onClick={() => setFilterStatus(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="filter-dropdown-wrap">
              <label className="filter-label">Priority:</label>
              <select
                className="form-control filter-select"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="ALL">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Task List Grid / Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <CheckSquare size={17} className="text-hospital-blue" />
            <span>Task Queue ({filteredTasks.length} Tasks)</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Department & Floor</th>
                <th>Waste Type</th>
                <th>Priority</th>
                <th>Assigned Robot</th>
                <th>Created Time</th>
                <th>Status</th>
                <th>ETA</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-muted">
                    No tasks found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => {
                  const isDone = task.status === 'Completed';
                  return (
                    <tr key={task.id} className={isDone ? 'row-done text-muted' : ''}>
                      <td className="mono-id">{task.id}</td>
                      <td>
                        <strong>{task.department}</strong>
                        <div className="text-xs text-muted">Floor {task.floor}</div>
                      </td>
                      <td>
                        <span className={`badge badge-cat-${task.wasteType.toLowerCase()}`}>
                          {task.wasteType}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${task.priority === 'Critical' ? 'badge-critical' : task.priority === 'High' ? 'badge-warning' : 'badge-info'}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        {task.assignedRobot ? (
                          <span className="badge badge-info font-mono">
                            <Bot size={11} className="mr-1" /> {task.assignedRobot}
                          </span>
                        ) : (
                          <span className="badge badge-warning">Unassigned</span>
                        )}
                      </td>
                      <td className="font-mono text-muted">{task.createdAt}</td>
                      <td>
                        <span className={`badge ${isDone ? 'badge-safe' : task.status === 'Collecting' ? 'badge-ai' : task.status === 'En Route' ? 'badge-info' : 'badge-warning'}`}>
                          <span className="badge-dot" /> {task.status}
                        </span>
                      </td>
                      <td className="font-mono font-semibold">{task.eta}</td>
                      <td>
                        <div className="flex-gap-2">
                          {!isDone && (
                            <>
                              <button
                                className="btn btn-success btn-xs"
                                onClick={() => updateTaskStatus(task.id, 'Completed')}
                                title="Mark Task as Completed"
                              >
                                Mark Done
                              </button>
                              <button
                                className="btn btn-secondary btn-xs"
                                onClick={() => updateTaskStatus(task.id, task.status === 'Pending' ? 'Assigned' : 'Collecting')}
                              >
                                Advance
                              </button>
                            </>
                          )}
                          {isDone && (
                            <span className="text-safe text-xs font-semibold flex-center-gap">
                              <CheckCircle2 size={12} /> Closed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create New Task */}
      {isNewTaskModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewTaskModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <CheckSquare size={18} className="text-hospital-blue inline-icon mr-2" />
                Dispatch New Autonomous Collection Task
              </div>
              <button
                className="close-flyout-btn"
                onClick={() => setIsNewTaskModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewTask}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Source Department</label>
                  <select
                    className="form-control"
                    value={formData.department}
                    onChange={(e) => {
                      const dept = DEPARTMENTS.find(d => d.name.includes(e.target.value) || d.id === e.target.value);
                      setFormData({
                        ...formData,
                        department: e.target.value,
                        floor: dept ? dept.floor : 2
                      });
                    }}
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.name}>
                        {d.name} (Floor {d.floor})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row-2">
                  <div className="form-group flex-1">
                    <label className="form-label">Waste Stream Type</label>
                    <select
                      className="form-control"
                      value={formData.wasteType}
                      onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
                    >
                      <option value="Sharps">Sharps (Needles, Scalpels)</option>
                      <option value="Infectious">Infectious (Soiled Dressings)</option>
                      <option value="Pharmaceutical">Pharmaceutical (Ampoules)</option>
                      <option value="Plastic">Plastic (IV Lines, Tubing)</option>
                      <option value="General">General (Packaging, Non-bio)</option>
                    </select>
                  </div>

                  <div className="form-group flex-1">
                    <label className="form-label">Priority Tier</label>
                    <select
                      className="form-control"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="Critical">Critical (Immediate Pickup)</option>
                      <option value="High">High (&lt;15 min)</option>
                      <option value="Medium">Medium (&lt;30 min)</option>
                      <option value="Low">Low (Scheduled Routine)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Assign Autonomous Mobile Robot (AMR)</label>
                  <select
                    className="form-control"
                    value={formData.assignedRobot || ''}
                    onChange={(e) => setFormData({ ...formData, assignedRobot: e.target.value || null })}
                  >
                    <option value="">Auto-Assign Closest Available Robot</option>
                    {robots.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.id}) — {r.status} ({r.battery}% Battery)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Clinical Location Notes / Specific Bed</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="e.g. Bed 12 isolation bay procedure container..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsNewTaskModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Create & Dispatch Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  Layers,
  Building,
  CheckCircle2,
  Bot,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Download
} from 'lucide-react';

export const AnalyticsView = () => {
  const { analyticsData, compartments, robots, tasks } = useApp();
  const [timeRange, setTimeRange] = useState('7D'); // 'TODAY' | '7D' | '30D' | 'CUSTOM'

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const completionRate = Math.round((completedTasks / tasks.length) * 100);

  const handleExportReport = () => {
    const lines = [
      'MedRoute AI - Operational Analytics & Compliance Report',
      `Generated At: ${new Date().toISOString()}`,
      `Time Range: ${timeRange}`,
      '',
      'Stream,Weight (kg),Compliance %,Trend',
      ...analyticsData.dailyStreams.map(s => `"${s.name}",${s.weight},${s.compliance}%,"${s.trend}"`),
      '',
      'Department,Daily Waste (kg),Collections',
      ...analyticsData.deptGeneration.map(d => `"${d.dept}",${d.kg},${d.collections}`),
      '',
      'Compartment,Current Fill %,Weight (kg),Capacity (kg),Status',
      ...compartments.map(c => `"${c.name}",${c.fillPercentage}%,${c.currentWeightKg},${c.capacityKg},"${c.status}"`),
      '',
      `Total Tasks: ${tasks.length}, Completed: ${completedTasks}, Completion Rate: ${completionRate}%`
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `medroute_analytics_${timeRange.toLowerCase()}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="analytics-view-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Biomedical Waste Operational Analytics</h1>
          <p>Multi-stream waste generation metrics, AMR utilization, and segregation performance</p>
        </div>

        <div className="page-actions">
          {/* Time range selector */}
          <div className="floor-selector-pill">
            {[
              { id: 'TODAY', label: 'Today' },
              { id: '7D', label: 'Last 7 Days' },
              { id: '30D', label: '30 Days' },
              { id: 'CUSTOM', label: 'Custom' }
            ].map(r => (
              <button
                key={r.id}
                className={`floor-btn ${timeRange === r.id ? 'floor-btn-active' : ''}`}
                onClick={() => setTimeRange(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>

          <button className="btn btn-secondary btn-sm" onClick={handleExportReport} id="export-analytics-btn">
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* Prominent Operational Insight Callout Cards */}
      <div className="insights-grid mb-4">
        {analyticsData.insights.map(ins => (
          <div key={ins.id} className="insight-card card">
            <div className="insight-top">
              <div className="insight-icon-box">
                <Sparkles size={16} className="text-ai" />
              </div>
              <span className={`insight-trend-badge ${ins.trendPositive ? 'trend-positive' : 'trend-neutral'}`}>
                {ins.trendPositive ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
                {ins.trend}
              </span>
            </div>
            <h3 className="insight-title">{ins.title}</h3>
            <p className="insight-desc">{ins.description}</p>
          </div>
        ))}
      </div>

      {/* KPI Performance Bar */}
      <div className="kpi-grid mb-4">
        <div className="kpi-card accent-purple">
          <span className="kpi-label">AI Segregation Accuracy</span>
          <div className="kpi-value text-ai">{analyticsData.kpis.segregationAccuracy}%</div>
          <span className="kpi-subtext">Zero cross-contamination events</span>
        </div>

        <div className="kpi-card accent-blue">
          <span className="kpi-label">Avg. Response Time</span>
          <div className="kpi-value">{analyticsData.kpis.avgCollectionTimeMinutes} min</div>
          <span className="kpi-subtext text-safe">14% faster than manual porters</span>
        </div>

        <div className="kpi-card accent-green">
          <span className="kpi-label">Task Completion Rate</span>
          <div className="kpi-value text-safe">{completionRate}%</div>
          <span className="kpi-subtext">{completedTasks} of {tasks.length} cleared today</span>
        </div>

        <div className="kpi-card accent-amber">
          <span className="kpi-label">AMR Fleet Utilization</span>
          <div className="kpi-value">84.2%</div>
          <span className="kpi-subtext">14.8 km autonomous travel</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="analytics-charts-grid">
        {/* Chart 1: 7-Day Trend Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={17} className="text-hospital-blue" />
              <span>7-Day Biomedical Waste Generation Trend (kg)</span>
            </div>
            <span className="text-muted text-xs">Daily Volume & Tasks Cleared</span>
          </div>

          <div className="card-body">
            <svg viewBox="0 0 540 220" className="analytics-large-svg">
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[40, 80, 120, 160].map(y => (
                <g key={y}>
                  <line x1="40" y1={y} x2="520" y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                  <text x="30" y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
                    {Math.round((180 - y) * 1.1)}kg
                  </text>
                </g>
              ))}

              {/* Bars + Trend Curve */}
              {analyticsData.sevenDayTrend.map((d, i) => {
                const x = 65 + i * 65;
                const barH = (d.weightKg / 160) * 120;
                const y = 170 - barH;
                const isToday = i === analyticsData.sevenDayTrend.length - 1;

                return (
                  <g key={d.day}>
                    <rect x={x - 14} y={y} width="28" height={barH} rx="5" fill={isToday ? '#0284c7' : '#94a3b8'} opacity={isToday ? 1 : 0.75} />
                    <text x={x} y="190" textAnchor="middle" fontSize="11" fontWeight="600" fill="#475569">
                      {d.day.split(' ')[0]}
                    </text>
                    <text x={x} y="204" textAnchor="middle" fontSize="9.5" fill="#94a3b8">
                      {d.tasksCompleted} tasks
                    </text>
                    <text x={x} y={y - 6} textAnchor="middle" fontSize="10" fontWeight="700" fill="#0f172a">
                      {d.weightKg}kg
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Chart 2: Waste by Department */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Building size={17} className="text-hospital-blue" />
              <span>Waste Generation by Department</span>
            </div>
            <span className="text-muted text-xs">High-risk hotspots</span>
          </div>

          <div className="card-body">
            <div className="dept-breakdown-list">
              {analyticsData.departmentGeneration.map(dept => (
                <div key={dept.department} className="dept-stat-row">
                  <div className="dept-row-top">
                    <span className="dept-name font-semibold">{dept.department}</span>
                    <span className="dept-metric font-mono">
                      {dept.weightKg} kg <strong>({dept.percentage}%)</strong>
                    </span>
                  </div>
                  <div className="dist-progress-bar">
                    <div
                      className="dist-progress-fill"
                      style={{
                        width: `${dept.percentage * 2.8}%`,
                        backgroundColor: dept.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 3: Category Breakdown */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Layers size={17} className="text-hospital-blue" />
              <span>Bio-Stream Composition</span>
            </div>
          </div>

          <div className="card-body">
            <div className="category-composition-grid">
              {analyticsData.categoryDistribution.map(cat => (
                <div key={cat.category} className="cat-comp-pill card" style={{ borderLeft: `4px solid ${cat.color}` }}>
                  <div className="cat-comp-title" style={{ color: cat.color }}>
                    {cat.category}
                  </div>
                  <div className="cat-comp-num font-mono">{cat.weightKg} kg</div>
                  <span className="cat-comp-share">{cat.percentage}% of total waste</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 4: Compartment Storage Saturation */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Bot size={17} className="text-hospital-blue" />
              <span>Central Vault Compartment Saturation</span>
            </div>
          </div>

          <div className="card-body">
            <div className="dept-breakdown-list">
              {compartments.map(comp => (
                <div key={comp.id} className="dept-stat-row">
                  <div className="dept-row-top">
                    <span className="dept-name">{comp.name}</span>
                    <span className="dept-metric font-mono">
                      {comp.currentWeightKg} / {comp.capacityKg} kg ({comp.fillPercentage}%)
                    </span>
                  </div>
                  <div className="dist-progress-bar">
                    <div
                      className="dist-progress-fill"
                      style={{
                        width: `${comp.fillPercentage}%`,
                        backgroundColor: comp.colorHex
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

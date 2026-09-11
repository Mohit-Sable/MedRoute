import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Archive,
  Search,
  Filter,
  Download,
  QrCode,
  ArrowUpDown,
  ExternalLink,
  ShieldAlert,
  Bot,
  Building,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const WasteRegistryView = () => {
  const {
    wasteRecords,
    openPassport,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortField, setSortField] = useState('timestamp');
  const [sortAsc, setSortAsc] = useState(false);

  // Filtered and sorted records
  const filteredRecords = useMemo(() => {
    return wasteRecords.filter(rec => {
      const matchesSearch =
        searchQuery === '' ||
        rec.wasteId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.sourceDepartment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.robotId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'ALL' || rec.category.toUpperCase() === selectedCategory;
      const matchesDept = selectedDepartment === 'ALL' || rec.sourceDepartment.toUpperCase().includes(selectedDepartment);
      const matchesStatus = selectedStatus === 'ALL' || rec.status.toUpperCase() === selectedStatus;

      return matchesSearch && matchesCat && matchesDept && matchesStatus;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [wasteRecords, searchQuery, selectedCategory, selectedDepartment, selectedStatus, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const exportCSV = () => {
    const headers = ['Waste ID', 'Item Name', 'Category', 'Source Dept', 'Robot', 'Timestamp', 'Weight (kg)', 'Risk', 'Status', 'Destination'];
    const rows = filteredRecords.map(r => [
      r.wasteId,
      `"${r.itemName}"`,
      r.category,
      r.sourceDepartment,
      r.robotId,
      r.timestamp,
      r.weightKg,
      r.riskLevel,
      r.status,
      `"${r.destination}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medroute_waste_registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="waste-view-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Biomedical Waste Management Registry</h1>
          <p>Searchable chain-of-custody ledger for all generated, collected, and segregated bio-waste</p>
        </div>

        <div className="page-actions">
          <button className="btn btn-secondary btn-sm" onClick={exportCSV}>
            <Download size={14} /> Export CSV Audit Manifest
          </button>
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="card filters-card mb-4">
        <div className="card-body">
          <div className="filters-row">
            {/* Search Input */}
            <div className="filter-input-wrap flex-1">
              <Search size={15} className="filter-search-icon" />
              <input
                type="text"
                className="form-control filter-search-field"
                placeholder="Search Waste ID (MW-1021), Item name, Department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="filter-dropdown-wrap">
              <label className="filter-label">Category:</label>
              <select
                className="form-control filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                <option value="SHARPS">Sharps</option>
                <option value="INFECTIOUS">Infectious</option>
                <option value="PHARMACEUTICAL">Pharmaceutical</option>
                <option value="PLASTIC">Plastic</option>
                <option value="GENERAL">General</option>
              </select>
            </div>

            {/* Department Filter */}
            <div className="filter-dropdown-wrap">
              <label className="filter-label">Department:</label>
              <select
                className="form-control filter-select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="ALL">All Departments</option>
                <option value="ICU">ICU</option>
                <option value="EMERGENCY">Emergency (ED)</option>
                <option value="PHARMACY">Pharmacy</option>
                <option value="LABORATORY">Laboratory</option>
                <option value="WARD A">Ward A</option>
                <option value="WARD B">Ward B</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="filter-dropdown-wrap">
              <label className="filter-label">Status:</label>
              <select
                className="form-control filter-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="COLLECTED">Collected</option>
                <option value="TRANSFERRED">Transferred</option>
                <option value="TREATED">Treated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Waste Registry Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Archive size={17} className="text-hospital-blue" />
            <span>Hospital Waste Items ({filteredRecords.length} Records)</span>
          </div>
          <span className="text-muted text-xs font-mono">
            Click any Waste ID to inspect Digital Waste Passport & Chain-of-Custody
          </span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('wasteId')} className="cursor-pointer">
                  Waste ID <ArrowUpDown size={12} className="inline-icon" />
                </th>
                <th>Item Description</th>
                <th onClick={() => handleSort('category')} className="cursor-pointer">
                  Category <ArrowUpDown size={12} className="inline-icon" />
                </th>
                <th onClick={() => handleSort('sourceDepartment')} className="cursor-pointer">
                  Source Dept <ArrowUpDown size={12} className="inline-icon" />
                </th>
                <th>AMR Robot</th>
                <th onClick={() => handleSort('timestamp')} className="cursor-pointer">
                  Time <ArrowUpDown size={12} className="inline-icon" />
                </th>
                <th onClick={() => handleSort('weightKg')} className="cursor-pointer">
                  Weight <ArrowUpDown size={12} className="inline-icon" />
                </th>
                <th>Risk Tier</th>
                <th>Status</th>
                <th>Destination Vault</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-8 text-muted">
                    No waste records matching current search filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(record => (
                  <tr key={record.id} className="record-row">
                    <td>
                      <button
                        className="mono-id waste-id-link"
                        onClick={() => openPassport(record)}
                        title="Open Digital Waste Passport"
                      >
                        <QrCode size={13} className="mr-1 inline-icon" />
                        {record.wasteId}
                      </button>
                    </td>
                    <td className="font-medium text-dark">{record.itemName}</td>
                    <td>
                      <span className={`badge badge-cat-${record.category.toLowerCase()}`}>
                        {record.category}
                      </span>
                    </td>
                    <td>
                      <span className="dept-tag">{record.sourceDepartment}</span>
                    </td>
                    <td>
                      <span className="badge badge-info">{record.robotId}</span>
                    </td>
                    <td className="font-mono text-muted">{record.timestamp}</td>
                    <td className="font-mono font-semibold">{record.weightKg} kg</td>
                    <td>
                      <span className={`badge ${record.riskLevel === 'Critical' ? 'badge-critical' : record.riskLevel === 'High' ? 'badge-warning' : 'badge-info'}`}>
                        {record.riskLevel}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-safe">
                        <CheckCircle2 size={11} /> {record.status}
                      </span>
                    </td>
                    <td className="text-muted text-xs">{record.destination}</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openPassport(record)}
                      >
                        Passport
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

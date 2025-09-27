import React, { useEffect, useMemo, useState } from 'react';
import './ProjectFilters.css';

const ProjectFilters = ({
  customers = [],
  businessUnits = [],
  billingTypes = [],
  segments = [],
  statuses = [],
  values = {},
  sortBy = 'createdDate',
  sortOrder = 'desc',
  onChange,
  onReset
}) => {
  const initialOpen = typeof window !== 'undefined'
    ? !window.matchMedia('(max-width: 768px)').matches
    : true; // default to open in non-browser environments
  const [isOpen, setIsOpen] = useState(initialOpen);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => {
      setIsOpen(!mq.matches); // open on desktop, collapsed on mobile
    };
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const activeFiltersCount = useMemo(() => {
    const keys = ['customerID', 'buid', 'billingTypeID', 'segmentID', 'status'];
    return keys.reduce((acc, k) => acc + ((values && values[k]) ? 1 : 0), 0);
  }, [values]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange && onChange(name, value);
  };

  const toggleSortOrder = () => {
    onChange && onChange('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="projects-filters">
      <div className="filters-header">
        <button
          type="button"
          className="filters-toggle"
          onClick={() => setIsOpen((o) => !o)}
          aria-expanded={isOpen}
          aria-controls="projects-filters-grid"
        >
          {isOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
        <div className="filters-meta">
          <span className="filters-count">
            {activeFiltersCount > 0 ? `${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} applied` : 'No filters'}
          </span>
          <button type="button" className="filters-reset-link" onClick={onReset}>
            Reset
          </button>
        </div>
      </div>
      <div id="projects-filters-grid" className={`filters-grid ${isOpen ? 'open' : ''}`}>
        <div className="filter-item">
          <label>Customer</label>
          <select name="customerID" value={values.customerID || ''} onChange={handleChange}>
            <option value="">All</option>
            {customers.map(c => (
              <option key={c.customerID} value={c.customerID}>{c.customerName}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Business Unit</label>
          <select name="buid" value={values.buid || ''} onChange={handleChange}>
            <option value="">All</option>
            {businessUnits.map(b => (
              <option key={b.buid} value={b.buid}>{b.buName}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Billing Type</label>
          <select name="billingTypeID" value={values.billingTypeID || ''} onChange={handleChange}>
            <option value="">All</option>
            {billingTypes.map(bt => (
              <option key={bt.billingTypeID} value={bt.billingTypeID}>{bt.billingTypeName}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Segment</label>
          <select name="segmentID" value={values.segmentID || ''} onChange={handleChange}>
            <option value="">All</option>
            {segments.map(s => (
              <option key={s.segmentID} value={s.segmentID}>{s.segmentName}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Status</label>
          <select name="status" value={values.status || ''} onChange={handleChange}>
            <option value="">All</option>
            {statuses.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        <div className="filter-item sort-by">
          <label>Sort By</label>
          <select name="sortBy" value={sortBy} onChange={handleChange}>
            <option value="createdDate">Created Date</option>
            <option value="projectName">Project Name</option>
            <option value="customerName">Customer</option>
            <option value="buName">Business Unit</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div className="filter-item sort-order">
          <label>Order</label>
          <button type="button" className="btn btn-secondary" onClick={toggleSortOrder}>
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>

        <div className="filter-item reset">
          <label>&nbsp;</label>
          <button type="button" className="btn btn-secondary" onClick={onReset}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilters;

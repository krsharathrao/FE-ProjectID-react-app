import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ProjectForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading,
  errors = {},
}) => {
  // {
  //   "coreProjectID": 2,
  //   "projectName": "sdsdsd",
  //   "projectAbbreviation": "TSXX",
  //   "createdDate": "2025-08-15T04:18:50.04",
  //   "isActive": true
  // },
  const isEdit = !!initialData?.coreProjectID;
  const [projectAbbreviation, setProjectAbbreviation] = useState(initialData?.projectAbbreviation || '');
  const [projectName, setProjectName] = useState(initialData?.projectName || '');
  const [customerCodeStartSeries, setCustomerCodeStartSeries] = useState(initialData?.customerCodeStartSeries || '');
  const [isActive, setIsActive] = useState(
    typeof initialData?.isActive === 'boolean' ? initialData?.isActive : true
  );

  useEffect(() => {
    setProjectAbbreviation(initialData?.projectAbbreviation || '');
    setProjectName(initialData?.projectName || '');
    setCustomerCodeStartSeries(initialData?.customerCodeStartSeries || '');
    setIsActive(typeof initialData?.isActive === 'boolean' ? initialData?.isActive : true);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.coreProjectID,
      projectAbbreviation,
      projectName,
      customerCodeStartSeries,
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-responsive">
      {isEdit && (
        <div className="form-group">
          <label>ID</label>
          <input type="text" className="form-control" value={initialData?.coreProjectID} disabled readOnly />
        </div>
      )}
      <div className="form-group">
        <label htmlFor="projectName">Name<span style={{ color: 'red' }}>*</span></label>
        <input
          id="projectName"
          type="text"
          className={`form-control ${errors.projectName ? 'is-invalid' : ''}`}
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          disabled={loading}
          required
        />
        {errors.projectName && <div className="invalid-feedback">{errors.projectName}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="projectAbbreviation">Abbreviation</label>
        <input
          id="projectAbbreviation"
          type="text"
          className={`form-control ${errors.projectAbbreviation ? 'is-invalid' : ''}`}
          value={projectAbbreviation}
          onChange={(e) => setProjectAbbreviation(e.target.value)}
          disabled={loading}
        />
        {errors.projectAbbreviation && <div className="invalid-feedback">{errors.descripprojectAbbreviationtion}</div>}
      </div> 
      <div className="form-group">
        <label htmlFor="businessUnitActive">Active</label>
        <select
          id="businessUnitActive"
          className="form-control"
          value={isActive ? 'true' : 'false'}
          onChange={(e) => setIsActive(e.target.value === 'true')}
          disabled={loading}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      {isEdit && initialData?.createdByUserName && (
        <div className="form-group">
          <label>Created By</label>
          <input type="text" className="form-control" value={initialData?.createdByUserName} disabled readOnly />
        </div>
      )}
      {errors.general && (
        <div className="alert alert-danger mt-2">{errors.general}</div>
      )}
      <div className="businessunit-actions" style={{ display: 'flex', gap: '1rem', marginTop: 8 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

ProjectForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errors: PropTypes.object,
};

export default ProjectForm;

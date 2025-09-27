import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const SegmentForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading,
  errors = {},
}) => {

      // {
  //   "segmentID": 1,
  //   "segmentName": "Consulting",
  //   "isActive": true,
  //   "createdDate": "0001-01-01T00:00:00",
  //   "createdByUserName": null
  // },

  const isEdit = !!initialData?.segmentID;
  const [segmentName, setSegmentName] = useState(initialData?.segmentName || '');
  const [isActive, setIsActive] = useState(
    initialData?.isActive
  );


  useEffect(() => {
    setSegmentName(initialData?.segmentName || '');
    setIsActive(typeof initialData?.isActive === 'boolean' ? initialData?.isActive : true);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.segmentID,
      segmentName,
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-responsive">
      {isEdit && (
        <div className="form-group">
          <label>ID</label>
          <input type="text" className="form-control" value={initialData?.segmentID} disabled readOnly />
        </div>
      )}
      <div className="form-group">
        <label htmlFor="segmentName">Name<span style={{ color: 'red' }}>*</span></label>
        <input
          id="segmentName"
          type="text"
          className={`form-control ${errors.segmentName ? 'is-invalid' : ''}`}
          value={segmentName}
          onChange={(e) => setSegmentName(e.target.value)}
          disabled={loading}
          required
        />
        {errors.segmentName && <div className="invalid-feedback">{errors.segmentName}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="segmentActive">Active</label>
        <select
          id="segmentActive"
          className="form-control"
          value={isActive ? 'true' : 'false'}
          onChange={(e) => setIsActive(e.target.value === 'true')}
          disabled={loading}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      {errors.general && (
        <div className="alert alert-danger mt-2">{errors.general}</div>
      )}
      <div className="segment-actions" style={{ display: 'flex', gap: '1rem', marginTop: 8 }}>
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

SegmentForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errors: PropTypes.object,
};

export default SegmentForm;

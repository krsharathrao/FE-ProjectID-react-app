import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const BillingTypeForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading,
  errors = {},
}) => {
  // Support both create and edit: if billingTypeID exists, it's edit mode
  const isEdit = !!initialData?.billingTypeID;

  // State for editable fields
  const [billingTypeCode, setBillingTypeCode] = useState(initialData?.billingTypeCode || '');
  const [billingTypeName, setBillingTypeName] = useState(initialData?.billingTypeName || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isActive, setIsActive] = useState(
    typeof initialData?.isActive === 'boolean' ? initialData?.isActive : true
  );

  useEffect(() => {
    setBillingTypeCode(initialData?.billingTypeCode || '');
    setBillingTypeName(initialData?.billingTypeName || '');
    setDescription(initialData?.description || '');
    setIsActive(typeof initialData?.isActive === 'boolean' ? initialData?.isActive : true);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only send editable fields
    onSubmit({
      id: initialData?.billingTypeID,
      billingTypeCode,
      billingTypeName,
      description,
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-responsive">
      {isEdit && (
        <div className="form-group">
          <label>ID</label>
          <input type="text" className="form-control" value={initialData?.billingTypeID} disabled readOnly />
        </div>
      )}
      <div className="form-group">
        <label htmlFor="billingTypeCode">Code<span style={{ color: 'red' }}>*</span></label>
        <input
          id="billingTypeCode"
          type="text"
          className={`form-control ${errors.billingTypeCode ? 'is-invalid' : ''}`}
          value={billingTypeCode}
          onChange={(e) => setBillingTypeCode(e.target.value)}
          disabled={loading}
          required
        />
        {errors.billingTypeCode && <div className="invalid-feedback">{errors.billingTypeCode}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="billingTypeName">Name<span style={{ color: 'red' }}>*</span></label>
        <input
          id="billingTypeName"
          type="text"
          className={`form-control ${errors.billingTypeName ? 'is-invalid' : ''}`}
          value={billingTypeName}
          onChange={(e) => setBillingTypeName(e.target.value)}
          disabled={loading}
          required
        />
        {errors.billingTypeName && <div className="invalid-feedback">{errors.billingTypeName}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="billingTypeActive">Active</label>
        <select
          id="billingTypeActive"
          className="form-control"
          value={isActive ? 'true' : 'false'}
          onChange={(e) => setIsActive(e.target.value === 'true')}
          disabled={loading}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      {isEdit && (
        <div className="form-group">
          <label>Created Date</label>
          <input type="text" className="form-control" value={initialData?.createdDate ? new Date(initialData?.createdDate).toLocaleString() : ''} disabled readOnly />
        </div>
      )}
      {isEdit && initialData?.createdByUserName && (
        <div className="form-group">
          <label>Created By</label>
          <input type="text" className="form-control" value={initialData?.createdByUserName} disabled readOnly />
        </div>
      )}

      {errors.general && (
        <div className="alert alert-danger mt-2">{errors.general}</div>
      )}
      <div className="billingtype-actions" style={{ display: 'flex', gap: '1rem', marginTop: 8 }}>
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

BillingTypeForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errors: PropTypes.object,
};

export default BillingTypeForm;

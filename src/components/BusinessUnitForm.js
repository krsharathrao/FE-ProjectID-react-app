import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const BusinessUnitForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading,
  errors = {},
}) => {
    //   {
//     "buid": 1,
//     "buName": "Digital Application Solutions (DAPS)",
//     "buCode": "D",
//     "isActive": true,
//     "customerCodeStartSeries": 100,
//     "createdDate": "0001-01-01T00:00:00",
//     "createdByUserName": null
//   },
  const isEdit = !!initialData?.buid;
  const [businessUnitCode, setBusinessUnitCode] = useState(initialData?.buCode || '');
  const [businessUnitName, setBusinessUnitName] = useState(initialData?.buName || '');
  const [customerCodeStartSeries, setCustomerCodeStartSeries] = useState(initialData?.customerCodeStartSeries || '');
  const [isActive, setIsActive] = useState(
    typeof initialData?.isActive === 'boolean' ? initialData?.isActive : true
  );

  useEffect(() => {
    setBusinessUnitCode(initialData?.buCode || '');
    setBusinessUnitName(initialData?.buName || '');
    setCustomerCodeStartSeries(initialData?.customerCodeStartSeries || '');
    setIsActive(typeof initialData?.isActive === 'boolean' ? initialData?.isActive : true);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.buid,
      buCode: businessUnitCode,
      buName: businessUnitName,
      customerCodeStartSeries,
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-responsive">
      {isEdit && (
        <div className="form-group">
          <label>ID</label>
          <input type="text" className="form-control" value={initialData?.buid} disabled readOnly />
        </div>
      )}
      <div className="form-group">
        <label htmlFor="businessUnitCode">Code<span style={{ color: 'red' }}>*</span></label>
        <input
          id="businessUnitCode"
          type="text"
          className={`form-control ${errors.businessUnitCode ? 'is-invalid' : ''}`}
          value={businessUnitCode}
          onChange={(e) => setBusinessUnitCode(e.target.value)}
          disabled={loading}
          required
        />
        {errors.businessUnitCode && <div className="invalid-feedback">{errors.businessUnitCode}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="businessUnitName">Name<span style={{ color: 'red' }}>*</span></label>
        <input
          id="businessUnitName"
          type="text"
          className={`form-control ${errors.businessUnitName ? 'is-invalid' : ''}`}
          value={businessUnitName}
          onChange={(e) => setBusinessUnitName(e.target.value)}
          disabled={loading}
          required
        />
        {errors.businessUnitName && <div className="invalid-feedback">{errors.businessUnitName}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="businessUnitDesc">Customer Code Start Series</label>
        <input
          id="businessUnitDesc"
          type="text"
          className={`form-control ${errors.customerCodeStartSeries ? 'is-invalid' : ''}`}
          value={customerCodeStartSeries}
          onChange={(e) => setCustomerCodeStartSeries(e.target.value)}
          disabled={loading}
        />
        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
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

BusinessUnitForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errors: PropTypes.object,
};

export default BusinessUnitForm;

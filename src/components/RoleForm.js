import React, { useState, useEffect } from 'react';

const RoleForm = ({ onSubmit, onCancel, initialData, loading, error, isEditMode }) => {
  const [roleName, setRoleName] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialData) {
      setRoleName(initialData.roleName || '');
      setIsActive(initialData.isActive !== undefined ? initialData.isActive : true);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ roleName, isActive });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="roleName">Role Name</label>
        <input
          type="text"
          id="roleName"
          name="roleName"
          required
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
      </div>
      {isEditMode && (
        <div className="form-group form-group-flex">
          <label className="active-label">Active</label>
          <input
            type="checkbox"
            className="active-checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
        </div>
      )}
      <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default RoleForm;

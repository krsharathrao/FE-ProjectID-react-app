import React, { useState } from 'react';

const SuperAdminRemarksModal = ({ isOpen, onClose, onSubmit, loading, actionType }) => {
  const [remarks, setRemarks] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{width: '50%', position: 'relative'}}>
        <button
          className="modal-close-btn"
          aria-label="Close"
          onClick={onClose}
          disabled={loading}
        >
          &times;
        </button>
        <h2>{actionType === 'approve' ? 'Approve Project' : 'Reject Project'}</h2>
        <label htmlFor="remarks">Remarks (required):</label>
        <textarea
          id="remarks"
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
          rows={4}
          className="modal-textarea"
          required
        />
        <div className="modal-actions">
          <button className="btn" onClick={onClose} disabled={loading} style={{ background: '#aaa', color: '#fff' }}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() => onSubmit(remarks)} 
            disabled={loading || !remarks.trim()}
            style={{ background: '#1976d2', color: '#fff' }}
          >
            Submit
          </button>
        </div>
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .modal-content {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.18);
          padding: 2rem;
          min-width: 320px;
          max-width: 90vw;
          position: relative;
        }
        .modal-content h2 {
          margin-top: 0;
          margin-bottom: 1.5rem;
        }
        .modal-content label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        .modal-content .modal-textarea {
          width: 100%;
          margin-bottom: 1.5rem;
          padding: 0.75rem;
          font-size: 1rem;
          border-radius: 4px;
          border: 1px solid #ccc;
          resize: vertical;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: transparent;
          border: none;
          font-size: 2rem;
          color: #888;
          cursor: pointer;
          z-index: 10;
          transition: color 0.2s;
        }
        .modal-close-btn:hover {
          color: #d32f2f;
        }
      `}</style>
    </div>
  );
};

export default SuperAdminRemarksModal;

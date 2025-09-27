import React from 'react';
import Modal from './Modal';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, loading, entityName }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={`Delete ${entityName?.charAt(0)?.toUpperCase() + entityName?.slice(1)}`}> 
    <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
      <p>Are you sure you want to delete this {entityName?.charAt(0)?.toUpperCase() + entityName?.slice(1)}?</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
        <button className="btn btn-secondary" type="button" onClick={onClose} disabled={loading}>Cancel</button>
        <button className="btn btn-danger" type="button" onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  </Modal>
);

export default DeleteConfirmModal;

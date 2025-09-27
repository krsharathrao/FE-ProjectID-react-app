import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  listSegments,
  createSegmentAction,
  updateSegmentAction,
  deleteSegmentAction
} from '../actions/segmentActions';
import SegmentForm from '../components/SegmentForm';
import Modal from '../components/Modal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Loader from '../components/Loader';

const SegmentList = () => {
  const dispatch = useDispatch();
  const segmentList = useSelector((state) => state.segmentList);
  const { loading, segments, error } = segmentList;

  const segmentCreate = useSelector((state) => state.segmentCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate } = segmentCreate;

  const segmentUpdate = useSelector((state) => state.segmentUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = segmentUpdate;

  const segmentDelete = useSelector((state) => state.segmentDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = segmentDelete;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    dispatch(listSegments());
  }, [dispatch, successCreate, successUpdate, successDelete]);

  const handleAdd = () => {
    setSelectedSegment(null);
    setIsModalOpen(true);
  };
  const handleEdit = (seg) => {
    setSelectedSegment(seg);
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSegment(null);
  };

  const handleDelete = (seg) => {
    setDeleteId(seg.segmentID);
    setDeleteError(null);
    setDeleteSuccess(false);
  };
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleteLoading(true);
    try {
      await dispatch(deleteSegmentAction(deleteId));
      setDeleteSuccess(true);
    } catch (err) {
      setDeleteError('Failed to delete.');
    }
    setIsDeleteLoading(false);
    setDeleteId(null);
  };
  const handleDeleteCancel = () => {
    setDeleteId(null);
    setIsDeleteLoading(false);
    setDeleteError(null);
    setDeleteSuccess(false);
  };

  const handleFormSubmit = (formData) => {
    if (selectedSegment) {
      dispatch(updateSegmentAction(selectedSegment.segmentID, formData));
      setIsModalOpen(false);
    } else {
      dispatch(createSegmentAction(formData));
      setIsModalOpen(false);
    }
  };

  const renderErrors = (errors) => {
    if (typeof errors === 'string') {
      return <p className="error-message">{errors}</p>;
    }
    if (typeof errors === 'object' && errors !== null) {
      return Object.entries(errors).map(([field, messages]) => (
        <p key={field} className="error-message">
          {Array.isArray(messages) ? messages.join(', ') : messages}
        </p>
      ));
    }
    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const renderSegmentCards = () => (
    <div className="segment-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', height: 'calc(100vh - 200px)' }}>
      {segments.map((seg) => (
        <div
          key={seg.segmentID}
          className="segment-card"
          style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: '1rem',
            background: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            width: '100%',
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
            <div style={{ flex: 1, minWidth: 120 }}><strong>ID:</strong> {seg.segmentID}</div>
            <div style={{ flex: 1, minWidth: 120 }}><strong>Name:</strong> {seg.segmentName}</div>
          </div>
          <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
            <div style={{ flex: 1, minWidth: 120 }}><strong>Active:</strong> {seg.isActive ? 'Yes' : 'No'}</div>
            <div style={{ flex: 1, minWidth: 120 }}><strong>Created:</strong> {formatDate(seg.createdDate)}</div>
            <div style={{ flex: 1, minWidth: 120 }}><strong>Created By:</strong> {seg.createdByUserName}</div>
          </div>
          <div className="segment-actions" style={{ display: 'flex', gap: '1rem', marginTop: 8 }}>
            <button
              className="btn-text btn-edit"
              onClick={() => handleEdit(seg)}
              aria-label="Edit segment"
            >
              <i className="fas fa-edit" /> Edit
            </button>
            <button
              className="btn-text btn-delete"
              onClick={() => handleDelete(seg)}
              aria-label="Delete segment"
            >
              <i className="fas fa-trash" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // {
  //   "segmentID": 1,
  //   "segmentName": "Consulting",
  //   "isActive": true,
  //   "createdDate": "0001-01-01T00:00:00",
  //   "createdByUserName": null
  // },
  return (
    <section>
      {!error && (
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginBottom: '10px'
        }}>
          <h1>Segments</h1>
        <div className="add-button-container" style={{width: '50%', marginTop: 20}}>
          <button className="btn btn-add" onClick={handleAdd}>Add Segment</button>
        </div>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={selectedSegment ? 'Edit Segment' : 'Add Segment'}>
        <SegmentForm
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
          initialData={selectedSegment}
          loading={loadingCreate || loadingUpdate}
        />
        {(errorCreate || errorUpdate) && renderErrors(errorCreate || errorUpdate)}
      </Modal>
      {loading ? (
     <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignSelf: 'center',
      height: '300px',
      width: '100%'
    }}>
      <Loader text="Loading segments..." />
    </div>
      ) : error ? (
        renderErrors(error)
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="desktop-view">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Active</th>
                  <th>Created Date</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {segments.map((seg) => (
                  <tr key={seg.segmentID}>
                    <td>{seg.segmentID}</td>
                    <td>{seg.segmentName}</td>
                    <td>{seg.isActive ? 'Yes' : 'No'}</td>
                    <td>{formatDate(seg.createdDate)}</td>
                    <td>{seg.createdByUserName}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-text btn-edit"
                          onClick={() => handleEdit(seg)}
                          aria-label="Edit segment"
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          className="btn-text btn-delete"
                          onClick={() => handleDelete(seg)}
                          aria-label="Delete segment"
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile Card View */}
          <div className="mobile-view">
            {renderSegmentCards()}
          </div>
        </>
      )}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={isDeleteLoading}
        error={deleteError}
        entityName={segments?.find((seg) => seg.segmentID === deleteId)?.segmentName}
      />
    </section>
  );
};

export default SegmentList;

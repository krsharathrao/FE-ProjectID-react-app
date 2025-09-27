import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  listBusinessUnits,
  createBusinessUnitAction,
  updateBusinessUnitAction,
  deleteBusinessUnitAction
} from '../actions/businessUnitActions';
import BusinessUnitForm from '../components/BusinessUnitForm';
import Modal from '../components/Modal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Loader from '../components/Loader';

const BusinessUnitList = () => {
  const dispatch = useDispatch();
  const businessUnitList = useSelector((state) => state.businessUnitList);
  const { loading, businessUnits, error } = businessUnitList;

  const businessUnitCreate = useSelector((state) => state.businessUnitCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate } = businessUnitCreate;

  const businessUnitUpdate = useSelector((state) => state.businessUnitUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = businessUnitUpdate;

  const businessUnitDelete = useSelector((state) => state.businessUnitDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = businessUnitDelete;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    dispatch(listBusinessUnits());
  }, [dispatch, successCreate, successUpdate, successDelete]);

  const handleAdd = () => {
    setSelectedBusinessUnit(null);
    setIsModalOpen(true);
  };
  const handleEdit = (bu) => {
    setSelectedBusinessUnit(bu);
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBusinessUnit(null);
  };

  const handleDelete = (bu) => {
    setDeleteId(bu.buid);
    setDeleteError(null);
    setDeleteSuccess(false);
  };
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleteLoading(true);
    try {
      await dispatch(deleteBusinessUnitAction(deleteId));
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
    if (selectedBusinessUnit) {
      dispatch(updateBusinessUnitAction(selectedBusinessUnit.buid, formData));
      setIsModalOpen(false);
    } else {
      dispatch(createBusinessUnitAction(formData));
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

  const renderBusinessUnitCards = () => (
    <div className="businessunit-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', height: 'calc(100vh - 200px)' }}>
      {businessUnits.map((bu) => (
        <div
          key={bu.businessUnitID}
          className="businessunit-card"
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
            <div style={{ flex: 1, minWidth: 120 }}><strong>ID:</strong> {bu.buid}</div>
            <div style={{ flex: 1, minWidth: 120 }}><strong>Code:</strong> {bu.buCode}</div>
            <div style={{ flex: 1, minWidth: 120 }}><strong>Name:</strong> {bu.buName}</div>
            {/* this line should be next new line */}
          </div>
          <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
          <div style={{ flex: 1, minWidth: 120 }}><strong>Customer Code Start Series:</strong> {bu.customerCodeStartSeries}</div>
          </div>
          <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
            <div style={{ flex: 1, minWidth: 120 }}><strong>Active:</strong> {bu.isActive ? 'Yes' : 'No'}</div>
            <div style={{ flex: 1, minWidth: 120 }}><strong>Created:</strong> {formatDate(bu.createdDate)}</div>
            <div style={{ flex: 1, minWidth: 120 }}><strong>Created By:</strong> {bu.createdByUserName}</div>
          </div>
          <div className="businessunit-actions" style={{ display: 'flex', gap: '1rem', marginTop: 8 }}>
            <button
              className="btn-text btn-edit"
              onClick={() => handleEdit(bu)}
              aria-label="Edit business unit"
            >
              <i className="fas fa-edit" /> Edit
            </button>
            <button
              className="btn-text btn-delete"
              onClick={() => handleDelete(bu)}
              aria-label="Delete business unit"
            >
              <i className="fas fa-trash" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

//   {
//     "buid": 1,
//     "buName": "Digital Application Solutions (DAPS)",
//     "buCode": "D",
//     "isActive": true,
//     "customerCodeStartSeries": 100,
//     "createdDate": "0001-01-01T00:00:00",
//     "createdByUserName": null
//   },

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
          <h1>Business Units</h1>
        <div className="add-button-container" style={{width: '60%', marginTop: 20}}>
          <button className="btn btn-add" onClick={handleAdd}>Add Business Unit</button>
        </div>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={selectedBusinessUnit ? 'Edit Business Unit' : 'Add Business Unit'}>
        <BusinessUnitForm
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
          initialData={selectedBusinessUnit}
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
          <Loader text="Loading Business Units..." />
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
                  <th>Code</th>
                  <th>Name</th>
                 
                  <th>Customer Code Start Series</th>
                  <th>Active</th>
                  <th>Created Date</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {businessUnits.map((bu) => (
                  <tr key={bu.buid}>
                    <td>{bu.buid}</td>
                    <td>{bu.buCode}</td>
                    <td>{bu.buName}</td>
                    <td>{bu.customerCodeStartSeries}</td>
                    <td>{bu.isActive ? 'Yes' : 'No'}</td>
                    <td>{formatDate(bu.createdDate)}</td>
                    <td>{bu.createdByUserName}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-text btn-edit"
                          onClick={() => handleEdit(bu)}
                          aria-label="Edit business unit"
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          className="btn-text btn-delete"
                          onClick={() => handleDelete(bu)}
                          aria-label="Delete business unit"
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
            {renderBusinessUnitCards()}
          </div>
        </>
      )}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={isDeleteLoading}
        error={deleteError}
        entityName={businessUnits?.find((bu) => bu.buid === deleteId)?.buName}
      />
    </section>
  );
};

export default BusinessUnitList;

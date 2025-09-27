import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  listBillingTypes,
  createBillingTypeAction,
  updateBillingTypeAction,
  deleteBillingTypeAction
} from '../actions/billingTypeActions';
import BillingTypeForm from '../components/BillingTypeForm';
import Modal from '../components/Modal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Loader from '../components/Loader';

const BillingTypeList = () => {
  const dispatch = useDispatch();
  const billingTypeList = useSelector((state) => state.billingTypeList);
  const { loading, billingTypes, error } = billingTypeList;

  const billingTypeCreate = useSelector((state) => state.billingTypeCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate } = billingTypeCreate;

  const billingTypeUpdate = useSelector((state) => state.billingTypeUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = billingTypeUpdate;

  const billingTypeDelete = useSelector((state) => state.billingTypeDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = billingTypeDelete;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBillingType, setSelectedBillingType] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Fetch billing types on mount and after CRUD
  useEffect(() => {
    dispatch(listBillingTypes());
  }, [dispatch, successCreate, successUpdate, successDelete]);

  // Modal open/close handlers
  const handleAdd = () => {
    setSelectedBillingType(null);
    setIsModalOpen(true);
  };
  const handleEdit = (bt) => {
    setSelectedBillingType(bt);
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBillingType(null);
  };

  // Delete handlers
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleDelete = (bt) => {
    setDeleteId(bt.billingTypeID);
    setDeleteError(null);
    setDeleteSuccess(false);
  };
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleteLoading(true);
    try {
      await dispatch(deleteBillingTypeAction(deleteId));
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

  // Form submit handler
  const handleFormSubmit = (formData) => {
    if (selectedBillingType) {
      dispatch(updateBillingTypeAction(selectedBillingType.billingTypeID, formData));
      setIsModalOpen(false);
    } else {
      dispatch(createBillingTypeAction(formData));
      setIsModalOpen(false);
    }
  };

  // Error rendering helper (matches UsersPage/RolesPage)
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

  // Mobile card view renderer (responsive, no overlap)
  const renderBillingTypeCards = () => (
    <div className="billingtype-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', height: 'calc(100vh - 200px)' }}>
      {billingTypes.map((bt) => (
        <div
          key={bt.billingTypeID}
          className="billingtype-card"
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
            <div style={{ flex: 1, minWidth: 120 }}><strong>ID:</strong> {bt.billingTypeID}</div>
            <div style={{ flex: 1, minWidth: 120 }}><strong>Code:</strong> {bt.billingTypeCode}</div>
            <div style={{ flex: 1, minWidth: 120 }}><strong>Name:</strong> {bt.billingTypeName}</div>
          </div>
          <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
            <div style={{ flex: 1, minWidth: 120 }}><strong>Active:</strong> {bt.isActive ? 'Yes' : 'No'}</div>
            <div style={{ flex: 1, minWidth: 120 }}><strong>Created:</strong> {formatDate(bt.createdDate)}</div>
            <div style={{ flex: 1, minWidth: 120 }}><strong>Created By:</strong> {bt.createdByUserName}</div>
          </div>
          <div className="billingtype-actions" style={{ display: 'flex', gap: '1rem', marginTop: 8 }}>
            <button
              className="btn-text btn-edit"
              onClick={() => handleEdit(bt)}
              aria-label="Edit billing type"
            >
              <i className="fas fa-edit" /> Edit
            </button>
            <button
              className="btn-text btn-delete"
              onClick={() => handleDelete(bt)}
              aria-label="Delete billing type"
            >
              <i className="fas fa-trash" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // {
  //   "billingTypeID": 1,
  //   "billingTypeCode": "F",
  //   "billingTypeName": "Fixed Bid",
  //   "isActive": true,
  //   "createdDate": "0001-01-01T00:00:00",
  //   "createdByUserName": null
  // },


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate(); // 22
    const month = date.toLocaleString('default', { month: 'short' }); // Jul
    const year = date.getFullYear(); // 2023
    return `${day} ${month} ${year}`; // "22 Jul 2023"
  };

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
          <h1>Billing Types</h1>
        <div className="add-button-container">
          <button className="btn btn-add" onClick={handleAdd}>Add Billing Type</button>
        </div>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={selectedBillingType ? 'Edit Billing Type' : 'Add Billing Type'}>
        <BillingTypeForm
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
          initialData={selectedBillingType}
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
          <Loader text="Loading Billing Types..." />
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
                  <th>Active</th>
                  <th>Created Date</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {billingTypes.map((bt) => (
                  <tr key={bt.id}>
                    <td>{bt.billingTypeID}</td>
                    <td>{bt.billingTypeCode}</td>
                    <td>{bt.billingTypeName}</td>
                    <td>{bt.isActive ? 'Yes' : 'No'}</td>
                    <td>{formatDate(bt.createdDate)}</td>
                    <td>{bt.createdByUserName}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-text btn-edit"
                          onClick={() => handleEdit(bt)}
                          aria-label="Edit billing type"
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          className="btn-text btn-delete"
                          onClick={() => handleDelete(bt)}
                          aria-label="Delete billing type"
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
            {renderBillingTypeCards()}
          </div>
        </>
      )}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={isDeleteLoading}
        error={deleteError}
        entityName={billingTypes?.find((bt) => bt.billingTypeID === deleteId)?.billingTypeName}
      />
    </section>
  );
};

export default BillingTypeList;

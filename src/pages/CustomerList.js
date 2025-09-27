import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  listCustomers,
  createCustomerAction,
  updateCustomerAction,
  deleteCustomerAction
} from '../actions/customerActions';
import CustomerForm from '../components/CustomerForm';
import Modal from '../components/Modal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import '../styles/customer-module-overrides.css';
import { listBusinessUnits } from '../actions/businessUnitActions';
import Loader from '../components/Loader';

const CustomerList = () => {
  const dispatch = useDispatch();
  const customerList = useSelector((state) => state.customerList);
  const businessUnitList = useSelector((state) => state.businessUnitList);
  const { loading, customers, error } = customerList;
  const { loading: loadingBusinessUnit, businessUnits, error: errorBusinessUnit } = businessUnitList;

  const customerCreate = useSelector((state) => state.customerCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate } = customerCreate;

  const customerUpdate = useSelector((state) => state.customerUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = customerUpdate;

  const customerDelete = useSelector((state) => state.customerDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = customerDelete;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchBU, setSearchBU] = useState('');

  useEffect(() => {
    dispatch(listCustomers());
    dispatch(listBusinessUnits());
  }, [dispatch, successCreate, successUpdate, successDelete]);

  const handleAdd = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleDelete = (customer) => {
    setDeleteId(customer.customerID);
    setDeleteError(null);
    setDeleteSuccess(false);
  };
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleteLoading(true);
    try {
      await dispatch(deleteCustomerAction(deleteId));
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
    if (selectedCustomer) {
      dispatch(updateCustomerAction(selectedCustomer.customerID, formData));
      setIsModalOpen(false);
    } else {
      dispatch(createCustomerAction(formData));
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

  // Helper function to get BU details from assignedBUID
  const getBUDetails = (assignedBUID) => {
    const businessUnit = businessUnits.find((bu) => bu.buid === assignedBUID);
    return {
      buName: businessUnit?.buName || 'N/A',
      buCode: businessUnit?.buCode || 'N/A'
    };
  };

  // Normalize server-side validation errors (RFC 9110 problem+json) into field-level errors
  const normalizeFieldErrors = (err) => {
    if (!err) return {};
    // If the error is plain text
    if (typeof err === 'string') return { general: err };

    const result = {};
    const keyMap = {
      CustomerName: 'customerName',
      CustomerAbbreviation: 'customerAbbreviation',
      CustomerCode: 'customerCode',
      AssignedBUID: 'assignedBUID',
      BUName: 'buName',
      BuName: 'buName',
      BUCode: 'buCode',
      BuCode: 'buCode',
      GSTDocumentPath: 'gstDocumentPath',
      GstDocumentPath: 'gstDocumentPath',
      FullPostalAddress: 'fullPostalAddress',
      City: 'city',
      Email: 'email',
      Phone: 'phone',
      Type: 'type',
      IsActive: 'isActive',
    };

    if (err && typeof err === 'object') {
      if (err.errors && typeof err.errors === 'object') {
        Object.entries(err.errors).forEach(([key, messages]) => {
          const firstLower = key ? key.charAt(0) + key.slice(1) : key; // keep case after first char
          const camelGuess = key ? key.charAt(0).toLowerCase() + key.slice(1) : key;
          const mappedKey = keyMap[key] || keyMap[firstLower] || keyMap[camelGuess] || camelGuess;
          result[mappedKey] = Array.isArray(messages) ? messages.join(', ') : String(messages);
        });
      }
      // carry general details if present
      if (err.title && !result.general) {
        result.general = err.title;
      }
      if (err.message && !result.general) {
        result.general = err.message;
      }
    }
    return result;
  };

  const filteredCustomers = customers?.filter((customer) => {
    const nameMatch = (customer.customerName || '').toLowerCase().includes(searchCustomer.toLowerCase());
    const buDetails = getBUDetails(customer.assignedBUID);
    const buMatch = buDetails.buName.toLowerCase().includes(searchBU.toLowerCase());
    return nameMatch && buMatch;
  });

  const renderCustomerCards = () => (
    <div className="customer-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', height: 'calc(100vh - 200px)' }}>
      {filteredCustomers.map((customer) => {
        const buDetails = getBUDetails(customer.assignedBUID);
        return (
          <div
            key={customer.customerID}
            className="customer-card"
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
              <div style={{ flex: 1, minWidth: 120 }}><strong>ID:</strong> {customer.customerID}</div>
              <div style={{ flex: 1, minWidth: 120 }}><strong>Name:</strong> {customer.customerName}</div>
            </div>
            <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
              <div style={{ flex: 1, minWidth: 120 }}><strong>BUID:</strong> {customer.assignedBUID}</div>
              <div style={{ flex: 1, minWidth: 120 }}><strong>BU Name:</strong> {buDetails.buName}</div>
            </div>
            <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
              <div style={{ flex: 1, minWidth: 120 }}><strong>BU Code:</strong> {buDetails.buCode}</div>
              <div style={{ flex: 1, minWidth: 120 }}><strong>Active:</strong> {customer.isActive ? 'Yes' : 'No'}</div>
            </div>
            <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
              <div style={{ flex: 1, minWidth: 120 }}><strong>Created By:</strong> {customer.createdByUserName}</div>
            </div>
            <div className="customer-actions" style={{ display: 'flex', gap: '1rem', marginTop: 8 }}>
              <button
                className="btn-text btn-edit"
                onClick={() => handleEdit(customer)}
                aria-label="Edit customer"
              >
                <i className="fas fa-edit" /> Edit
              </button>
              <button
                className="btn-text btn-delete"
                onClick={() => handleDelete(customer)}
                aria-label="Delete customer"
              >
                <i className="fas fa-trash" /> Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="scrollable w-50">
      {!error && (
        <div className="customers-header">
          <h1>Customers</h1>
          <div className="customers-controls">
            <div className="search-inputs">
              <div className="search-input-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search Customer Name"
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  className="form-control search-input"
                />
              </div>
              <div className="search-input-wrapper">
                <i className="fas fa-building search-icon"></i>
                <input
                  type="text"
                  placeholder="Search BU Name"
                  value={searchBU}
                  onChange={(e) => setSearchBU(e.target.value)}
                  className="form-control search-input"
                />
              </div>
            </div>
            <div className="add-button-container" style={{marginTop:15}}>
              <button className="btn btn-add" onClick={handleAdd}>
                <i className="fas fa-plus"></i>
                <span>Add Customer</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={selectedCustomer ? 'Edit Customer' : 'Add Customer'} customClass="wide-modal scrollable-modal">
        <CustomerForm
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
          initialData={selectedCustomer}
          customers={customers}
          businessUnits={businessUnits}
          loading={loadingCreate || loadingUpdate}
          errors={normalizeFieldErrors(errorCreate || errorUpdate)}
        />
        {(errorCreate || errorUpdate) && renderErrors(normalizeFieldErrors(errorCreate || errorUpdate).general)}
      </Modal>
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignSelf: 'center',
          height: '300px',
          width: '100%'
        }}>
          <Loader text="Loading customers..." />
        </div>
      ) : error ? (
        renderErrors(error)
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="desktop-view scrollable scrollable-table">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Abbreviation</th>
                  <th>Customer Code</th>
                  <th>Assigned BUID</th>
                  <th>BU Name</th>
                  <th>BU Code</th>
                  <th>GST Document Number</th>
                  <th>Full Postal Address</th>
                  {/* <th>City</th>  */}
                  <th>Active</th>
                  <th>Created Date</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => {
                  const buDetails = getBUDetails(customer.assignedBUID);
                  return (
                    <tr key={customer.customerID}>
                      <td>{customer.customerID}</td>
                      <td>{customer.customerName}</td>
                      <td>{customer.customerAbbreviation}</td>
                      <td>{customer.customerCode}</td>
                      <td>{customer.assignedBUID}</td>
                      <td>{buDetails.buName}</td>
                      <td>{buDetails.buCode}</td>
                      <td>{customer.gstDocumentPath}</td>
                      <td>{customer.fullPostalAddress}</td>
                      {/* <td>{customer.city}</td> */}
                      <td>{customer.isActive ? 'Yes' : 'No'}</td>
                      <td>{formatDate(customer.createdDate)}</td>
                      <td>{customer.createdByUserName}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn-text btn-edit"
                            onClick={() => handleEdit(customer)}
                            aria-label="Edit customer"
                          >
                            <i className="fas fa-edit"></i> Edit
                          </button>
                          <button
                            className="btn-text btn-delete"
                            onClick={() => handleDelete(customer)}
                            aria-label="Delete customer"
                          >
                            <i className="fas fa-trash"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Mobile Card View */}
          <div className="mobile-view">
            {renderCustomerCards()}
          </div>
        </>
      )}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={isDeleteLoading}
        error={deleteError}
        entityName={customers?.find((c) => c.customerID === deleteId)?.customerName}
      />
    </section>
  );
};

export default CustomerList;

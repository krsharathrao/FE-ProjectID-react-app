import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/customer-form-3col.css';
import AsyncSelect from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';

const CustomerForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  customers,
  businessUnits,
  loading,
  errors = {},
}) => {
  // Example API shape:
  // {
  //   customerID: 1,
  //   customerName: 'Acme Corp',
  //   isActive: true,
  //   createdDate: '2023-07-22T00:00:00',
  //   createdByUserName: 'admin'
  // }
  const isEdit = !!initialData?.customerID;
  // Form state
  const [selectedCustomer, setSelectedCustomer] = useState(initialData?.customerID ? {
    label: initialData.customerName,
    value: initialData.customerID
  } : null);
  
  const [selectedBuid, setSelectedBuid] = useState(initialData?.assignedBUID ? {
    label: initialData.buName || '',
    value: initialData.assignedBUID
  } : null);
  
  const [formData, setFormData] = useState({
    customerName: initialData?.customerName || '',
    customerAbbreviation: initialData?.customerAbbreviation || '',
    customerCode: initialData?.customerCode || '',
    assignedBUID: initialData?.assignedBUID || '',
    gstDocumentPath: initialData?.gstDocumentPath || '',
    fullPostalAddress: initialData?.fullPostalAddress || '',
    city: initialData?.city || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    type: initialData?.type || '',
    isActive: typeof initialData?.isActive === 'boolean' ? initialData.isActive : true
  });
  
  // Get BU details based on selected BUID
  const getBUDetails = (buid) => {
    if (!buid) return { buName: '', buCode: '' };
    const bu = businessUnits.find(b => b.buid === buid);
    return {
      buName: bu?.buName || '',
      buCode: bu?.buCode || ''
    };
  };
  
  // Current BU details based on selected BUID
  const currentBUDetails = getBUDetails(selectedBuid?.value || formData.assignedBUID);

  useEffect(() => {
    if (initialData?.customerID) {
      setSelectedCustomer({
        label: initialData.customerName,
        value: initialData.customerID
      });
      
      setSelectedBuid(initialData.assignedBUID ? {
        label: initialData.buName || getBUDetails(initialData.assignedBUID).buName,
        value: initialData.assignedBUID
      } : null);
      
      setFormData({
        customerName: initialData.customerName || '',
        customerAbbreviation: initialData.customerAbbreviation || '',
        customerCode: initialData.customerCode || '',
        assignedBUID: initialData.assignedBUID || '',
        gstDocumentPath: initialData.gstDocumentPath || '',
        fullPostalAddress: initialData.fullPostalAddress || '',
        city: initialData.city || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        type: initialData.type || '',
        isActive: typeof initialData.isActive === 'boolean' ? initialData.isActive : true
      });
    } else {
      // Reset form for new customer
      setSelectedCustomer(null);
      setSelectedBuid(null);
      setFormData({
        customerName: '',
        customerAbbreviation: '',
        customerCode: '',
        assignedBUID: '',
        gstDocumentPath: '',
        fullPostalAddress: '',
        city: '',
        email: '',
        phone: '',
        type: '',
        isActive: true
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "gstDocumentPath" || name === "customerAbbreviation"){
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value.toUpperCase()
    }));
    return
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const buDetails = getBUDetails(selectedBuid?.value || formData.assignedBUID);
    
    onSubmit({
      id: initialData?.customerID,
      customerName: formData.customerName,
      customerAbbreviation: formData.customerAbbreviation.toUpperCase(),
      customerCode: formData.customerCode ||"Default",
      assignedBUID: selectedBuid?.value || '',
      buName: buDetails.buName,
      buCode: buDetails.buCode,
      gstDocumentPath: formData.gstDocumentPath,
      fullPostalAddress: formData.fullPostalAddress,
      city: formData.city,
      email: formData.email,
      phone: formData.phone,
      type: formData.type,
      isActive: formData.isActive,
    });
  };


  return (
    <div>
    <form onSubmit={handleSubmit} className="form-responsive customer-form-grid scrollable ">
      <div className="form-group">
        <label htmlFor="customerName">Name<span style={{ color: 'red' }}>*</span></label>
        <AsyncCreatableSelect
          inputId="customerName"
          cacheOptions
          defaultOptions={(customers || [])?.map((c) => ({
            label: c.customerName,
            value: c.customerID,
            customerAbbreviation: c.customerAbbreviation,
          }))}
          loadOptions={(inputValue) => {
            return new Promise((resolve) => {
              const filtered = (customers || [])
                ?.filter((c) => (c.customerName || '').toLowerCase().includes((inputValue || '').toLowerCase()))
                ?.map((c) => ({
                  label: c.customerName,
                  value: c.customerID,
                  customerAbbreviation: c.customerAbbreviation,
                }));
              resolve(filtered);
            });
          }}
          value={selectedCustomer}
          onChange={(newValue) => {
            if (!newValue) {
              setSelectedCustomer(null);
              setFormData((prev) => ({ ...prev, customerName: '', customerAbbreviation: '' }));
              return;
            }
            setSelectedCustomer(newValue);
            setFormData((prev) => ({
              ...prev,
              customerName: newValue.label || '',
              customerAbbreviation: newValue.customerAbbreviation || prev.customerAbbreviation,
            }));
          }}
          onCreateOption={(inputValue) => {
            const newOption = { label: inputValue, value: inputValue, __isNew__: true };
            setSelectedCustomer(newOption);
            setFormData((prev) => ({ ...prev, customerName: inputValue, customerAbbreviation: '' }));
          }}
          placeholder="Select existing customer or type to create..."
          isClearable
          isDisabled={loading}
          className={errors.customerName ? 'is-invalid' : ''}
          formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
        />
        {errors.customerName && (
          <div className="invalid-feedback">{errors.customerName}</div>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="customerAbbreviation">Abbreviation</label>
        <input
          id="customerAbbreviation"
          name="customerAbbreviation"
          type="text"
          className={`form-control ${errors.customerAbbreviation ? 'is-invalid' : ''}`}
          maxLength={4}
          value={formData.customerAbbreviation}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="Enter abbreviation..."
        />
        {errors.customerAbbreviation && <div className="invalid-feedback">{errors.customerAbbreviation}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="buName">BU Name</label>
        <AsyncSelect
          id="buName"
          name="buName"
          cacheOptions
          defaultOptions
          loadOptions={(inputValue) => {
            return new Promise((resolve) => {
              const filteredOptions = (businessUnits || [])
                ?.filter((businessUnit) =>
                  businessUnit.buName.toLowerCase().includes(inputValue.toLowerCase())
                )
                ?.map((businessUnit) => ({
                  label: businessUnit.buName,
                  value: businessUnit.buid
                }));
              resolve(filteredOptions);
            });
          }}
          value={selectedBuid}
          onChange={(newValue) => {
            setSelectedBuid(newValue);
            const buid = newValue?.value || '';
            setFormData(prev => ({
              ...prev,
              assignedBUID: buid
            }));
          }}
          placeholder="Search for BU names..."
          isClearable
          isDisabled={loading}
          className={errors.assignedBUID ? 'is-invalid' : ''}
        />
        {errors.assignedBUID && <div className="invalid-feedback">{errors.assignedBUID}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="assignedBUID">Assigned BUID</label>
        <input
          id="assignedBUID"
          type="text"
          className="form-control"
          value={selectedBuid?.value || ''}
          disabled
          readOnly
        />
        {errors.assignedBUID && <div className="invalid-feedback">{errors.assignedBUID}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="buCode">BU Code</label>
        <input
          id="buCode"
          type="text"
          className="form-control"
          value={currentBUDetails.buCode || ''}
          disabled
          readOnly
        />
        {errors.buCode && <div className="invalid-feedback">{errors.buCode}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="gstDocumentPath">GST Document Number</label>
        <input
          id="gstDocumentPath"
          name="gstDocumentPath"
          type="text"
          className={`form-control ${errors.gstDocumentPath ? 'is-invalid' : ''}`}
          value={formData.gstDocumentPath}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="Enter GST document number..."
        />
        {errors.gstDocumentPath && <div className="invalid-feedback">{errors.gstDocumentPath}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="fullPostalAddress">Full Postal Address</label>
        <textarea
          id="fullPostalAddress"
          name="fullPostalAddress"
          className={`form-control ${errors.fullPostalAddress ? 'is-invalid' : ''}`}
          value={formData.fullPostalAddress}
          onChange={handleInputChange}
          disabled={loading}
          rows={3}
          placeholder="Enter full postal address..."
        />
        {errors.fullPostalAddress && <div className="invalid-feedback">{errors.fullPostalAddress}</div>}
      </div>
      {/* <div className="form-group">
        <label htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          className={`form-control ${errors.city ? 'is-invalid' : ''}`}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={loading}
        />
        {errors.city && <div className="invalid-feedback">{errors.city}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="text"
          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
        />
        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="type">Type</label>
        <input
          id="type"
          type="text"
          className={`form-control ${errors.type ? 'is-invalid' : ''}`}
          value={type}
          onChange={(e) => setType(e.target.value)}
          disabled={loading}
        />
        {errors.type && <div className="invalid-feedback">{errors.type}</div>}
      </div> */}
      <div className="form-group">
        <label htmlFor="customerActive">Active</label>
        <select
          id="customerActive"
          className="form-control"
          value={formData.isActive ? 'true' : 'false'}
          onChange={(e) => 
            setFormData(prev => ({
              ...prev,
              isActive: e.target.value === 'true'
            }))
          }
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
 
    </form>
         <div className="form-actions" >
         <button 
           type="button" 
           className="btn btn-secondary" 
           onClick={onCancel} 
           disabled={loading}
         >
           Cancel
         </button>
         <button 
           type="submit" 
           className="btn btn-primary" 
           onClick={handleSubmit}
           disabled={loading || !formData.customerName || !selectedBuid}
         >
           {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
         </button>
       </div>
    </div>
  );
};

CustomerForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errors: PropTypes.object,
};

export default CustomerForm;

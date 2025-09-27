import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import './ProjectCreateModal.css';
import { getCustomers } from '../api/customerApi';
import { getBusinessUnits } from '../api/businessUnitApi';
import { fetchBillingTypes } from '../api/billingTypeApi';
import { getSegments } from '../api/segmentApi';
import { listProjects } from '../actions/projectActions';
import { getProjects } from '../api/projectsApi';

const initialState = {
  coreProjectID: null,
  projectName: '',
  projectAbbreviation: '',
  customerID: null,
  buid: null,
  billingTypeID: null,
  segmentID: null,
  projectLocationCity: '',
  customerAddress: '',
  projectStartDate: '',
  projectEndDate: '',
  resourceRequirement: '',
};

const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
};

const ProjectCreateModal = ({ open, onClose, onSubmit, loading, error, project, onCreate }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const isEditMode = !!project;

  console.log('project', project);
  useEffect(() => {
    const loadEditData = async () => {
      if (isEditMode && project) {
        try {
          const [customers, businessUnits, billingTypes, segments, Coreproject] = await Promise.all([
            getCustomers(),
            getBusinessUnits(),
            fetchBillingTypes(),
            getSegments(),
            getProjects()
          ]);
  
          const customer = customers.data.find(c => c.customerID === project.customerID);
          const businessUnit = businessUnits.data.find(b => b.buid === project.buid);
          const billingType = billingTypes.data.find(b => b.billingTypeID === project.billingTypeID);
          const segment = segments.data.find(s => s.segmentID === project.segmentID);
          const coreProject = Coreproject.data.find(c => c.coreProjectID === project.coreProjectID);
  
          setForm({
            ...project,
            coreProjectID: project.coreProjectID || coreProject?.coreProjectID || null,
            customerName: customer?.customerName || '',
            buName: businessUnit?.buName || '',
            billingTypeName: billingType?.billingTypeName || '',
            segmentName: segment?.segmentName || '',
            projectStartDate: formatDateForInput(project.projectStartDate),
            projectEndDate: formatDateForInput(project.projectEndDate),
            coreProject: coreProject
          });
        } catch (error) {
          console.error('Failed to load edit data:', error);
        }
      } else {
        setForm(initialState);
      }
    };
    loadEditData();
   
  }, [project, isEditMode, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error for the field while user is changing it
    setErrors((prev) => ({ 
      ...prev, 
      [name]: '',
      ...(name === 'projectStartDate' ? { projectEndDate: '' } : {})
    }));
  };

  const handleSelectChange = (selectedOption, { name }) => {

    console.log('handleSelectChange called:', { name });
    
    const nameFieldMap = {
      customerID: 'customerName',
      buid: 'buName',
      billingTypeID: 'billingTypeName',
      segmentID: 'segmentName',
      coreProjectID: 'projectName',
    };

    const next = {
      ...form,
      [name]: selectedOption ? selectedOption.value : null,
    };

    const labelField = nameFieldMap[name];
    if (labelField) {
      next[labelField] = selectedOption ? selectedOption.label : '';
    }

    if (name === 'coreProjectID') {
      console.log('Setting projectAbbreviation from:', selectedOption?.item);
      next.projectAbbreviation = selectedOption?.item?.projectAbbreviation || '';
      console.log('New projectAbbreviation:', next.projectAbbreviation);
    }

    // Clear customer selection when business unit changes
    if (name === 'buid') {
      next.customerID = null;
      next.customerName = '';
    }

    console.log('Updated form state:', next);
    setForm(next);
    // Clear error for the field while user is changing it
    setErrors((prev) => ({
      ...prev,
      [name]: '',
      ...(name === 'buid' ? { customerID: '' } : {})
    }));
  };

  // Utilities for validation
  const toDate = (yyyy_mm_dd) => {
    if (!yyyy_mm_dd) return null;
    // Normalize to local midnight to avoid TZ surprises
    const [y, m, d] = yyyy_mm_dd.split('-').map((n) => parseInt(n, 10));
    return new Date(y, (m || 1) - 1, d || 1);
  };

  const validateForm = (values) => {
    const v = values || form;
    const errs = {};

    if (!v.coreProjectID) errs.coreProjectID = 'Please select a Project Name.';
    if (!v.projectAbbreviation) errs.projectAbbreviation = 'Project abbreviation is required.';
    if (!v.buid) errs.buid = 'Please select a Business Unit.';
    if (!v.customerID) errs.customerID = 'Please select a Customer.';
    if (!v.billingTypeID) errs.billingTypeID = 'Please select a Billing Type.';
    if (!v.segmentID) errs.segmentID = 'Please select a Segment.';

    const startDate = toDate(v.projectStartDate);
    const endDate = toDate(v.projectEndDate);
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (!startDate) {
      errs.projectStartDate = 'Start date is required.';
    } else if (startDate < todayMidnight) {
      errs.projectStartDate = 'Start date cannot be in the past.';
    }

    if (!endDate) {
      errs.projectEndDate = 'End date is required.';
    } else if (startDate) {
      const minEnd = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      if (endDate < minEnd) {
        errs.projectEndDate = 'End date must be at least 14 days after the start date.';
      }
    }

    if (!v.resourceRequirement || String(v.resourceRequirement).trim() === '') {
      errs.resourceRequirement = 'Resource requirement is required.';
    }

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('form', form);

    // Validate before submit
    const nextErrors = validateForm(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    // the form data should be in below formate before submitting
    // {
    //   "projectName": "string",
    //   "projectAbbreviation": "stri",
    //   "customerID": 0,
    //   "buid": 0,
    //   "billingTypeID": 0,
    //   "segmentID": 0,
    //   "projectLocationCity": "string",
    //   "customerAddress": "string",
    //   "projectStartDate": "2025-07-24T07:18:44.722Z",
    //   "projectEndDate": "2025-07-24T07:18:44.722Z",
    //   "resourceRequirement": "string"
    // }

      // {
    //   "coreProject": {
    //     "projectName": "Github licenes",
    //     "projectAbbreviation": "GTHI"
    //   },
    //   "customerID": 6,
    //   "buid": 2,
    //   "billingTypeID": 2,
    //   "segmentID": 2,
    //   "projectLocationCity": "Bengaluru",
    //   "customerAddress": "WJWDKSD",
    //   "projectStartDate": "2025-09-15T18:06:08.321Z",
    //   "projectEndDate": "2025-09-15T18:06:08.321Z",
    //   "resourceRequirement": "rahul"
    // }

    const payload = {
      coreProject: {
        projectName: form.projectName,
        projectAbbreviation: form.projectAbbreviation
      },
      coreProjectID: Number(form.coreProjectID),
      customerID: Number(form.customerID),
      buid: Number(form.buid),
      billingTypeID: Number(form.billingTypeID),
      segmentID: Number(form.segmentID),
      projectLocationCity: form.projectLocationCity,
      customerAddress: form.customerAddress || "Default Address",
      projectStartDate: form.projectStartDate,
      projectEndDate: form.projectEndDate,
      resourceRequirement: form.resourceRequirement
    };
    if(isEditMode && project){
      onSubmit(payload);
    }else{
      onCreate(payload);
    }
  };

  // Helper to format a Date to YYYY-MM-DD for date input min attributes
  const toInputDateString = (d) => {
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Compute min dates for inputs (today for start, start+14d for end)
  const now = new Date();
  const todayLocalMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const minStartDateStr = toInputDateString(todayLocalMidnight);
  const startDateObj = toDate(form.projectStartDate);
  const minEndDateStr = startDateObj
    ? toInputDateString(new Date(startDateObj.getTime() + 14 * 24 * 60 * 60 * 1000))
    : undefined;

  const loadOptions = (apiCall, labelKey, valueKey) => async (inputValue) => {
    try {
      const { data } = await apiCall();
      return data
        ?.filter(item => (item[labelKey] || '').toLowerCase().includes((inputValue || '').toLowerCase()))
        ?.map(item => ({ label: item[labelKey], value: item[valueKey], item }));
    } catch (error) {
      console.error('Failed to load options:', error);
      return [];
    }
  };

  // Helper function to get BU details from BUID (similar to CustomerList)
  const getBUDetails = async (buid) => {
    try {
      const { data: businessUnits } = await getBusinessUnits();
      const businessUnit = businessUnits.find((bu) => bu.buid === buid);
      return {
        buName: businessUnit?.buName || 'N/A',
        buCode: businessUnit?.buCode || 'N/A'
      };
    } catch (error) {
      console.error('Failed to get BU details:', error);
      return { buName: 'N/A', buCode: 'N/A' };
    }
  };

  // Custom load options for customers filtered by a selected business unit
  const loadCustomerOptions = (selectedBuid) => async (inputValue = '') => {
    try {
      const { data: customers } = await getCustomers();
      if (!selectedBuid) return [];

      const selectedBuidNum = Number(selectedBuid);
      const filteredCustomers = (customers || [])?.filter((customer) => {
        const customerBuid = customer.assignedBUID;
        const nameMatch = (customer.customerName || '').toLowerCase().includes((inputValue || '').toLowerCase());
        return customerBuid === selectedBuidNum && nameMatch;
      });

      return filteredCustomers.map((customer) => ({
        label: customer.customerName,
        value: customer.customerID,
        item: customer,
      }));
    } catch (error) {
      console.error('Failed to load customer options:', error);
      return [];
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Project ID' : 'Create New Project ID'}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="project-form">
          
            <div className="form-group">
              <label htmlFor="buid">Business Unit<span style={{ color: 'red' }}>*</span></label>
              <AsyncSelect
                id="buid"
                name="buid"
                cacheOptions
                defaultOptions
                loadOptions={loadOptions(getBusinessUnits, 'buName', 'buid')}
                value={form.buid ? { 
                  label: form.buName || 'Loading...', 
                  value: form.buid 
                } : null}
                onChange={handleSelectChange}
                placeholder="Search for a business unit..."
                isClearable
              />
              {errors.buid && <div className="error">{errors.buid}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="customerID">Customer<span style={{ color: 'red' }}>*</span></label>
              <AsyncSelect
                key={`customer-${form.buid}`} // Force refresh when BU changes
                id="customerID"
                name="customerID"
                cacheOptions={false}
                defaultOptions={true}
                loadOptions={loadCustomerOptions(form.buid)}
                value={form.customerID ? { 
                  label: form.customerName || 'Loading...', 
                  value: form.customerID 
                } : null}
                onChange={handleSelectChange}
                placeholder={form.buid ? "Search for a customer..." : "Please select a Business Unit first"}
                isDisabled={!form.buid}
                isClearable
                noOptionsMessage={() => form.buid ? "No customers found for this Business Unit" : "Please select a Business Unit first"}
              />
              {!form.buid ? (
                <small className="text-muted">Select a Business Unit to see available customers</small>
              ) : (
                <small className="text-muted">Showing customers assigned to the selected Business Unit</small>
              )}
              {errors.customerID && <div className="error">{errors.customerID}</div>}
            </div>
          
            <div className="form-group">
              <label htmlFor="coreProjectID">Project Name</label>
              <AsyncSelect
                id="coreProjectID"
                name="coreProjectID"
                cacheOptions
                defaultOptions
                loadOptions={loadOptions(getProjects, 'projectName', 'coreProjectID')}
                value={form.coreProjectID ? { 
                  label: form.projectName || 'Loading...', 
                  value: form.coreProjectID 
                } : null}
                onChange={handleSelectChange}
                placeholder="Search for a project names..."
                isClearable
              />
              {errors.coreProjectID && <div className="error">{errors.coreProjectID}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="projectAbbreviation">Abbreviation (4 chars)</label>
              <input editable={false} disabled={true} id="projectAbbreviation" name="projectAbbreviation" value={form.projectAbbreviation} onChange={handleChange} maxLength={4} required />
              {errors.projectAbbreviation && <div className="error">{errors.projectAbbreviation}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="billingTypeID">Billing Type</label>
              <AsyncSelect
                id="billingTypeID"
                name="billingTypeID"
                cacheOptions
                defaultOptions
                loadOptions={loadOptions(fetchBillingTypes, 'billingTypeName', 'billingTypeID')}
                value={form.billingTypeID ? { 
                  label: form.billingTypeName || 'Loading...', 
                  value: form.billingTypeID 
                } : null}
                onChange={handleSelectChange}
                placeholder="Search for a billing type..."
                isClearable
              />
              {errors.billingTypeID && <div className="error">{errors.billingTypeID}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="segmentID">Segment</label>
              <AsyncSelect
                id="segmentID"
                name="segmentID"
                cacheOptions
                defaultOptions
                loadOptions={loadOptions(getSegments, 'segmentName', 'segmentID')}
                value={form.segmentID ? { 
                  label: form.segmentName || 'Loading...', 
                  value: form.segmentID 
                } : null} 
                onChange={handleSelectChange}
                placeholder="Search for a segment..."
                isClearable
              />
              {errors.segmentID && <div className="error">{errors.segmentID}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="projectStartDate">Start Date</label>
              <input id="projectStartDate" name="projectStartDate" value={form.projectStartDate} onChange={handleChange} type="date" min={minStartDateStr} required />
              {errors.projectStartDate && <div className="error">{errors.projectStartDate}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="projectEndDate">End Date</label>
              <input id="projectEndDate" name="projectEndDate" value={form.projectEndDate} onChange={handleChange} type="date" min={minEndDateStr} required />
              {errors.projectEndDate && <div className="error">{errors.projectEndDate}</div>}
            </div>
            <div className="form-group full-width">
              <label htmlFor="resourceRequirement">Resource Requirement</label>
              <input id="resourceRequirement" name="resourceRequirement" value={form.resourceRequirement} onChange={handleChange} />
              {errors.resourceRequirement && <div className="error">{errors.resourceRequirement}</div>}
            </div>
            {error && <div className="error">{error}</div>}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn primary" disabled={loading || !form.buid || !form.customerID}>{loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Project' : 'Create Project')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectCreateModal;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Loader from '../components/Loader';
import ProjectFilters from '../components/ProjectFilters';
import ProjectCard from '../components/ProjectCard';
import ProjectCreateModal from '../components/ProjectCreateModal';
import {
  getProjects,
  updateProject,
  generateProjectPID,
  adminApproveProject,
  adminRejectProject,
  superadminApproveProject,
  superadminRejectProject,
  deleteProject,
  submitProjectForSuperAdminReview
} from '../api/projectApi';
import { useSelector, useDispatch } from 'react-redux';
import { listCustomers } from '../actions/customerActions';
import { listBusinessUnits } from '../actions/businessUnitActions';
import { listBillingTypes } from '../actions/billingTypeActions';
import { listSegments } from '../actions/segmentActions';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import SuperAdminRemarksModal from '../components/SuperAdminRemarksModal';
import '../styles/ProjectsPage.css';

// Dummy: Replace with real auth/user context
const getUser = () => JSON.parse(localStorage.getItem('userInfo')) || {};

const ProjectsPage = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // project id
  const user = getUser();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const dispatch = useDispatch();

  // Filters & Sorting state
  const [filterValues, setFilterValues] = useState({
    customerID: '',
    buid: '',
    billingTypeID: '',
    segmentID: '',
    status: '',
    sortBy: 'createdDate',
    sortOrder: 'desc'
  });

  const handleFilterChange = (name, value) => {
    setFilterValues(prev => ({ ...prev, [name]: value }));
  };

  const handleFiltersReset = () => {
    setFilterValues({
      customerID: '',
      buid: '',
      billingTypeID: '',
      segmentID: '',
      status: '',
      sortBy: 'createdDate',
      sortOrder: 'desc'
    });
  };

  // Robust date parser to support multiple formats (ISO, yyyy-MM-dd, dd/MM/yyyy, dd-MM-yyyy),
  // .NET JSON dates like /Date(1695383393000)/, and numeric timestamps (seconds or ms)
  const parseDateToTime = (value) => {
    if (value == null) return 0;

    // If it's already a Date
    if (value instanceof Date) {
      const t = value.getTime();
      return Number.isNaN(t) ? 0 : t;
    }

    const str = String(value).trim();

    // .NET JSON date: /Date(1695383393000)/
    const dotNet = /Date\((\d+)\)/.exec(str);
    if (dotNet) {
      const ms = parseInt(dotNet[1], 10);
      return Number.isFinite(ms) ? ms : 0;
    }

    // Pure numeric (may be seconds or milliseconds)
    if (/^\d+$/.test(str)) {
      const num = parseInt(str, 10);
      if (!Number.isFinite(num)) return 0;
      // Heuristic: < 1e12 -> seconds; else ms
      return num < 1e12 ? num * 1000 : num;
    }

    // Native parse (handles ISO and many standard formats)
    const native = Date.parse(str);
    if (!Number.isNaN(native)) return native;

    // Try dd/MM/yyyy or dd-MM-yyyy with optional time HH:mm[:ss]
    const m1 = /^(\d{2})[\/\-](\d{2})[\/\-](\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(str);
    if (m1) {
      const [, dd, mm, yyyy, HH = '00', MM = '00', SS = '00'] = m1;
      const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(HH), Number(MM), Number(SS));
      const t = d.getTime();
      return Number.isNaN(t) ? 0 : t;
    }

    // Try yyyy/MM/dd or yyyy-MM-dd with optional time HH:mm[:ss]
    const m2 = /^(\d{4})[\/\-](\d{2})[\/\-](\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(str);
    if (m2) {
      const [, yyyy, mm, dd, HH = '00', MM = '00', SS = '00'] = m2;
      const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(HH), Number(MM), Number(SS));
      const t = d.getTime();
      return Number.isNaN(t) ? 0 : t;
    }

    // Try mm/dd/yyyy or mm-dd-yyyy with optional time HH:mm[:ss]
    const m3 = /^(\d{2})[\/\-](\d{2})[\/\-](\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(str);
    if (m3) {
      const [, mm, dd, yyyy, HH = '00', MM = '00', SS = '00'] = m3;
      const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(HH), Number(MM), Number(SS));
      const t = d.getTime();
      return Number.isNaN(t) ? 0 : t;
    }

    return 0;
  };

  // Find a created date-like field on the project object and return timestamp
  const getCreatedTimestamp = (obj) => {
    if (!obj || typeof obj !== 'object') return 0;
    const candidates = [
      'createdDate', 'CreatedDate', 'created_date', 'createdDateTime', 'CreatedDateTime',
      'createdAt', 'CreatedAt', 'created_at', 'createdOn', 'CreatedOn', 'created_on',
      'created', 'Created', 'creationDate', 'CreationDate', 'creation_time', 'creationTime',
      'createdTimestamp', 'CreatedTimestamp', 'created_time', 'created_time_utc'
    ];
    for (const key of candidates) {
      if (obj[key] != null) {
        const t = parseDateToTime(obj[key]);
        if (t) return t;
      }
    }
    return 0;
  };

  // Unique statuses derived from current projects
  const statusOptions = useMemo(() => {
    const set = new Set();
    projects.forEach(p => p?.status && set.add(p.status));
    return Array.from(set);
  }, [projects]);

  // Compute filtered and sorted projects
  const filteredSortedProjects = useMemo(() => {
    const { customerID, buid, billingTypeID, segmentID, status, sortBy, sortOrder } = filterValues;
    let list = Array.isArray(projects) ? [...projects] : [];

    if (customerID) list = list?.filter(p => String(p.customerID) === String(customerID));
    if (buid) list = list?.filter(p => String(p.buid) === String(buid));
    if (billingTypeID) list = list?.filter(p => String(p.billingTypeID) === String(billingTypeID));
    if (segmentID) list = list?.filter(p => String(p.segmentID) === String(segmentID));
    if (status) list = list?.filter(p => (p.status || '') === status);

    // Precompute created timestamp once to avoid repeated parsing and ensure consistency
    list = list.map(p => ({ ...p, __createdTs: getCreatedTimestamp(p) }));

    const dir = sortOrder === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      const getVal = (obj) => {
        switch (sortBy) {
          case 'createdDate': {
            return obj.__createdTs || 0;
          }
          case 'projectName': return (obj?.projectName || '').toLowerCase();
          case 'customerName': return (obj?.customerName || '').toLowerCase();
          case 'buName': return (obj?.buName || '').toLowerCase();
          case 'status': return (obj?.status || '').toLowerCase();
          default: return 0;
        }
      };
      const va = getVal(a);
      const vb = getVal(b);
      if (typeof va === 'number' && typeof vb === 'number') {
        // Normalize NaN to 0 to keep comparator deterministic
        const na = Number.isNaN(va) ? 0 : va;
        const nb = Number.isNaN(vb) ? 0 : vb;
        const cmp = (na - nb) * dir;
        if (cmp !== 0) return cmp;
        // If sorting by createdDate and timestamps are equal/zero, fall back to projectInternalID
        if (sortBy === 'createdDate') {
          const ida = Number(a?.projectInternalID) || 0;
          const idb = Number(b?.projectInternalID) || 0;
          return (ida - idb) * dir;
        }
        return 0;
      }
      // String compare
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });

    return list;
  }, [projects, filterValues]);

  

  const customerList = useSelector((state) => state.customerList);
  const { customers } = customerList;

  const businessUnitList = useSelector((state) => state.businessUnitList);
  const { businessUnits } = businessUnitList;

  const billingTypeList = useSelector((state) => state.billingTypeList);
  const { billingTypes } = billingTypeList;

  const segmentList = useSelector((state) => state.segmentList);
  const { segments } = segmentList;

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getProjects();
      if (Array.isArray(data)) {
        const enrichedProjects = data.map((project) => {
          const customer = customers.find((c) => c.customerID === project.customerID);
          const bu = businessUnits.find((b) => b.buid === project.buid);
          const billingType = billingTypes.find((bt) => bt.billingTypeID === project.billingTypeID);
          const segment = segments.find((s) => s.segmentID === project.segmentID);
          return {
            ...project,
            customerName: customer ? customer.customerName : '',
            customerAbbreviation: customer ? customer.customerAbbreviation : '',
            customerCode: customer ? customer.customerCode : '',
            buName: bu ? bu.buName : '',
            buCode: bu ? bu.buCode : '',
            billingTypeName: billingType ? billingType.billingTypeName : '',
            billingTypeCode: billingType ? billingType.billingTypeCode : '',
            segmentName: segment ? segment.segmentName : '',
          };
        });
        setProjects(enrichedProjects);
      } else {
        setProjects([]);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [customers, businessUnits, billingTypes, segments]);

  useEffect(() => {
    dispatch(listCustomers());
    dispatch(listBusinessUnits());
    dispatch(listBillingTypes());
    dispatch(listSegments());
  }, [dispatch]);

  useEffect(() => {
    if (customers.length > 0 && businessUnits.length > 0 && billingTypes.length > 0 && segments.length > 0) {
      loadProjects();
    }
  }, [loadProjects, customers, businessUnits, billingTypes, segments]);

  const handleEdit = (project) => {
    setShowCreate(true);
    setSelectedProject(project);
  };
  const handleUpdate = async (project) => {
    setActionLoading(project.projectInternalID);
    setError(''); setSuccess('');
    try {
      await updateProject(project.coreProjectID, project);
      setShowCreate(false);
      loadProjects();
    } catch (e) {
      setError(e.message);
    }
    setActionLoading(null);
  };
  const handleGeneratePID = async (project) => {
    setActionLoading(project.projectInternalID);
    setError(''); setSuccess('');
    try { 
      await generateProjectPID(project.coreProjectID);
      setSuccess('PID generated successfully.');
      setSelectedProject(null);
      loadProjects();
    } catch (e) {
      setError(e.message);
    }
    setActionLoading(null);
  };
  const onSubmitForSuperAdminReview = async (project) => {
    setActionLoading(project.projectInternalID);
    setError(''); setSuccess('');
    try {
      await submitProjectForSuperAdminReview(project.coreProjectID);
      setSelectedProject(null);
      loadProjects();
    } catch (e) {
      setError(e.message);
    }
    setActionLoading(null);
  };
  const handleAdminApprove = async (project) => {
    setActionLoading(project.projectInternalID);
    setError(''); setSuccess('');
    try {
      await adminApproveProject(project.coreProjectID, 'Approved by admin');
      setSuccess('Project approved by admin.');
      setSelectedProject(null);
      loadProjects(); 
    } catch (e) {
      setError(e.message);
    }
    setActionLoading(null);
  };
  const handleAdminReject = async (project) => {
    setActionLoading(project.projectInternalID);
    setError(''); setSuccess('');
    try {
      await adminRejectProject(project.projectInternalID, 'Rejected by admin');
      setSuccess('Project rejected by admin.');
      setSelectedProject(null);
      loadProjects();
    } catch (e) {
      setError(e.message);
    }
    setActionLoading(null);
  };
  // Super Admin Remarks Modal State
  const [showSuperAdminRemarksModal, setShowSuperAdminRemarksModal] = useState(false);
  const [superAdminActionType, setSuperAdminActionType] = useState(null); // 'approve' or 'reject'
  const [superAdminActionLoading, setSuperAdminActionLoading] = useState(false);
  const [superAdminActionProject, setSuperAdminActionProject] = useState(null);

  const handleSuperadminApprove = async (project, remarks = 'Approved by superadmin') => {
    setActionLoading(project.projectInternalID);
    setSuperAdminActionLoading(true);
    setError(''); setSuccess('');
    try {
      await superadminApproveProject(project.coreProjectID, remarks);
      setSuccess('Project approved by superadmin.');
      setSelectedProject(null);
      loadProjects();
    } catch (e) {
      setError(e.message);
    }
    setActionLoading(null);
    setSuperAdminActionLoading(false);
    setShowSuperAdminRemarksModal(false);
    setSuperAdminActionProject(null);
    setSuperAdminActionType(null);
  };

  const handleSuperadminReject = async (project, remarks = 'Rejected by superadmin') => {
    setActionLoading(project.projectInternalID);
    setSuperAdminActionLoading(true);
    setError(''); setSuccess('');
    try {
      await superadminRejectProject(project.coreProjectID, remarks);
      setSuccess('Project rejected by superadmin.');
      setSelectedProject(null);
      loadProjects();
    } catch (e) {
      setError(e.message);
    }
    setActionLoading(null);
    setSuperAdminActionLoading(false);
    setShowSuperAdminRemarksModal(false);
    setSuperAdminActionProject(null);
    setSuperAdminActionType(null);
  };

  // Open modal for approve/reject
  const openSuperAdminRemarksModal = (project, actionType) => {
    setSuperAdminActionProject(project);
    setSuperAdminActionType(actionType);
    setShowSuperAdminRemarksModal(true);
  };

  // On modal submit
  const handleSuperAdminRemarksSubmit = (remarks) => {
    if (superAdminActionType === 'approve') {
      handleSuperadminApprove(superAdminActionProject, remarks);
    } else if (superAdminActionType === 'reject') {
      handleSuperadminReject(superAdminActionProject, remarks);
    }
  };

  const handleDeleteConfirm = async(project)=>{
    setDeleteLoading(true);
    setActionLoading(project.projectInternalID);
    setError(''); setSuccess('');
    try {
      await deleteProject(project.projectInternalID);
      setSelectedProject(null);
    setShowDeleteModal(false);

      loadProjects();
    } catch (e) {
      setError(e.message);
    }
    setActionLoading(null);
    setDeleteLoading(false);
  } 

  const handleOpenDeleteModal = (project) => {
    setShowDeleteModal(true);
    setSelectedProject(project);
  };


  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Projects ID</h1>
        {(user.role === 'Admin' || user.role === 'SuperAdmin') && (
          <button 
            className="btn btn-add" 
            onClick={() => {setShowCreate(true); setSelectedProject(null)}}
            style={{ marginLeft: 'auto' }}
          >
            Add Project
          </button>
        )}
      </div>
      <ProjectFilters
        customers={customers}
        businessUnits={businessUnits}
        billingTypes={billingTypes}
        segments={segments}
        statuses={statusOptions}
        values={filterValues}
        sortBy={filterValues.sortBy}
        sortOrder={filterValues.sortOrder}
        onChange={handleFilterChange}
        onReset={handleFiltersReset}
      />
      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {setShowDeleteModal(false); setDeleteLoading(false);}}
          onConfirm={() => handleDeleteConfirm(selectedProject)}
          loading={deleteLoading}
          entityName={selectedProject?.projectName}
        />
      )}
      {showSuperAdminRemarksModal && (
        <SuperAdminRemarksModal
          isOpen={showSuperAdminRemarksModal}
          onClose={() => setShowSuperAdminRemarksModal(false)}
          onSubmit={handleSuperAdminRemarksSubmit}
          loading={superAdminActionLoading}
          actionType={superAdminActionType}
          project={superAdminActionProject}
        />
      )}
      <ProjectCreateModal
      project={selectedProject}
        open={showCreate}
        onClose={() => { setShowCreate(false); setCreateError(''); }}
        onCreate={async (form) => {
          setCreateLoading(true);
          setCreateError('');
          try {
            // convert IDs to numbers if needed
            const payload = {
              ...form,
              customerID: Number(form.customerID),
              buid: Number(form.buid),
              billingTypeID: Number(form.billingTypeID),
              segmentID: Number(form.segmentID)
            };
            await require('../api/projectApi').createProject(payload);
            setShowCreate(false);
            setSuccess('Project created successfully.');
            setSelectedProject(null);
            loadProjects();
          } catch (e) {
            setCreateError(e.message);
          }
          setCreateLoading(false);
        }}
        loading={createLoading}
        error={createError}
        onSubmit={handleUpdate}
      />
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignSelf: 'center',
          height: '300px',
          width: '100%'
        }}>
          <Loader text="Loading projects..." />
        </div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="projects-list">
          {filteredSortedProjects.length === 0 ? (
            <div style={{ padding: '1rem', color: '#666' }}>No projects match the selected filters.</div>
          ) : (
            filteredSortedProjects.map((project) => (
              <ProjectCard
                key={project.projectInternalID}
                project={project}
                role={user.role}
                onEdit={handleEdit}
                onDelete={handleOpenDeleteModal}
                onUpdate={handleUpdate}
                onGeneratePID={handleGeneratePID}
                onSubmitForSuperAdminReview={onSubmitForSuperAdminReview}
                onAdminApprove={handleAdminApprove}
                onAdminReject={handleAdminReject}
                onSuperadminApprove={() => openSuperAdminRemarksModal(project, 'approve')}
                onSuperadminReject={() => openSuperAdminRemarksModal(project, 'reject')}
                loading={actionLoading === project.projectInternalID}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;

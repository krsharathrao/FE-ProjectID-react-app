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
import ProjectForm from '../components/ProjectForm';
import { createProjectAction, deleteProjectAction, listProjects, updateProjectAction } from '../actions/projectActions';
import '../styles/ProjectsCreatePage.css';
import Loader from '../components/Loader';

const ProjectsCreatePage = () => {
  const dispatch = useDispatch();
  const projectList = useSelector((state) => state.projectList);
  const { loading, projects, error } = projectList;

  const projectCreate = useSelector((state) => state.projectCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate } = projectCreate;

  const projectUpdate = useSelector((state) => state.projectUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = projectUpdate;

  const projectDelete = useSelector((state) => state.projectDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = projectDelete;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [searchProject, setSearchProject] = useState('');

  useEffect(() => {
    dispatch(listProjects());
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
    setDeleteId(bu.coreProjectID);
    setDeleteError(null);
    setDeleteSuccess(false);
  };
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleteLoading(true);
    try {
      await dispatch(deleteProjectAction(deleteId));
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
      dispatch(updateProjectAction(selectedBusinessUnit.coreProjectID, formData));
      setIsModalOpen(false);
    } else {
      dispatch(createProjectAction(formData));
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

  const filteredProjects = projects?.filter((p) => (p.projectName || '').toLowerCase().includes(searchProject.toLowerCase()));

  const renderBusinessUnitCards = () => (
    <div className="businessunit-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', height: 'calc(100vh - 200px)' }}>
      {filteredProjects.map((bu) => (
        <div
          key={bu.coreProjectID}
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
            <div style={{ flex: 1, minWidth: 120 }}><strong>ID:</strong> {bu.coreProjectID}</div>
            {/* <div style={{ flex: 1, minWidth: 120 }}><strong>Code:</strong> {bu.buCode}</div> */}
            <div style={{ flex: 1, minWidth: 120 }}><strong>Name:</strong> {bu.projectName}</div>
          </div>
          <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
          <div style={{ flex: 1, minWidth: 120 }}><strong>Customer Code Start Series:</strong> {bu.projectAbbreviation}</div>
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
        <div className="projects-header">
          <h1>Projects</h1>
          <div className="projects-controls">
            <div className="search-inputs">
              <div className="search-input-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search Project Name"
                  value={searchProject}
                  onChange={(e) => setSearchProject(e.target.value)}
                  className="form-control search-input"
                />
              </div>
            </div>
            <div className="add-button-container" style={{marginTop:20}}>
              <button className="btn btn-add" onClick={handleAdd}>
                <i className="fas fa-plus"></i>
                <span>Add Project</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={selectedBusinessUnit ? 'Edit Project' : 'Add Project'}>
        <ProjectForm
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
          <Loader text="Loading Core projects..." />
        </div>
      ) : error ? (
        renderErrors(error)
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="desktop-view">
            <div className="projects-table-wrapper">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    {/* <th>Code</th> */}
                    <th>Name</th>
                    
                    <th>Abbreviation</th>
                    <th>Active</th>
                    <th>Created Date</th>
                    {/* <th>Created By</th> */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((bu) => (
                    <tr key={bu.coreProjectID}>
                      <td>{bu.coreProjectID}</td>
                      {/* <td>{bu.buCode}</td> */}
                      <td>{bu.projectName}</td>
                      <td>{bu.projectAbbreviation}</td>
                      <td>{bu.isActive ? 'Yes' : 'No'}</td>
                      <td>{formatDate(bu.createdDate)}</td>
                      {/* <td>{bu.createdByUserName}</td> */}
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
        entityName={projects?.find((bu) => bu.coreProjectID === deleteId)?.projectName}
      />
    </section>
  );
};

export default ProjectsCreatePage;

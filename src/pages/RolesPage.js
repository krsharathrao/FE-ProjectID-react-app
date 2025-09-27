import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listRoles, createRole, updateRole, deleteRole } from '../actions/roleActions';
import { ROLE_CREATE_RESET, ROLE_UPDATE_RESET } from '../constants/roleConstants';
import Modal from '../components/Modal';
import RoleForm from '../components/RoleForm';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Loader from '../components/Loader';

const RolesPage = () => {
  const dispatch = useDispatch();

  const { loading, error, roles } = useSelector((state) => state.roleList);
  const { loading: loadingCreate, error: errorCreate, success: successCreate } = useSelector((state) => state.roleCreate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = useSelector((state) => state.roleUpdate);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [deleteRoleId, setDeleteRoleId] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Initial data fetch
  useEffect(() => {
    dispatch(listRoles());
  }, [dispatch]);

  // Handle successful role creation or update
  useEffect(() => {
    if (successCreate || successUpdate) {
      // Close the modal first
      setIsModalOpen(false);
      
      // Refresh the roles list
      dispatch(listRoles());
      
      // Reset the create/update state to prevent this from running again
      if (successCreate) dispatch({ type: ROLE_CREATE_RESET });
      if (successUpdate) dispatch({ type: ROLE_UPDATE_RESET });
    }
  }, [dispatch, successCreate, successUpdate]);

  const handleAddRole = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleDelete = (role) => {
    setDeleteRoleId(role.roleId);
    setSelectedRole(role)
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRoleId) return;
    setIsDeleteLoading(true);
    const result = await dispatch(deleteRole(deleteRoleId));
    setIsDeleteLoading(false);
    
    // If delete was successful, refresh the roles list
    if (result && result.success) {
      dispatch(listRoles());
    }
    
    setDeleteRoleId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteRoleId(null);
    setIsDeleteLoading(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const handleFormSubmit = (formData) => {
    if (selectedRole) {
      dispatch(updateRole(selectedRole.roleId, formData));
    } else {
      dispatch(createRole(formData));
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

  // Mobile card view renderer for roles
  const renderRoleCards = () => (
    <div className="role-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', height: 'calc(100vh - 200px)' }}>
      {roles.map((role) => (
        <div key={role.roleId} className="role-card">
          <div className="role-info">
            <div className="role-header">
              <div className="role-name">{role.roleName}</div>
              <span className={`status-badge status-${role.isActive ? 'active' : 'inactive'}`}>
                {role.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="role-details">
              <div className="role-detail">
                <span className="detail-label">Role ID:</span>
                <span className="detail-value">{role.roleId}</span>
              </div>
            </div>
          </div>
          <div className="role-actions">
            <button 
              className="btn-text btn-edit"
              onClick={() => handleEdit(role)}
              aria-label="Edit role"
            >
              <i className="fas fa-edit"></i> Edit
            </button>
            <button 
              className="btn-text btn-delete"
              onClick={() => handleDelete(role)}
              aria-label="Delete role"
            >
              <i className="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section>
    {!error && 
    <div style={{ 
          display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%', 
        marginBottom: '10px'
      }}>
      <h1>Roles</h1>
    <div className="add-button-container" style={{width: '60%', marginTop: 20}}>
        <button className="btn btn-add" onClick={handleAddRole}>Add Role</button>
      </div>
    </div>
}
      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={selectedRole ? 'Edit Role' : 'Add Role'}>
        <RoleForm
          isEditMode={!!selectedRole}
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
          initialData={selectedRole}
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
          <Loader text="Loading roles..." />
        </div>
      ) : error ? (
        renderErrors(error)
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="desktop-view">
            <table className="role-table">
              <thead>
                <tr>
                  <th>RoleID</th>
                  <th>Role Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.roleId}>
                    <td>{role.roleId}</td>
                    <td>{role.roleName}</td>
                    <td>
                      <span className={`status-badge status-${role.isActive ? 'active' : 'inactive'}`}>
                        {role.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {role.roleName !== "SuperAdmin" && (  
                         <div className="table-actions">
                        <button 
                          className="btn-text btn-edit"
                          onClick={() => handleEdit(role)}
                          aria-label="Edit role"
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button 
                          className="btn-text btn-delete"
                          onClick={() => handleDelete(role)}
                          aria-label="Delete role"
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Card View */}
          <div className="mobile-view">
            {renderRoleCards()}
          </div>
        </>
      )}
      {/** Delete Role Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteRoleId}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={isDeleteLoading}
        entityName={selectedRole?.roleName}
      />
    </section>
  );
};

export default RolesPage;


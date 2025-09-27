import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers, createUser, updateUser, deleteUser } from '../actions/userActions';
import { listRoles } from '../actions/roleActions';
import { USER_CREATE_RESET, USER_UPDATE_RESET } from '../constants/userConstants';
import Modal from '../components/Modal';
import UserForm from '../components/UserForm';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Loader from '../components/Loader';

const UsersPage = () => {
  const dispatch = useDispatch();

  const { loading, error, users } = useSelector((state) => state.userList);
  const { roles } = useSelector((state) => state.roleList);
  const { loading: loadingCreate, error: errorCreate, success: successCreate } = useSelector((state) => state.userCreate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = useSelector((state) => state.userUpdate);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Effect to fetch initial data when the component mounts
  useEffect(() => {
    dispatch(listUsers());
    dispatch(listRoles()); // Also fetch roles for the form dropdown
  }, [dispatch]);

  // Effect to handle successful user creation or update
  useEffect(() => {
    // If a create or update operation was successful, refresh the user list
    if (successCreate || successUpdate) {
      // Close the modal first
      handleModalClose();
      
      // Refresh the user list
      dispatch(listUsers());
      
      // Reset the create/update state to prevent this from running again
      if (successCreate) dispatch({ type: USER_CREATE_RESET });
      if (successUpdate) dispatch({ type: USER_UPDATE_RESET });
    }
  }, [dispatch, successCreate, successUpdate]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user) => {
    setDeleteUserId(user.userId);
    setSelectedUser(user)
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUserId) return;
    setIsDeleteLoading(true);
    const result = await dispatch(deleteUser(deleteUserId));
    setIsDeleteLoading(false);
    
    // If delete was successful, refresh the user list
    if (result && result.success) {
      dispatch(listUsers());
    }
    
    setDeleteUserId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteUserId(null);
    setIsDeleteLoading(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleFormSubmit = (formData) => {
    if (selectedUser) {
      dispatch(updateUser(selectedUser.userId, formData));
    } else {
      dispatch(createUser(formData));
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

  // Mobile card view renderer
  const renderUserCards = () => (
    <div className="user-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', height: 'calc(100vh - 200px)' }}>
      {users.map((user) => {
        const userRole = user.role || 
          (user.roleId && Array.isArray(roles) && 
           roles.find(r => r.roleId === user.roleId)?.roleName) || '-';
        
        return (
          <div key={user.userId} className="user-card">
            <div className="user-info">
              <span className="info-label">Username</span>
              <div className="username">{user.username}</div>
            </div>
            
            <div className="user-info">
              <span className="info-label">Email</span>
              <div className="info-value">{user.email}</div>
            </div>
            
            <div className="user-info">
              <span className="info-label">Role</span>
              <div className="info-value">{userRole}</div>
            </div>
            
            <div className="user-info">
              <span className="info-label">Status</span>
              <div className="info-value">
                <span className={`status-badge status-${user.isActive ? 'active' : 'inactive'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            {userRole !== "SuperAdmin" && (
  <div className="user-actions">
    <button 
      className="btn-text btn-edit"
      onClick={() => handleEdit(user)}
      aria-label="Edit user"
    >
      <i className="fas fa-edit" /> Edit
    </button>
    <button 
      className="btn-text btn-delete"
      onClick={() => handleDelete(user)}
      aria-label="Delete user"
    >
      <i className="fas fa-trash" /> Delete
    </button>
  </div>
)}
          </div>
        );
      })}
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
      <h1>Users</h1>
    <div className="add-button-container" style={{width: '60%', marginTop: 20}}>
        <button className="btn btn-add" onClick={handleAddUser}>Add User</button>
      </div>
    </div>
}

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={selectedUser ? 'Edit User' : 'Add User'}>
        <UserForm
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
          initialData={selectedUser}
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
        <Loader text="Loading users..." />
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
                  <th>UserID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const userRole = user.role || 
                                   (user.roleId && Array.isArray(roles) && 
                                    roles.find(r => r.roleId === user.roleId)?.roleName) || '-';

                  return (
                    <tr key={user.userId}>
                      <td data-label="UserID">{user.userId}</td>
                      <td data-label="Username">{user.username}</td>
                      <td data-label="Email">{user.email}</td>
                      <td data-label="Role">{userRole}</td>
                      <td data-label="Status">
                        <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td data-label="Actions">
                        {userRole !== 'SuperAdmin' && (
                          <div className="table-actions">
                            <button 
                              className="btn-text btn-edit"
                              onClick={() => handleEdit(user)}
                              aria-label="Edit user"
                            >
                              <i className="fas fa-edit"></i> Edit
                            </button>
                            <button 
                              className="btn-text btn-delete"
                              onClick={() => handleDelete(user)}
                              aria-label="Delete user"
                            >
                              <i className="fas fa-trash"></i> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Card View */}
          <div className="mobile-view">
            {renderUserCards()}
          </div>
        </>
      )}
      
      <DeleteConfirmModal
        isOpen={!!deleteUserId}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={isDeleteLoading}
        entityName={selectedUser?.username}
      />
    </section>
  );
};

export default UsersPage;

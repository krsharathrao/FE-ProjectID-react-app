import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../actions/authActions';

const Layout = ({ children, title }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const getUser =()=>{
    const user = JSON.parse(localStorage.getItem('userInfo')) || {};
    return user;
  }
  const user = getUser();
    const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`} style={{ display: 'flex', minHeight: '100vh' }}>
      <button className="hamburger-btn" onClick={toggleSidebar} aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}>
  {isSidebarOpen ? (
    // Cross (close) icon
    <svg width="24" height="24" viewBox="0 0 24 24">
      <line x1="5" y1="5" x2="19" y2="19" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      <line x1="19" y1="5" x2="5" y2="19" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ) : (
    // Hamburger icon (three bars)
    <svg width="24" height="24" viewBox="0 0 24 24">
      <rect y="4" width="24" height="2" rx="1" fill="#fff"/>
      <rect y="11" width="24" height="2" rx="1" fill="#fff"/>
      <rect y="18" width="24" height="2" rx="1" fill="#fff"/>
    </svg>
  )}
</button>
      <div className="mobile-overlay" onClick={toggleSidebar}></div>
   
      <aside className="sidebar">
      
        <nav>
        <h3>PID</h3>
        <h3>Generator Tool</h3>
          <ul onClick={toggleSidebar}>
            {user.role === "SuperAdmin" && (
              <>
                <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                <li><NavLink to="/users">User Management</NavLink></li>
                <li><NavLink to="/roles">Role Management</NavLink></li>
                <li><NavLink to="/billing-types">Billing Type Management</NavLink></li>
            <li><NavLink to="/business-units">Business Unit Management</NavLink></li>
            <li><NavLink to="/segments">Segment Management</NavLink></li>
            <li><NavLink to="/customers">Customer Management</NavLink></li>
            <li><NavLink to="/projects">Projects</NavLink></li>
   <li><NavLink to="/projects-id-generator">Projects ID Generator</NavLink></li>
              </>
            )}
          
 {user.role === "Admin" &&         <>           
            <li><NavLink to="/billing-types">Billing Type Management</NavLink></li>
            <li><NavLink to="/business-units">Business Unit Management</NavLink></li>
            <li><NavLink to="/segments">Segment Management</NavLink></li>
            <li><NavLink to="/customers">Customer Management</NavLink></li>
            <li><NavLink to="/projects">Projects</NavLink></li>
          <li><NavLink to="/projects-id-generator">Projects ID Generator</NavLink></li>

            </> 
}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <a href="#!" onClick={handleLogout}>Logout</a>
        </div>
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '1rem 2rem 0.5rem 2rem',
            backgroundColor: '#2c3e50',
            minHeight: '64px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div className="profile-avatar">
              {user.username ? user?.username?.charAt(0).toUpperCase() : '?'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="profile-name" style={{ marginLeft: '0.75rem' }}>
              {user.username || ''}
            </span>
            <span className="profile-role" style={{ marginLeft: '0.75rem' }}>
              {user.role || ''}
            </span>
            </div>
          </div>
        </div>
        {/* Main content below top bar */}
        <main className="main-content" style={{ flex: 1 }}>
          {children}
        </main>
      </div>
      <style>{`
        .profile-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: #fff;
          border: 2px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0;
          box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
        }
        .profile-role {
          font-size: 0.7rem;
          color: #fff;
          text-transform: capitalize;
          letter-spacing: 0.5px;
          font-weight: 500;
        }
        .profile-name {
          font-size: 0.9rem;
          color: #fff;
          text-transform: capitalize;
          letter-spacing: 0.5px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Layout;

import React from 'react';

const DashboardPage = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return (
    <section>
      <h2>Welcome, {userInfo?.username}!</h2>
      <p>This is the main dashboard. The core functionality for creating and managing Project IDs will be displayed here.</p>
      <div className="placeholder">
        <h3>Project ID Management</h3>
        <p>Feature coming soon...</p>
      </div>
    </section>
  );
};

export default DashboardPage;

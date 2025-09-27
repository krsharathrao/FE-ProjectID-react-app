import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RolesPage from './pages/RolesPage';
import UsersPage from './pages/UsersPage';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import BillingTypeList from './pages/BillingTypeList';
import BusinessUnitList from './pages/BusinessUnitList';
import SegmentList from './pages/SegmentList';
import CustomerList from './pages/CustomerList';
import ProjectsPage from './pages/ProjectsPage';
import './styles/ProjectsPage.css';
import ProjectsCreatePage from './pages/ProjectsCreatePage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Layout title="Dashboard"><DashboardPage /></Layout>} />
        <Route path="/users" element={<Layout title="User Management"><UsersPage /></Layout>} />
        <Route path="/roles" element={<Layout title="Role Management"><RolesPage /></Layout>} />
        <Route path="/billing-types" element={<Layout title="Billing Type Management"><BillingTypeList /></Layout>} />
        <Route path="/business-units" element={<Layout title="Business Unit Management"><BusinessUnitList /></Layout>} />
        <Route path="/segments" element={<Layout title="Segment Management"><SegmentList /></Layout>} />
        <Route path="/customers" element={<Layout title="Customer Management"><CustomerList /></Layout>} />
        <Route path="/projects" element={<Layout title="Projects"><ProjectsCreatePage /></Layout>} />
        <Route path="/projects-id-generator" element={<Layout title="Projects"><ProjectsPage /></Layout>} />
      </Route>
    </Routes>
  );
}

export default App;


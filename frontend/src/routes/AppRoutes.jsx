import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";

import Dashboard from "../pages/dashboard/Dashboard";
import UserList from "../pages/users/UserList";
import UserForm from "../pages/users/UserForm";
import UserDetails from "../pages/users/UserDetails";

import RoleList from "../pages/roles/RoleList";
import RoleForm from "../pages/roles/RoleForm";
import RoleDetails from "../pages/roles/RoleDetails";

import LeadList from "../pages/leads/LeadList";
import LeadForm from "../pages/leads/LeadForm";
import LeadDetails from "../pages/leads/LeadDetails";

import DealList from "../pages/deals/DealList";
import DealForm from "../pages/deals/DealForm";
import DealDetails from "../pages/deals/DealDetails";

import SalesList from "../pages/sales/SalesList";
import SalesForm from "../pages/sales/SalesForm";
import SalesDetails from "../pages/sales/SalesDetails";

import TargetList from "../pages/targets/TargetList";
import TargetForm from "../pages/targets/TargetForm";
import TargetDetails from "../pages/targets/TargetDetails";

import SalesReports from "../pages/reports/SalesReports";

import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";
import SuperAdminBlockRoute from "./SuperAdminBlockRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* ================= PROTECTED ROUTES ================= */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          {/* USERS */}
          <Route path="/users" element={<UserList />} />
          <Route path="/users/add" element={<UserForm />} />
          <Route path="/users/:id/edit" element={<UserForm />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/profile/:id" element={<UserDetails />} />
          <Route path="/profile/edit" element={<UserForm />} />
          {/* ROLES */}
          <Route path="/roles" element={<RoleList />} />
          <Route path="/roles/add" element={<RoleForm />} />
          <Route path="/roles/:id/edit" element={<RoleForm />} />
          <Route path="/roles/:id" element={<RoleDetails />} />

          <Route element={<SuperAdminBlockRoute />}>
            {/* LEADS */}
            <Route path="/leads" element={<LeadList />} />
            <Route path="/leads/add" element={<LeadForm />} />
            <Route path="/leads/:id/edit" element={<LeadForm />} />
            <Route path="/leads/:id" element={<LeadDetails />} />
            {/* DEALS */}
            <Route path="/deals" element={<DealList />} />
            <Route path="/deals/add" element={<DealForm />} />
            <Route path="/deals/:id/edit" element={<DealForm />} />
            <Route path="/deals/:id" element={<DealDetails />} />
            {/* SALES */}
            <Route path="/sales" element={<SalesList />} />
            <Route path="/sales/add" element={<SalesForm />} />
            <Route path="/sales/:id/edit" element={<SalesForm />} />
            <Route path="/sales/:id" element={<SalesDetails />} />
            {/* TARGETS */}
            <Route path="/targets" element={<TargetList />} />
            <Route path="/targets/add" element={<TargetForm />} />
            <Route path="/targets/:id/edit" element={<TargetForm />} />
            <Route path="/targets/:id" element={<TargetDetails />} />
            {/* REPORTS */}
            <Route path="/reports" element={<SalesReports />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;

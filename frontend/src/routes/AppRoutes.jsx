import { Routes, Route } from "react-router-dom";
import { PERMISSIONS } from "@/config/permissions.config.js";

import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";

import Dashboard from "@/pages/dashboard/dashboard";

import UserList from "@/pages/users/UserList";
import UserForm from "@/pages/users/UserForm";
import UserDetails from "@/pages/users/UserDetails";

import RoleList from "@/pages/roles/RoleList";
import RoleForm from "@/pages/roles/RoleForm";
import RoleDetails from "@/pages/roles/RoleDetails";

import LeadList from "@/pages/leads/LeadList";
import LeadForm from "@/pages/leads/LeadForm";
import LeadDetails from "@/pages/leads/LeadDetails";

import DealList from "@/pages/deals/DealList";
import DealForm from "@/pages/deals/DealForm";
import DealDetails from "@/pages/deals/DealDetails";

import SalesList from "@/pages/sales/SalesList";
import SalesForm from "@/pages/sales/SalesForm";
import SalesDetails from "@/pages/sales/SalesDetails";

import TargetList from "@/pages/targets/TargetList";
import TargetForm from "@/pages/targets/TargetForm";
import TargetDetails from "@/pages/targets/TargetDetails";

import Reports from "@/pages/reports/Reports";
import TargetPerformance from "@/pages/reports/TargetPerformance";

import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

import { NotFound, Forbidden, Unauthorized, ServerError } from "@/pages/errors";

import ProtectedRoute from "./ProtectedRoute";
import PermissionRoute from "./PermissionRoute";
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

          {/* DASHBOARD */}
          <Route
            path="/"
            element={
              <PermissionRoute permission={PERMISSIONS.REPORT_DASHBOARD}>      
                 <SuperAdminBlockRoute>
         <Dashboard />
       </SuperAdminBlockRoute>
             
              </PermissionRoute>
            }
          />


          {/* USERS */}

          <Route
            path="/users"
            element={
              <PermissionRoute permission={PERMISSIONS.USER_VIEW}>
                <UserList />
              </PermissionRoute>
            }
          />

          <Route
            path="/users/add"
            element={
              <PermissionRoute permission={PERMISSIONS.USER_CREATE}>
                <UserForm />
              </PermissionRoute>
            }
          />

          <Route
            path="/users/:id/edit"
            element={
              <PermissionRoute permission={PERMISSIONS.USER_UPDATE}>
                <UserForm />
              </PermissionRoute>
            }
          />

          <Route
            path="/users/:id"
            element={
              <PermissionRoute permission={PERMISSIONS.USER_VIEW}>
                <UserDetails />
              </PermissionRoute>
            }
          />

          <Route path="/profile/:id" element={<UserDetails />} />
          <Route path="/profile/edit" element={<UserForm />} />


          {/* ROLES */}

          <Route
            path="/roles"
            element={
              <PermissionRoute permission={PERMISSIONS.ROLE_VIEW}>
                <RoleList />
              </PermissionRoute>
            }
          />

          <Route
            path="/roles/add"
            element={
              <PermissionRoute permission={PERMISSIONS.ROLE_CREATE}>
                <RoleForm />
              </PermissionRoute>
            }
          />

          <Route
            path="/roles/:id/edit"
            element={
              <PermissionRoute permission={PERMISSIONS.ROLE_UPDATE}>
                <RoleForm />
              </PermissionRoute>
            }
          />

          <Route
            path="/roles/:id"
            element={
              <PermissionRoute permission={PERMISSIONS.ROLE_VIEW}>
                <RoleDetails />
              </PermissionRoute>
            }
          />


          {/* SUPER ADMIN BLOCK */}

          <Route element={<SuperAdminBlockRoute />}>


            {/* LEADS */}

            <Route
              path="/leads"
              element={
                <PermissionRoute permission={PERMISSIONS.LEAD_VIEW}>
                  <LeadList />
                </PermissionRoute>
              }
            />

            <Route
              path="/leads/add"
              element={
                <PermissionRoute permission={PERMISSIONS.LEAD_CREATE}>
                  <LeadForm />
                </PermissionRoute>
              }
            />

            <Route
              path="/leads/:id/edit"
              element={
                <PermissionRoute permission={PERMISSIONS.LEAD_UPDATE}>
                  <LeadForm />
                </PermissionRoute>
              }
            />

            <Route
              path="/leads/:id/details"
              element={
                <PermissionRoute permission={PERMISSIONS.LEAD_VIEW}>
                  <LeadDetails />
                </PermissionRoute>
              }
            />


            {/* DEALS */}

            <Route
              path="/deals"
              element={
                <PermissionRoute permission={PERMISSIONS.DEAL_VIEW}>
                  <DealList />
                </PermissionRoute>
              }
            />

            <Route
              path="/deals/add"
              element={
                <PermissionRoute permission={PERMISSIONS.DEAL_CREATE}>
                  <DealForm />
                </PermissionRoute>
              }
            />

            <Route
              path="/deals/:id/edit"
              element={
                <PermissionRoute permission={PERMISSIONS.DEAL_UPDATE}>
                  <DealForm />
                </PermissionRoute>
              }
            />

            <Route
              path="/deals/:id"
              element={
                <PermissionRoute permission={PERMISSIONS.DEAL_VIEW}>
                  <DealDetails />
                </PermissionRoute>
              }
            />


            {/* SALES */}

            <Route
              path="/sales"
              element={
                <PermissionRoute permission={PERMISSIONS.SALE_VIEW}>
                  <SalesList />
                </PermissionRoute>
              }
            />

            <Route
              path="/sales/add"
              element={
                <PermissionRoute permission={PERMISSIONS.SALE_CREATE}>
                  <SalesForm />
                </PermissionRoute>
              }
            />

            <Route
              path="/sales/:id/details"
              element={
                <PermissionRoute permission={PERMISSIONS.SALE_VIEW}>
                  <SalesDetails />
                </PermissionRoute>
              }
            />


            {/* TARGETS */}

            <Route
              path="/targets"
              element={
                <PermissionRoute permission={PERMISSIONS.TARGET_VIEW}>
                  <TargetList />
                </PermissionRoute>
              }
            />

            <Route
              path="/targets/add"
              element={
                <PermissionRoute permission={PERMISSIONS.TARGET_CREATE}>
                  <TargetForm />
                </PermissionRoute>
              }
            />

            <Route
              path="/targets/:id/edit"
              element={
                <PermissionRoute permission={PERMISSIONS.TARGET_UPDATE}>
                  <TargetForm />
                </PermissionRoute>
              }
            />

            <Route
              path="/targets/:id"
              element={
                <PermissionRoute permission={PERMISSIONS.TARGET_VIEW}>
                  <TargetDetails />
                </PermissionRoute>
              }
            />


            {/* REPORTS */}

            <Route
              path="/reports"
              element={
                <PermissionRoute permission={PERMISSIONS.REPORT_VIEW}>
                  <Reports />
                </PermissionRoute>
              }
            />

            <Route
              path="/reports/target-performance"
              element={
                <PermissionRoute permission={PERMISSIONS.TARGET_TEAM_PERFORMANCE}>
                  <TargetPerformance />
                </PermissionRoute>
              }
            />

          </Route>

        </Route>
      </Route>

      {/* ================= ERROR ROUTES ================= */}
      <Route path="/403" element={<Forbidden />} />
      <Route path="/401" element={<Unauthorized />} />
      <Route path="/500" element={<ServerError />} />
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;
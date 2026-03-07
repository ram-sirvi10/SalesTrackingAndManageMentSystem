import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import Sidebar from "@/components/navigation/SideBar";
import Topbar from "@/components/navigation/Topbar";
import { getRedirectPath } from "../utils/getRedirectPath";

const AdminLayout = () => {
   const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    if (location.pathname === "/") {
      const redirect = getRedirectPath(
        user.permissions,
        user.isSuperAdmin
      );

      navigate(redirect);
    }
  }, [user]);
  return (
    <div className="flex h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <Topbar />
        
        {/* Main Content with improved spacing and animation */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

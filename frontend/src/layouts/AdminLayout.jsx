import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/SideBar";
import Topbar from "../components/navigation/Topbar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <Topbar />
        <main className="p-6 overflow-y-auto flex-1">
          {/* Other contain */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

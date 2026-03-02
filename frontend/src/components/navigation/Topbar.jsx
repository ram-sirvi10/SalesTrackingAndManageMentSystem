import { useState } from "react";
import { Bell, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const Topbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logout successfully");

    navigate("/login", { replace: true });
  };

  return (
    <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6 relative">
      <h2 className="text-lg font-semibold text-gray-700">Admin Dashboard</h2>

      <div className="flex items-center gap-6 relative">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <User size={16} />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {user?.fullName || user?.email || "User"}
          </span>
        </div>

        {open && (
          <div className="absolute right-0 top-14 w-40 bg-white shadow-lg rounded-lg border">
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Link to={`/profile/${user.id}`}>Profile</Link>
            </div>

            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Link to="/profile/edit">Edit Profile</Link>
            </div>

            <div
              onClick={handleLogout}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-red-600"
            >
              <LogOut size={16} />
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;

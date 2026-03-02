import { NavLink } from "react-router-dom";
import usePermission from "../../hooks/usePermission";
import useAuth from "../../hooks/useAuth";
import { menu } from "../../config/menu.config";

const Sidebar = () => {
  const { hasPermission } = usePermission();
  const { user } = useAuth();
  const isSuperAdmin = user?.superAdmin;

  return (
    <aside className="w-64 bg-white shadow-md p-4 hidden md:block">
      <h1 className="text-xl font-bold text-blue-600 mb-6">SalesTracker</h1>

      {menu
        .filter((item) => {
          //  Hide if super admin and restricted
          if (isSuperAdmin && item.hideForSuperAdmin) {
            return false;
          }

          // Permission check
          return hasPermission(item.permissions);
        })
        .map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg mb-2 ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
    </aside>
  );
};

export default Sidebar;

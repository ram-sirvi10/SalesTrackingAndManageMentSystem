import { NavLink } from "react-router-dom";
import { TrendingUp, HelpCircle } from "lucide-react";
import usePermission from "../../hooks/usePermission";
import useAuth from "../../hooks/useAuth";
import { menu } from "../../config/menu.config";

const Sidebar = () => {
  const { hasAnyPermission } = usePermission();
  const { user } = useAuth();
  const isSuperAdmin = user?.superAdmin;

  return (
    <aside className="w-64 bg-white border-r border-secondary-200 flex flex-col h-full hidden md:flex shadow-lg">
      {/* Logo Section with enhanced styling */}
      <div className="p-6 border-b border-secondary-200 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-11 h-11 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-glow-primary transition-all duration-300 group-hover:scale-105">
            <TrendingUp size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 bg-clip-text text-transparent">
              SalesTracker
            </h1>
            <p className="text-xs text-secondary-500 font-medium">Pro Edition</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu with improved styling */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        <div className="space-y-1">
          {menu
            .filter((item) => {
              if (isSuperAdmin && item.hideForSuperAdmin) {
                return false;
              }
              return hasAnyPermission(item.permissions);
            })
            .map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md shadow-primary-200"
                      : "text-secondary-700 hover:bg-gradient-to-r hover:from-secondary-50 hover:to-primary-50 hover:text-primary-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator bar */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                    )}
                    {item.icon && (
                      <item.icon 
                        size={20} 
                        className={`transition-transform duration-200 ${
                          isActive 
                            ? "text-white scale-110" 
                            : "text-secondary-500 group-hover:text-primary-600 group-hover:scale-110"
                        }`}
                      />
                    )}
                    <span className="font-medium text-sm flex-1">{item.name}</span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
        </div>
      </nav>

      {/* Footer Section with enhanced design */}
      <div className="p-4 border-t border-secondary-200 bg-gradient-to-br from-secondary-50 to-white">
        <div className="bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100 rounded-xl p-4 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <HelpCircle size={18} className="text-white" />
            </div>
            <h3 className="font-semibold text-secondary-900 text-sm">Need Help?</h3>
          </div>
          <p className="text-xs text-secondary-600 mb-3 leading-relaxed">
            Access documentation and support resources
          </p>
          <button className="w-full px-3 py-2.5 bg-white hover:bg-gradient-to-r hover:from-primary-600 hover:to-primary-700 hover:text-white text-primary-600 text-xs font-semibold rounded-lg border border-primary-200 hover:border-transparent transition-all duration-200 hover:shadow-md">
            View Documentation
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

import { Link, useNavigate } from "react-router-dom";
import { Home, LogIn, UserX, Shield } from "lucide-react";
import Button from "../../components/common/Button";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-info-50 via-white to-secondary-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center animate-fade-in-up">
        {/* Animated 401 Illustration */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-info-100 rounded-full blur-3xl opacity-30 animate-pulse-subtle"></div>
          </div>
          <div className="relative">
            <h1 className="text-[180px] font-bold bg-gradient-to-r from-info-600 via-info-700 to-primary-600 bg-clip-text text-transparent leading-none">
              401
            </h1>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <UserX size={80} className="text-info-300 animate-bounce-subtle" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-3">
            Authentication Required
          </h2>
          <p className="text-lg text-secondary-600 mb-2">
            You need to be logged in to access this page.
          </p>
          <p className="text-secondary-500">
            Please sign in with your credentials to continue.
          </p>
        </div>

        {/* Auth Info Card */}
        <div className="bg-white rounded-xl shadow-md border border-info-200 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-info-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield size={24} className="text-info-600" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Why do I need to log in?
              </h3>
              <ul className="space-y-2 text-sm text-secondary-600">
                <li className="flex items-start gap-2">
                  <span className="text-info-500 mt-0.5">•</span>
                  <span>This page requires authentication to protect your data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-info-500 mt-0.5">•</span>
                  <span>Your session may have expired</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-info-500 mt-0.5">•</span>
                  <span>You may have been logged out for security reasons</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            icon={LogIn}
            onClick={handleLogin}
            className="w-full sm:w-auto"
          >
            Sign In
          </Button>
        
        </div>

        {/* Help Section */}
        <div className="mt-12 pt-8 border-t border-secondary-200">
          <p className="text-sm text-secondary-600 mb-4">
            Don't have an account?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-2.5 bg-secondary-50 hover:bg-secondary-100 text-secondary-700 text-sm font-medium rounded-lg transition-all">
              Request Access
            </button>
            <button className="px-6 py-2.5 bg-secondary-50 hover:bg-secondary-100 text-secondary-700 text-sm font-medium rounded-lg transition-all">
              Contact Administrator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

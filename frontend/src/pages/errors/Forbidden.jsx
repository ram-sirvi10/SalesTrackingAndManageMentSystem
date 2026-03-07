import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, ShieldAlert, Lock } from "lucide-react";


const Forbidden = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-danger-50 via-white to-secondary-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center animate-fade-in-up">
        {/* Animated 403 Illustration */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-danger-100 rounded-full blur-3xl opacity-30 animate-pulse-subtle"></div>
          </div>
          <div className="relative">
            <h1 className="text-[180px] font-bold bg-gradient-to-r from-danger-600 via-danger-700 to-danger-800 bg-clip-text text-transparent leading-none">
              403
            </h1>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <ShieldAlert size={80} className="text-danger-300 animate-bounce-subtle" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-3">
            Access Denied
          </h2>
          <p className="text-lg text-secondary-600 mb-2">
            You don't have permission to access this page.
          </p>
          <p className="text-secondary-500">
            This area is restricted. Please contact your administrator if you believe this is an error.
          </p>
        </div>

        {/* Permission Info Card */}
        <div className="bg-white rounded-xl shadow-md border border-danger-200 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-danger-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lock size={24} className="text-danger-600" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Why am I seeing this?
              </h3>
              <ul className="space-y-2 text-sm text-secondary-600">
                <li className="flex items-start gap-2">
                  <span className="text-danger-500 mt-0.5">•</span>
                  <span>You may not have the required permissions for this resource</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-danger-500 mt-0.5">•</span>
                  <span>Your account role may not include access to this feature</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-danger-500 mt-0.5">•</span>
                  <span>The page may be restricted to specific user groups</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-secondary-50 text-secondary-700 font-medium rounded-lg border border-secondary-300 transition-all duration-200 hover:shadow-md"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-12 pt-8 border-t border-secondary-200">
          <p className="text-sm text-secondary-600 mb-4">
            Need access to this page?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-2.5 bg-secondary-50 hover:bg-secondary-100 text-secondary-700 text-sm font-medium rounded-lg transition-all">
              Contact Administrator
            </button>
            <button className="px-6 py-2.5 bg-secondary-50 hover:bg-secondary-100 text-secondary-700 text-sm font-medium rounded-lg transition-all">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;

import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft,  ServerCrash, AlertTriangle } from "lucide-react";
import Button from "../../components/common/Button";

const ServerError = () => {
 const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-warning-50 via-white to-secondary-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center animate-fade-in-up">
        {/* Animated 500 Illustration */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-warning-100 rounded-full blur-3xl opacity-30 animate-pulse-subtle"></div>
          </div>
          <div className="relative">
            <h1 className="text-[180px] font-bold bg-gradient-to-r from-warning-600 via-warning-700 to-danger-600 bg-clip-text text-transparent leading-none">
              500
            </h1>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <ServerCrash size={80} className="text-warning-300 animate-bounce-subtle" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-3">
            Internal Server Error
          </h2>
          <p className="text-lg text-secondary-600 mb-2">
            Oops! Something went wrong on our end.
          </p>
          <p className="text-secondary-500">
            We're working to fix the issue. Please try again in a few moments.
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-xl shadow-md border border-warning-200 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={24} className="text-warning-600" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                What can you do?
              </h3>
              <ul className="space-y-2 text-sm text-secondary-600">
                <li className="flex items-start gap-2">
                  <span className="text-warning-500 mt-0.5">•</span>
                  <span>Refresh the page to try again</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning-500 mt-0.5">•</span>
                  <span>Check your internet connection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning-500 mt-0.5">•</span>
                  <span>Wait a few minutes and try again</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning-500 mt-0.5">•</span>
                  <span>Contact support if the problem persists</span>
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

        {/* Status Info */}
        <div className="mt-12 pt-8 border-t border-secondary-200">
          <div className="bg-secondary-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-secondary-600 mb-2">
              <span className="font-semibold">Error Code:</span> 500 - Internal Server Error
            </p>
            <p className="text-xs text-secondary-500">
              If this issue continues, please contact our support team with the error code above.
            </p>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default ServerError;

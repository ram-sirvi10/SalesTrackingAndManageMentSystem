import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react";


const NotFound = () => {
   const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center animate-fade-in-up">
        {/* Animated 404 Illustration */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-30 animate-pulse-subtle"></div>
          </div>
          <div className="relative">
            <h1 className="text-[180px] font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 bg-clip-text text-transparent leading-none">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <FileQuestion size={80} className="text-primary-300 animate-bounce-subtle" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-3">
            Page Not Found
          </h2>
          <p className="text-lg text-secondary-600 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-secondary-500">
            It might have been moved or deleted, or you may have mistyped the URL.
          </p>
        </div>

        {/* Search Suggestion */}
       
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

      
      </div>
    </div>
  );
};

export default NotFound;

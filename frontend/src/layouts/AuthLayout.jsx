import { Outlet } from "react-router-dom";
import { TrendingUp, Target, BarChart3, Shield } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* ================= LEFT SIDE (Branding) ================= */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white flex-col justify-center items-center px-12 relative overflow-hidden">
        {/* Decorative circles with animation */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-subtle"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-lg text-center relative z-10 animate-fade-in-up">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl mb-6 shadow-glow-primary">
              <TrendingUp size={40} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-primary-100 to-accent-200 bg-clip-text text-transparent">
              SalesTracker Pro
            </h1>
            <p className="text-xl text-primary-100 font-medium">
              Enterprise Sales Management
            </p>
          </div>

          <p className="text-lg text-primary-100 mb-12 leading-relaxed">
            Streamline your sales process with powerful tools for lead management, deal tracking, and performance analytics.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 group">
              <TrendingUp size={32} className="mb-3 text-accent-200 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Track Performance</h3>
              <p className="text-sm text-primary-100">Monitor sales metrics in real-time</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 group">
              <BarChart3 size={32} className="mb-3 text-accent-200 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-sm text-primary-100">Comprehensive insights dashboard</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 group">
              <Target size={32} className="mb-3 text-accent-200 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Goal Tracking</h3>
              <p className="text-sm text-primary-100">Set and achieve sales targets</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 group">
              <Shield size={32} className="mb-3 text-accent-200 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Secure</h3>
              <p className="text-sm text-primary-100">Enterprise-grade security</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE (Form Section) ================= */}
      <div className="flex w-full lg:w-1/2 justify-center items-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="h-screen w-screen overflow-hidden flex bg-gray-100">
      {/* ================= LEFT SIDE (Branding) ================= */}
      <div className="hidden md:flex w-1/2 bg-blue-600 text-white flex-col justify-center items-center px-12">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-6">Sales Tracking System</h1>

          <p className="text-lg opacity-90">
            Manage leads, deals, targets and analytics all in one platform.
          </p>

          <div className="mt-10 bg-white/20 p-6 rounded-xl backdrop-blur-sm">
            <p className="text-sm leading-relaxed">
              🚀 Track performance <br />
              📊 Real-time reports <br />
              🎯 Target monitoring <br />
              🔐 Secure role-based access
            </p>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE (Form Section) ================= */}
      <div className="flex w-full md:w-1/2 justify-center items-center px-6">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

import { Link } from "react-router-dom";

const TargetDetails = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Target Details</h2>

        <Link
          to="/targets/edit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Edit Target
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="text-gray-500">Employee</p>
          <p className="font-medium">Raj Kumar</p>
        </div>

        <div>
          <p className="text-gray-500">Target Amount</p>
          <p className="font-medium">₹5,00,000</p>
        </div>

        <div>
          <p className="text-gray-500">Achieved Amount</p>
          <p className="font-medium">₹3,75,000</p>
        </div>

        <div>
          <p className="text-gray-500">Month</p>
          <p className="font-medium">March 2026</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-2">Progress</p>
        <div className="h-3 bg-gray-200 rounded">
          <div className="h-3 bg-blue-600 w-3/4 rounded"></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">75% Achieved</p>
      </div>

      <div className="mt-8">
        <Link to="/targets" className="text-blue-600 hover:underline">
          ← Back to Targets
        </Link>
      </div>
    </div>
  );
};

export default TargetDetails;

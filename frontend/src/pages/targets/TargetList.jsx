import { Link } from "react-router-dom";

const TargetList = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Targets</h2>

        <Link
          to="/targets/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Target
        </Link>
      </div>

      <div className="space-y-6">
        {/* Target 1 */}
        <div className="border-b pb-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-medium">Raj Kumar</p>
              <p className="text-sm text-gray-500">₹5,00,000 Target</p>
            </div>

            <div className="flex gap-4 text-sm">
              <Link
                to="/targets/details"
                className="text-blue-600 hover:underline"
              >
                View
              </Link>

              <Link
                to="/targets/edit"
                className="text-green-600 hover:underline"
              >
                Edit
              </Link>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 rounded">
            <div className="h-2 bg-blue-600 w-3/4 rounded"></div>
          </div>

          <p className="text-xs text-gray-500 mt-1">75% Achieved</p>
        </div>

        {/* Target 2 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-medium">Priya Sharma</p>
              <p className="text-sm text-gray-500">₹4,00,000 Target</p>
            </div>

            <div className="flex gap-4 text-sm">
              <Link
                to="/targets/details"
                className="text-blue-600 hover:underline"
              >
                View
              </Link>
              <Link
                to="/targets/edit"
                className="text-green-600 hover:underline"
              >
                Edit
              </Link>
            </div>
          </div>

          <div className="h-2 bg-gray-200 rounded">
            <div className="h-2 bg-green-600 w-1/2 rounded"></div>
          </div>

          <p className="text-xs text-gray-500 mt-1">50% Achieved</p>
        </div>
      </div>
    </div>
  );
};

export default TargetList;

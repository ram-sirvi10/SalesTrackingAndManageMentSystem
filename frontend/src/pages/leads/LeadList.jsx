import { Link } from "react-router-dom";

const LeadList = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Leads</h2>

        <Link
          to="/leads/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Lead
        </Link>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="py-2 text-left">Name</th>
            <th className="text-left">Status</th>
            <th className="text-left">Assigned</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b">
            <td className="py-3">ABC Corp</td>

            <td>
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                NEW
              </span>
            </td>

            <td>Raj Kumar</td>

            <td className="flex gap-4">
              <Link
                to="/leads/details"
                className="text-blue-600 hover:underline"
              >
                View
              </Link>

              <Link to="/leads/edit" className="text-green-600 hover:underline">
                Edit
              </Link>
            </td>
          </tr>

          <tr>
            <td className="py-3">XYZ Pvt Ltd</td>

            <td>
              <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs">
                QUALIFIED
              </span>
            </td>

            <td>Priya Sharma</td>

            <td className="flex gap-4">
              <Link
                to="/leads/details"
                className="text-blue-600 hover:underline"
              >
                View
              </Link>

              <Link to="/leads/edit" className="text-green-600 hover:underline">
                Edit
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LeadList;

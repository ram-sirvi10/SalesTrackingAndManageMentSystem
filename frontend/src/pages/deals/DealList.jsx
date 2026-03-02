import { Link } from "react-router-dom";

const DealList = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Deals</h2>

        <Link
          to="/deals/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Deal
        </Link>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="py-2 text-left">Deal</th>
            <th className="text-left">Stage</th>
            <th className="text-left">Amount</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b">
            <td className="py-3">ABC Project</td>
            <td className="text-blue-600">PROPOSAL</td>
            <td>₹2,50,000</td>
            <td className="flex gap-3">
              <Link
                to="/deals/details"
                className="text-blue-600 hover:underline"
              >
                View
              </Link>

              <Link to="/deals/edit" className="text-green-600 hover:underline">
                Edit
              </Link>
            </td>
          </tr>

          <tr>
            <td className="py-3">XYZ Implementation</td>
            <td className="text-green-600">CLOSED_WON</td>
            <td>₹5,00,000</td>
            <td className="flex gap-3">
              <Link
                to="/deals/details"
                className="text-blue-600 hover:underline"
              >
                View
              </Link>

              <Link to="/deals/edit" className="text-green-600 hover:underline">
                Edit
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DealList;

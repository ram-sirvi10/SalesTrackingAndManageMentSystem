import { Link } from "react-router-dom";

const SalesList = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Sales</h2>

        <Link
          to="/sales/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Sale
        </Link>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="py-2 text-left">Invoice</th>
            <th className="text-left">Customer</th>
            <th className="text-left">Amount</th>
            <th className="text-left">Status</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b">
            <td className="py-3">INV-101</td>
            <td>ABC Corp</td>
            <td>₹2,50,000</td>
            <td>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                PAID
              </span>
            </td>
            <td className="flex gap-4">
              <Link
                to="/sales/details"
                className="text-blue-600 hover:underline"
              >
                View
              </Link>
              <Link to="/sales/edit" className="text-green-600 hover:underline">
                Edit
              </Link>
            </td>
          </tr>

          <tr>
            <td className="py-3">INV-102</td>
            <td>XYZ Pvt Ltd</td>
            <td>₹1,80,000</td>
            <td>
              <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs">
                PENDING
              </span>
            </td>
            <td className="flex gap-4">
              <Link
                to="/sales/details"
                className="text-blue-600 hover:underline"
              >
                View
              </Link>
              <Link to="/sales/edit" className="text-green-600 hover:underline">
                Edit
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SalesList;

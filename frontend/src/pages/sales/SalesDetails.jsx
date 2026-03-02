import { Link } from "react-router-dom";

const SalesDetails = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Sale Details</h2>

        <Link
          to="/sales/edit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Edit Sale
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="text-gray-500">Invoice Number</p>
          <p className="font-medium">INV-101</p>
        </div>

        <div>
          <p className="text-gray-500">Customer</p>
          <p className="font-medium">ABC Corp</p>
        </div>

        <div>
          <p className="text-gray-500">Amount</p>
          <p className="font-medium">₹2,50,000</p>
        </div>

        <div>
          <p className="text-gray-500">Status</p>
          <p className="font-medium text-green-600">PAID</p>
        </div>

        <div>
          <p className="text-gray-500">Payment Date</p>
          <p className="font-medium">20 March 2026</p>
        </div>

        <div>
          <p className="text-gray-500">Created By</p>
          <p className="font-medium">Raj Kumar</p>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/sales" className="text-blue-600 hover:underline">
          ← Back to Sales
        </Link>
      </div>
    </div>
  );
};

export default SalesDetails;

import { Link } from "react-router-dom";

const SalesForm = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-6">Add / Edit Sale</h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Invoice Number
          </label>
          <input
            type="text"
            placeholder="Enter invoice number"
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Customer Name
          </label>
          <input
            type="text"
            placeholder="Enter customer name"
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Status</label>
          <select className="w-full border px-3 py-2 rounded-lg">
            <option>PAID</option>
            <option>PENDING</option>
            <option>FAILED</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Payment Date
          </label>
          <input type="date" className="w-full border px-3 py-2 rounded-lg" />
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Save Sale
        </button>

        <Link
          to="/sales"
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default SalesForm;

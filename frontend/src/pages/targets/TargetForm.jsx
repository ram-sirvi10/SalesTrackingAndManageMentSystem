import { Link } from "react-router-dom";

const TargetForm = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-6">Add / Edit Target</h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-600 mb-2">Employee</label>
          <select className="w-full border px-3 py-2 rounded-lg">
            <option>Raj Kumar</option>
            <option>Priya Sharma</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Month</label>
          <input type="month" className="w-full border px-3 py-2 rounded-lg" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Target Amount
          </label>
          <input
            type="number"
            placeholder="Enter target amount"
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Achieved Amount
          </label>
          <input
            type="number"
            placeholder="Enter achieved amount"
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Save Target
        </button>

        <Link
          to="/targets"
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default TargetForm;

import { Link } from "react-router-dom";

const LeadForm = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-6">Add / Edit Lead</h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-2">Lead Name</label>
          <input
            type="text"
            placeholder="Enter lead name"
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Phone</label>
          <input
            type="text"
            placeholder="Enter phone number"
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Lead Source
          </label>
          <select className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Website</option>
            <option>Referral</option>
            <option>LinkedIn</option>
            <option>Cold Call</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Status</label>
          <select className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>NEW</option>
            <option>CONTACTED</option>
            <option>QUALIFIED</option>
            <option>LOST</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-2">
            Assigned To
          </label>
          <select className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Raj Kumar</option>
            <option>Priya Sharma</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-2">Notes</label>
          <textarea
            rows="4"
            placeholder="Enter notes"
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Save Lead
        </button>

        <Link
          to="/leads"
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default LeadForm;

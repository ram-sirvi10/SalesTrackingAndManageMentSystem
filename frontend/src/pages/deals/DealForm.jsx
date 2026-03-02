const DealForm = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-6">Add / Edit Deal</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Deal Name */}
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-2">Deal Name</label>
          <input
            type="text"
            placeholder="Enter deal name"
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Stage */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">Deal Stage</label>
          <select className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>NEGOTIATION</option>
            <option>PROPOSAL</option>
            <option>CLOSED_WON</option>
            <option>CLOSED_LOST</option>
          </select>
        </div>

        {/* Expected Amount */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Expected Amount
          </label>
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Closing Date */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Closing Date
          </label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Assigned To */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Assigned To
          </label>
          <select className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Raj Kumar</option>
            <option>Priya Sharma</option>
          </select>
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-2">
            Description
          </label>
          <textarea
            rows="4"
            placeholder="Enter deal description"
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex gap-4">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Save Deal
        </button>

        <button className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DealForm;

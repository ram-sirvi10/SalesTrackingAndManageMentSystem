const DealDetails = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-6">Deal Details</h2>

      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="text-gray-500">Deal Name</p>
          <p className="font-medium">ABC Project</p>
        </div>

        <div>
          <p className="text-gray-500">Stage</p>
          <p className="font-medium text-blue-600">PROPOSAL</p>
        </div>

        <div>
          <p className="text-gray-500">Expected Amount</p>
          <p className="font-medium">₹2,50,000</p>
        </div>

        <div>
          <p className="text-gray-500">Closing Date</p>
          <p className="font-medium">30 March 2026</p>
        </div>

        <div>
          <p className="text-gray-500">Assigned To</p>
          <p className="font-medium">Raj Kumar</p>
        </div>

        <div>
          <p className="text-gray-500">Created On</p>
          <p className="font-medium">15 March 2026</p>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Edit Deal
        </button>

        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
          Delete Deal
        </button>
      </div>
    </div>
  );
};

export default DealDetails;

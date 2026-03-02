import { Link } from "react-router-dom";

const LeadDetails = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lead Details</h2>

        <Link
          to="/leads/edit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Edit Lead
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="text-gray-500">Lead Name</p>
          <p className="font-medium">ABC Corp</p>
        </div>

        <div>
          <p className="text-gray-500">Status</p>
          <p className="font-medium text-blue-600">NEW</p>
        </div>

        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">contact@abccorp.com</p>
        </div>

        <div>
          <p className="text-gray-500">Phone</p>
          <p className="font-medium">9876543210</p>
        </div>

        <div>
          <p className="text-gray-500">Source</p>
          <p className="font-medium">Website</p>
        </div>

        <div>
          <p className="text-gray-500">Assigned To</p>
          <p className="font-medium">Raj Kumar</p>
        </div>

        <div className="col-span-2">
          <p className="text-gray-500">Notes</p>
          <p className="font-medium">
            Interested in enterprise software solution. Requested demo.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/leads" className="text-blue-600 hover:underline">
          ← Back to Leads
        </Link>
      </div>
    </div>
  );
};

export default LeadDetails;

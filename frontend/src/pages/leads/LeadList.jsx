import { useEffect, useState } from "react";
import { getAllApi, deleteLeadApi } from "../../api/leads.api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const LeadList = () => {
  const [leads, setLeads] = useState([]);

  const fetchLeads = async () => {
    try {
      const res = await getAllApi();
      setLeads(res.data.data.content);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching leads");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteLeadApi(id);
      toast.success("Lead deleted successfully");
      fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Leads</h2>
        <Link
          to="/leads/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Lead
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Assigned</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {leads.length > 0 ? (
            leads.map((lead) => {
              const isEditDisabled =
                lead.status === "QUALIFIED" || lead.status === "LOST";

              const isDeleteDisabled =
                lead.status === "QUALIFIED" || lead.status === "LOST";

              return (
                <tr key={lead.id} className="border-b">
                  <td>{lead.name}</td>
                  <td>{lead.status}</td>
                  <td>{lead.assignedPersonEmail || "Not Assigned"}</td>
                  <td className="flex gap-3 items-center">
                    <Link to={`/leads/${lead.id}/details`}>View</Link>

                    {isEditDisabled ? (
                      <span className="text-gray-400 cursor-not-allowed">
                        Edit
                      </span>
                    ) : (
                      <Link to={`/leads/${lead.id}/edit`}>Edit</Link>
                    )}

                    {lead.status === "QUALIFIED" && !lead.dealId && (
                      <Link
                        to={`/deals/add?leadId=${lead.id}`}
                        className="text-green-600 font-semibold hover:underline"
                      >
                        Create Deal
                      </Link>
                    )}

                    {lead.status === "QUALIFIED" && lead.dealId && (
                      <span className="text-gray-400">Deal Created</span>
                    )}

                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="text-red-600"
                      disabled={lead.status === "QUALIFIED" || lead.dealId}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-500">
                No Leads found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeadList;

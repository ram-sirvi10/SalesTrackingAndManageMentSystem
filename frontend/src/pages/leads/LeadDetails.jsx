import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getLeadByIdApi,
  deleteLeadApi,
  assignLeadApi,
  updateLeadStatusApi,
} from "../../api/leads.api";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import AssignModal from "../../components/common/AssignModal";

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignOpen, setAssignOpen] = useState(false);

  const fetchLead = async () => {
    try {
      const res = await getLeadByIdApi(id);
      setLead(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch lead");
      navigate("/leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      await deleteLeadApi(id);
      toast.success("Lead deleted successfully");
      navigate("/leads");
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await updateLeadStatusApi({
        leadId: lead.id,
        status,
      });
      toast.success("Status updated successfully");
      fetchLead();
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid status transition");
    }
  };

  const getAllowedNextStatus = (status) => {
    switch (status) {
      case "NEW":
        return ["CONTACTED"];
      case "CONTACTED":
        return ["QUALIFIED", "LOST"];
      default:
        return [];
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      NEW: "bg-blue-100 text-blue-600",
      CONTACTED: "bg-purple-100 text-purple-600",
      QUALIFIED: "bg-green-100 text-green-600",
      LOST: "bg-red-100 text-red-600",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading) return <Loader />;
  if (!lead) return null;
  const isEditDisabled = lead.status === "QUALIFIED" || lead.status === "LOST";

  const isDeleteDisabled =
    lead.status === "QUALIFIED" || lead.status === "LOST";
  console.log("Is delete disable", isDeleteDisabled);
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lead Details</h2>

        <div className="flex gap-3">
          <button
            onClick={() => setAssignOpen(true)}
            disabled={lead.status !== "NEW"}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {lead.assignedPersonEmail ? "Reassign" : "Assign"}
          </button>

          {isEditDisabled ? (
            <span className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed">
              Edit
            </span>
          ) : (
            <Link
              to={`/leads/${lead.id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Edit
            </Link>
          )}

          <button
            onClick={handleDelete}
            disabled={isDeleteDisabled}
            className="bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="text-gray-500">Lead Name</p>
          <p className="font-medium">{lead.name}</p>
        </div>

        <div>
          <p className="text-gray-500">Status</p>
          {getStatusBadge(lead.status)}

          {getAllowedNextStatus(lead.status).length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {getAllowedNextStatus(lead.status).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className="px-3 py-1 text-xs bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  Move to {status}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">{lead.email}</p>
        </div>

        <div>
          <p className="text-gray-500">Phone</p>
          <p className="font-medium">{lead.phone}</p>
        </div>

        <div>
          <p className="text-gray-500">Source</p>
          <p className="font-medium">{lead.source}</p>
        </div>

        <div>
          <p className="text-gray-500">Assigned To</p>
          <p className="font-medium">
            {lead.assignedPersonEmail ? (
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                {lead.assignedPersonEmail}
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                Not Assigned
              </span>
            )}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Created By</p>
          <p className="font-medium">{lead.createdByEmail}</p>
        </div>

        <div>
          <p className="text-gray-500">Created Date</p>
          <p className="font-medium">
            {new Date(lead.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/leads" className="text-blue-600 hover:underline">
          ← Back to Leads
        </Link>
      </div>

      <AssignModal
        isOpen={assignOpen}
        entityId={lead.id}
        entityType="lead"
        assignApi={assignLeadApi}
        onClose={() => setAssignOpen(false)}
        onSuccess={fetchLead}
      />
    </div>
  );
};

export default LeadDetails;

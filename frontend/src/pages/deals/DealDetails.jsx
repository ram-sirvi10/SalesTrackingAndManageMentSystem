import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getDealByIdApi,
  deleteDealApi,
  assignDealApi,
  updateDealStatusApi,
} from "../../api/deals.api";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import AssignModal from "../../components/common/AssignModal";

const DealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignOpen, setAssignOpen] = useState(false);

  const fetchDeal = async () => {
    try {
      const res = await getDealByIdApi(id);
      setDeal(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch deal");
      navigate("/deals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeal();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this deal?")) return;

    try {
      await deleteDealApi(id);
      toast.success("Deal deleted successfully");
      navigate("/deals");
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const handleStageChange = async (stage) => {
    try {
      await updateDealStatusApi({
        dealId: deal.id,
        stage,
      });
      toast.success("Stage updated successfully");
      fetchDeal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid stage transition");
    }
  };

  const getAllowedNextStages = (stage) => {
    switch (stage) {
      case "OPEN":
        return ["PROPOSAL_SENT"];
      case "PROPOSAL_SENT":
        return ["NEGOTIATION", "LOST"];
      case "NEGOTIATION":
        return ["WON", "LOST"];
      default:
        return [];
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      OPEN: "text-blue-600",
      PROPOSAL_SENT: "text-yellow-600",
      NEGOTIATION: "text-purple-600",
      WON: "text-green-600",
      LOST: "text-red-600",
    };
    return colors[stage] || "text-gray-600";
  };

  if (loading) return <Loader />;
  if (!deal) return null;

  const isEditDisabled = deal.dealStage === "WON" || deal.dealStage === "LOST";

  const isDeleteDisabled =
    deal.dealStage === "WON" || deal.dealStage === "LOST";

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Deal Details</h2>

        <div className="flex gap-3">
          <button
            onClick={() => setAssignOpen(true)}
            disabled={deal.dealStage === "WON"}
            className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {deal.assignedUserEmail ? "Reassign" : "Assign"}
          </button>

          {isEditDisabled ? (
            <span className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed">
              Edit
            </span>
          ) : (
            <Link
              to={`/deals/${deal.id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
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
          <p className="text-gray-500">Lead Email</p>
          <p className="font-medium">{deal.leadEmail}</p>
        </div>

        <div>
          <p className="text-gray-500">Stage</p>
          <p className={`font-semibold ${getStageColor(deal.dealStage)}`}>
            {deal.dealStage}
          </p>

          {getAllowedNextStages(deal.dealStage).length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {getAllowedNextStages(deal.dealStage).map((stage) => (
                <button
                  key={stage}
                  onClick={() => handleStageChange(stage)}
                  className="px-3 py-1 text-xs bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  Move to {stage}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-gray-500">Expected Amount</p>
          <p className="font-medium">
            ₹{Number(deal.expectedAmount).toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Closing Date</p>
          <p className="font-medium">{deal.closingDate}</p>
        </div>

        <div>
          <p className="text-gray-500">Assigned To</p>
          <p className="font-medium">
            {deal.assignedUserEmail || "Not Assigned"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Created By</p>
          <p className="font-medium">{deal.createdByUserEmail}</p>
        </div>

        <div>
          <p className="text-gray-500">Created Date</p>
          <p className="font-medium">
            {new Date(deal.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/deals" className="text-blue-600 hover:underline">
          ← Back to Deals
        </Link>
      </div>

      {/* Assign Modal */}
      <AssignModal
        isOpen={assignOpen}
        entityId={deal.id}
        entityType="deal"
        assignApi={assignDealApi}
        onClose={() => setAssignOpen(false)}
        onSuccess={fetchDeal}
      />
    </div>
  );
};

export default DealDetails;

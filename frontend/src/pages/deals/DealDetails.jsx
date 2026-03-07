import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Mail,
  DollarSign,
  Calendar,
  User,
  UserPlus,
  Edit,
  Trash2,
  ArrowLeft,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  getDealByIdApi,
  deleteDealApi,
  assignDealApi,
  updateDealStatusApi,
} from "../../api/deals.api";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import ConfirmModal from "../../components/common/ConfirmDialog";
import AssignModal from "../../components/common/AssignModal";
import usePermission from "../../hooks/usePermission";
import { PERMISSIONS } from "../../config/permissions.config";
const DealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const {hasPermission}=usePermission();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignOpen, setAssignOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
    try {
      await deleteDealApi(id);
      toast.success("Deal deleted successfully");
      navigate("/deals");
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setDeleteModalOpen(false);
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

  const getStageVariant = (stage) => {
    const variants = {
      OPEN: "info",
      PROPOSAL_SENT: "warning",
      NEGOTIATION: "secondary",
      WON: "success",
      LOST: "danger",
    };
    return variants[stage] || "default";
  };

  if (loading) return <Loader fullScreen />;
  if (!deal) return null;

  const isEditDisabled = deal.dealStage === "WON" || deal.dealStage === "LOST";
  const isDeleteDisabled = deal.dealStage === "WON" || deal.dealStage === "LOST";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Card */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="text-primary-600" />
              Deal Details
            </h1>
            <p className="text-gray-600 mt-1">View and manage deal information</p>
          </div>
          <div className="flex items-center gap-3">
           {hasPermission(PERMISSIONS.DEAL_ASSIGN)&&(
             <Button
              variant="success"
              icon={UserPlus}
              onClick={() => setAssignOpen(true)}
              disabled={deal.dealStage === "WON"}
            >
              {deal.assignedUserEmail ? "Reassign" : "Assign"}
            </Button>
           )}
            {!isEditDisabled && (
             hasPermission(PERMISSIONS.DEAL_UPDATE)&&( <Link to={`/deals/${deal.id}/edit`}>
                <Button variant="primary" icon={Edit}>Edit</Button>
              </Link>)
            )}
          {hasPermission(PERMISSIONS.DEAL_DELETE)&&(  <Button
              variant="danger"
              icon={Trash2}
              onClick={() => setDeleteModalOpen(true)}
              disabled={isDeleteDisabled}
            >
              Delete
            </Button>)}
          </div>
        </div>
      </Card>

      {/* Deal Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Deal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lead Email */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Mail size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Lead Email</p>
              <p className="font-semibold text-gray-800">{deal.leadEmail}</p>
            </div>
          </div>

          {/* Deal Stage */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <TrendingUp size={20} className="text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">Deal Stage</p>
              <Badge variant={getStageVariant(deal.dealStage)} size="lg">
                {deal.dealStage.replace(/_/g, " ")}
              </Badge>
              {getAllowedNextStages(deal.dealStage).length > 0 && (
               hasPermission(PERMISSIONS.DEAL_STAGE_UPDATE)&& <div className="mt-3 flex gap-2 flex-wrap">
                  {getAllowedNextStages(deal.dealStage).map((stage) => (
                    <Button
                      key={stage}
                      variant="outline"
                      size="sm"
                      onClick={() => handleStageChange(stage)}
                    >
                      Move to {stage.replace(/_/g, " ")}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Expected Amount */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Expected Amount</p>
              <p className="font-semibold text-gray-800 text-lg">
                ₹{Number(deal.expectedAmount).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Closing Date */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Closing Date</p>
              <p className="font-semibold text-gray-800">{deal.closingDate}</p>
            </div>
          </div>

          {/* Assigned To */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <User size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Assigned To</p>
              <p className="font-semibold text-gray-800">
                {deal.assignedUserEmail || "Not Assigned"}
              </p>
            </div>
          </div>

          {/* Created By */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <User size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Created By</p>
              <p className="font-semibold text-gray-800">{deal.createdByUserEmail}</p>
            </div>
          </div>

          {/* Created Date */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Clock size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Created Date</p>
              <p className="font-semibold text-gray-800">
                {new Date(deal.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Back Button */}
      <div>
        <Link to="/deals">
          <Button variant="outline" icon={ArrowLeft}>
            Back to Deals
          </Button>
        </Link>
      </div>

      {/* Modals */}
      <AssignModal
        isOpen={assignOpen}
        entityId={deal.id}
        entityType="deal"
        assignApi={assignDealApi}
        onClose={() => setAssignOpen(false)}
        onSuccess={fetchDeal}
      />
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Deal"
        message="Are you sure you want to delete this deal? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default DealDetails;

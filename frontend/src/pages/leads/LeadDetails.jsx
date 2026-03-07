import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Mail, Phone, User, Calendar, ArrowLeft, Edit, Trash2, UserPlus, TrendingUp } from "lucide-react";
import {
  getLeadByIdApi,
  deleteLeadApi,
  assignLeadApi,
  updateLeadStatusApi,
} from "../../api/leads.api";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import AssignModal from "../../components/common/AssignModal";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import ConfirmModal from "../../components/common/ConfirmDialog";
import usePermission from "../../hooks/usePermission";
import { PERMISSIONS } from "../../config/permissions.config";

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignOpen, setAssignOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

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
    try {
      await deleteLeadApi(id);
      toast.success("Lead deleted successfully");
      navigate("/leads");
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setConfirmDelete(false);
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
    const variants = {
      NEW: "info",
      CONTACTED: "warning",
      QUALIFIED: "success",
      LOST: "danger",
    };
    return variants[status] || "default";
  };

  if (loading) return <Loader fullScreen />;
  if (!lead) return null;
  
  const isEditDisabled = lead.status === "QUALIFIED" || lead.status === "LOST";
  const isDeleteDisabled = lead.status === "QUALIFIED" || lead.status === "LOST";
  
  return (
    <div className="max-w-5xl space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">Lead Details</h2>
            <p className="text-secondary-600 mt-1">View and manage lead information</p>
          </div>

          <div className="flex gap-3">
            {hasPermission(PERMISSIONS.LEAD_ASSIGN)&&( <Button
              onClick={() => setAssignOpen(true)}
              disabled={lead.status !== "NEW"}
              variant="success"
              icon={UserPlus}
            >
              {lead.assignedPersonEmail ? "Reassign" : "Assign"}
            </Button>)}
           

            {
            hasPermission(PERMISSIONS.LEAD_UPDATE)&&(  isEditDisabled ? ( 
              <Button variant="secondary" disabled icon={Edit}>
                Edit
              </Button>
            ) : (
              <Link to={`/leads/${lead.id}/edit`}>
                <Button variant="primary" icon={Edit}>
                  Edit
                </Button>
              </Link>
            ))
            
          }

           {hasPermission(PERMISSIONS.LEAD_DELETE)&&( <Button
              onClick={() => setConfirmDelete(true)}
              disabled={isDeleteDisabled}
              variant="danger"
              icon={Trash2}
            >
              Delete
            </Button>)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Lead Name</p>
              <p className="font-semibold text-lg text-secondary-900">{lead.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Status</p>
              <div className="space-y-2">
                <Badge variant={getStatusBadge(lead.status)} size="md">
                  {lead.status}
                </Badge>
                {hasPermission(PERMISSIONS.LEAD_STATUS_UPDATE)&&(getAllowedNextStatus(lead.status).length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {getAllowedNextStatus(lead.status).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className="px-3 py-1 text-xs bg-secondary-100 text-secondary-700 rounded-full hover:bg-secondary-200 transition-colors font-medium"
                      >
                        Move to {status}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <Mail size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Email</p>
              <p className="font-semibold text-lg text-secondary-900">{lead.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <Phone size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Phone</p>
              <p className="font-semibold text-lg text-secondary-900">{lead.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Source</p>
              <p className="font-semibold text-lg text-secondary-900">{lead.source}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <UserPlus size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Assigned To</p>
              {lead.assignedPersonEmail ? (
                <Badge variant="success" size="md">
                  {lead.assignedPersonEmail}
                </Badge>
              ) : (
                <Badge variant="default" size="md">
                  Not Assigned
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Created By</p>
              <p className="font-semibold text-lg text-secondary-900">{lead.createdByEmail}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Calendar size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Created Date</p>
              <p className="font-semibold text-lg text-secondary-900">
                {new Date(lead.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-secondary-200">
          <Link to="/leads" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
            <ArrowLeft size={18} />
            Back to Leads
          </Link>
        </div>
      </Card>

      <AssignModal
        isOpen={assignOpen}
        entityId={lead.id}
        entityType="lead"
        assignApi={assignLeadApi}
        onClose={() => setAssignOpen(false)}
        onSuccess={fetchLead}
      />

      <ConfirmModal
        isOpen={confirmDelete}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
};

export default LeadDetails;

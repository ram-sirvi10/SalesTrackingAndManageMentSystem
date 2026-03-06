import { useEffect, useState } from "react";
import {
  getAllApi,
  deleteLeadApi,
  getAssignedLeadByUserApi,
} from "../../api/leads.api";
import { Link } from "react-router-dom";
import { Plus, Eye, Edit, Trash2, Filter, X as XIcon, DollarSign } from "lucide-react";
import toast from "react-hot-toast";
import usePermission from "../../hooks/usePermission";
import useAuth from "../../hooks/useAuth";
import ConfirmModal from "../../components/common/ConfirmDialog";
import Loader from "../../components/common/Loader";
import UserSelectModal from "../../components/common/UserSelecetModel";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = usePermission();
  const { user } = useAuth();
  const [userModal, setUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmModelOpen, setConfirmModelOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  });
  
  const handleDeleteClick = (id) => {
    setSelectedLead(id);
    setConfirmModelOpen(true);
  };

  const fetchLeads = async (page = pagination.currentPage, size = pagination.pageSize) => {
    setLoading(true);
    try {
      let res;

      if (selectedUser) {
        res = await getAssignedLeadByUserApi(selectedUser.id, page, size);
      } else if (hasPermission("VIEW_ALL_LEADS")) {
        res = await getAllApi(page, size);
      } else {
        res = await getAssignedLeadByUserApi(user.id, page, size);
      }
      
      const data = res.data.data;
      setLeads(data.content || data);
    
      // Update pagination - backend returns pageNumber, pageSize, totalPages, totalElements
      setPagination({
        currentPage: data.pageNumber !== undefined ? data.pageNumber : (data.number || page),
        totalPages: data.totalPages || 1,
        totalElements: data.totalElements || data.content?.length || 0,
        pageSize: data.pageSize !== undefined ? data.pageSize : (data.size || size),
      });
     
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching leads");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLeads(0, pagination.pageSize); 
  }, [selectedUser]);

  const handlePageChange = (page) => {
    fetchLeads(page, pagination.pageSize);
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, pageSize: newSize, currentPage: 0 }));
    fetchLeads(0, newSize);
  };

  const handleDelete = async () => {
    try {
      await deleteLeadApi(selectedLead);
      toast.success("Lead deleted successfully");
      fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setConfirmModelOpen(false);
    }
  };
  
  const reset = () => {
    setSelectedUser(null);
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
  
  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg border border-secondary-300">
              <span className="text-sm">Filtered by: </span>
              <span className="font-semibold">{selectedUser?.email || "ALL USERS"}</span>
            </div>
          </div>
          <Button
            onClick={() => setUserModal(true)}
            variant="primary"
            icon={Filter}
          >
            Filter by User
          </Button>
          {selectedUser && (
            <Button
              onClick={reset}
              variant="danger"
              icon={XIcon}
            >
              Reset
            </Button>
          )}
        </div>
      </Card>

      {/* Leads Table */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">Leads</h2>
            <p className="text-secondary-600 mt-1">Manage your sales leads and prospects</p>
          </div>
          <Link to="/leads/add">
            <Button variant="primary" icon={Plus}>
              Add Lead
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto rounded-lg border border-secondary-200">
          <table className="w-full text-sm">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">Assigned</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-secondary-200">
              {leads.length > 0 ? (
                leads.map((lead) => {
                  const isEditDisabled = lead.status === "QUALIFIED" || lead.status === "LOST";
                  const isDeleteDisabled = lead.status === "QUALIFIED" || lead.status === "LOST";

                  return (
                    <tr key={lead.id} className="hover:bg-secondary-50 transition-colors duration-150">
                      <td className="px-6 py-4 text-secondary-900 font-medium">{lead.name}</td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusBadge(lead.status)} size="sm">
                          {lead.status}
                        </Badge>
                      </td>

                      <td className="px-6 py-4">
                        {lead.assignedPersonEmail ? (
                          <Badge variant="success" size="sm">
                            {lead.assignedPersonEmail}
                          </Badge>
                        ) : (
                          <Badge variant="default" size="sm">
                            Not Assigned
                          </Badge>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-3 items-center flex-wrap">
                          <Link
                            to={`/leads/${lead.id}/details`}
                            className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                          >
                            <Eye size={16} />
                            View
                          </Link>

                          {isEditDisabled ? (
                            <span className="flex items-center gap-1 text-secondary-400 cursor-not-allowed">
                              <Edit size={16} />
                              Edit
                            </span>
                          ) : (
                            <Link
                              to={`/leads/${lead.id}/edit`}
                              className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium transition-colors"
                            >
                              <Edit size={16} />
                              Edit
                            </Link>
                          )}

                          {lead.status === "QUALIFIED" && !lead.dealId && (
                            <Link
                              to={`/deals/add?leadId=${lead.id}`}
                              className="flex items-center gap-1 text-green-600 hover:text-green-700 font-semibold transition-colors"
                            >
                              <DollarSign size={16} />
                              Create Deal
                            </Link>
                          )}

                          {lead.status === "QUALIFIED" && lead.dealId && (
                            <span className="text-secondary-400 text-sm">Deal Created</span>
                          )}

                          <button
                            onClick={() => handleDeleteClick(lead.id)}
                            disabled={isDeleteDisabled}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12">
                    <EmptyState
                      title="No leads found"
                      description="Start by adding your first lead to track potential customers."
                      action={() => window.location.href = "/leads/add"}
                      actionLabel="Add Lead"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalElements={pagination.totalElements}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          className="mt-6"
        />
      </Card>

      <ConfirmModal
        isOpen={confirmModelOpen}
        title="Delete Lead"
        message="Are you sure you want to delete this Lead?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmModelOpen(false)}
      />
      <UserSelectModal
        isOpen={userModal}
        onClose={() => setUserModal(false)}
        title="Select User"
        onSelect={(user) => setSelectedUser(user)}
      />
    </div>
  );
};

export default LeadList;

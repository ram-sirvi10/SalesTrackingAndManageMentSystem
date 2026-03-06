import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, Edit, Trash2, Plus, Filter, X, DollarSign, TrendingUp } from "lucide-react";
import {
  getAllApi,
  deleteDealApi,
  getAssignedDealByUserApi,
} from "../../api/deals.api";
import Loader from "../../components/common/Loader";
import ConfirmModal from "../../components/common/ConfirmDialog";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";
import usePermission from "../../hooks/usePermission";
import useAuth from "../../hooks/useAuth";
import UserSelectModal from "../../components/common/UserSelecetModel";

const DealList = () => {
  const [confirmModelOpen, setConfirmModelOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState("");
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userModal, setUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  });
  const { hasPermission } = usePermission();
  const { user } = useAuth();

  const fetchDeals = async (page = pagination.currentPage, size = pagination.pageSize) => {
    setLoading(true);
    try {
      let res;
      if (selectedUser) {
        console.log(selectedUser.id);
        res = await getAssignedDealByUserApi(selectedUser.id, page, size);
      } else if (hasPermission("VIEW_ALL_DEALS")) {
        res = await getAllApi(page, size);
      } else {
        res = await getAssignedDealByUserApi(user.id, page, size);
      }
      
      const data = res.data.data;
      setDeals(data.content || data);
      
      
      setPagination({
        currentPage: data.pageNumber !== undefined ? data.pageNumber : (data.number || page),
        totalPages: data.totalPages || 1,
        totalElements: data.totalElements || data.content?.length || 0,
        pageSize: data.pageSize !== undefined ? data.pageSize : (data.size || size),
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching Deals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals(0, pagination.pageSize); 
  }, [selectedUser]);

  const handlePageChange = (page) => {
    fetchDeals(page, pagination.pageSize);
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, pageSize: newSize, currentPage: 0 }));
    fetchDeals(0, newSize);
  };

  const handleDeleteClick = (id) => {
    setSelectedDeal(id);
    setConfirmModelOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteDealApi(selectedDeal);
      toast.success("Deal deleted successfully");
      fetchDeals();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setConfirmModelOpen(false);
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

  const reset = () => {
    setSelectedUser(null);
  };
  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="text-primary-600" />
              Deals Management
            </h1>
            <p className="text-gray-600 mt-1">Track and manage your deals pipeline</p>
          </div>
        
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-600">Filtered by:</span>
            <span className="font-semibold text-gray-800">
              {selectedUser?.email || "All Users"}
            </span>
          </div>
          <Button
            variant="outline"
            icon={Filter}
            onClick={() => setUserModal(true)}
          >
            Filter by User
          </Button>
          {selectedUser && (
            <Button variant="danger" icon={X} onClick={reset}>
              Reset Filter
            </Button>
          )}
        </div>
      </Card>

      {/* Deals Table */}
      <Card>
        {deals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Lead</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Stage</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Closing Date</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Assigned To</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => {
                  const isEditDisabled = deal.dealStage === "WON" || deal.dealStage === "LOST";
                  const isDeleteDisabled = deal.dealStage === "WON" || deal.dealStage === "LOST";

                  return (
                    <tr key={deal.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{deal.leadEmail}</div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={getStageVariant(deal.dealStage)}>
                          {deal.dealStage.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 font-semibold text-gray-800">
                          <DollarSign size={16} className="text-green-600" />
                          ₹{Number(deal.expectedAmount).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{deal.closingDate}</td>
                      <td className="py-4 px-4">
                        {deal.assignedUserEmail ? (
                          <Badge variant="success" size="sm">{deal.assignedUserEmail}</Badge>
                        ) : (
                          <Badge variant="default" size="sm">Not Assigned</Badge>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/deals/${deal.id}`}>
                            <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="View">
                              <Eye size={18} />
                            </button>
                          </Link>
                          {!isEditDisabled && (
                            <Link to={`/deals/${deal.id}/edit`}>
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                <Edit size={18} />
                              </button>
                            </Link>
                          )}
                          {deal.dealStage === "WON" && !deal.saleId && (
                            <Link to={`/sales/add?dealId=${deal.id}`}>
                              <Button variant="success" size="sm">Create Sale</Button>
                            </Link>
                          )}
                          {deal.dealStage === "WON" && deal.saleId && (
                            <Badge variant="default" size="sm">Sale Created</Badge>
                          )}
                          <button
                            onClick={() => handleDeleteClick(deal.id)}
                            disabled={isDeleteDisabled}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={TrendingUp}
            title="No Deals Found"
            description="Start by creating your first deal or adjust your filters"
            action={
              <Link to="/deals/add">
                <Button icon={Plus}>Create Deal</Button>
              </Link>
            }
          />
        )}

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
        title="Delete Deal"
        message="Are you sure you want to delete this deal? This action cannot be undone."
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

export default DealList;

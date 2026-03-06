import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Filter, X as XIcon, FileText, BarChart3 } from "lucide-react";
import toast from "react-hot-toast";
import { getAllApi, getSalesByCommissionUserApi } from "../../api/sales.api";
import Loader from "../../components/common/Loader";
import UserSelectModal from "../../components/common/UserSelecetModel";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userModal, setUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  });
  
  const fetchSales = async (page = pagination.currentPage, size = pagination.pageSize) => {
    try {
      setLoading(true);
      let res;

      if (selectedUser) {
        res = await getSalesByCommissionUserApi(selectedUser.id, page, size);
      } else res = await getAllApi(page, size);
      
      const data = res.data.data;
      setSales(data.content || data);
      
    
      setPagination({
        currentPage: data.pageNumber !== undefined ? data.pageNumber : (data.number || page),
        totalPages: data.totalPages || 1,
        totalElements: data.totalElements || data.content?.length || 0,
        pageSize: data.pageSize !== undefined ? data.pageSize : (data.size || size),
      });
    } catch (err) {
      toast.error("Error fetching Sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales(0, pagination.pageSize); // Reset to first page when user filter changes
  }, [selectedUser]);

  const handlePageChange = (page) => {
    fetchSales(page, pagination.pageSize);
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, pageSize: newSize, currentPage: 0 }));
    fetchSales(0, newSize);
  };
  
  const getPaymentStatusVariant = (status) => {
    const variants = {
      PENDING: "warning",
      SUCCESSFUL: "success",
      FAILED: "danger",
    };
    return variants[status] || "default";
  };

  const reset = () => {
    setSelectedUser(null);
  };
  
  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg border border-secondary-300">
              <span className="text-sm">Commission User: </span>
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
          <Link to="/sales-report">
            <Button variant="success" icon={BarChart3}>
              View Sales Report
            </Button>
          </Link>
        </div>
      </Card>

      {/* Sales Table */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">Sales</h2>
            <p className="text-secondary-600 mt-1">Track and manage completed sales</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-secondary-200">
          <table className="w-full text-sm">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">Sale Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {sales.length > 0 ? (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-secondary-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-secondary-900 font-medium">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-secondary-400" />
                        {sale.invoiceNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-secondary-900">{sale.customerName}</td>
                    <td className="px-6 py-4 text-secondary-900 font-semibold">
                      ₹{Number(sale.saleAmount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-secondary-700">{sale.saleDate}</td>
                    <td className="px-6 py-4">
                      <Badge variant={getPaymentStatusVariant(sale.paymentStatus)} size="sm">
                        {sale.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/sales/${sale.id}/details`}
                        className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                      >
                        <Eye size={16} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12">
                    <EmptyState
                      title="No sales found"
                      description="Sales will appear here once deals are closed and converted."
                      icon={FileText}
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

      <UserSelectModal
        isOpen={userModal}
        onClose={() => setUserModal(false)}
        title="Select Commission User"
        onSelect={(user) => setSelectedUser(user)}
      />
    </div>
  );
};

export default SalesList;

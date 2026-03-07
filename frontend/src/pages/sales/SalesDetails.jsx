import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FileText, User, DollarSign, Calendar, CreditCard, ArrowLeft, TrendingUp } from "lucide-react";
import { getSaleByIdApi, updatePaymentStatusApi } from "../../api/sales.api";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import usePermission from "../../hooks/usePermission";
import { PERMISSIONS } from "../../config/permissions.config";
const SalesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
const{hasPermission}=usePermission();
  const fetchSale = async () => {
    try {
      const res = await getSaleByIdApi(id);
      setSale(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch sale");
      navigate("/sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSale();
  }, [id]);

  const handleStatusChange = async (paymentStatus) => {
    try {
      await updatePaymentStatusApi({
        saleId: sale.id,
        paymentStatus,
      });
      toast.success("Status updated successfully");
      fetchSale();
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Status transition");
    }
  };

  const getAllowedNextStages = (stage) => {
    switch (stage) {
      case "PENDING":
        return ["FAILED", "SUCCESSFUL"];
      default:
        return [];
    }
  };
  
  const getStageVariant = (stage) => {
    const variants = {
      PENDING: "warning",
      SUCCESSFUL: "success",
      FAILED: "danger",
    };
    return variants[stage] || "default";
  };

  if (loading) return <Loader fullScreen />;
  if (!sale) return null;
  
  return (
    <div className="max-w-5xl space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">Sale Details</h2>
            <p className="text-secondary-600 mt-1">View and manage sale information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
              <FileText size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Invoice Number</p>
              <p className="font-semibold text-lg text-secondary-900">{sale.invoiceNumber}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Customer</p>
              <p className="font-semibold text-lg text-secondary-900">{sale.customerName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <DollarSign size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Amount</p>
              <p className="font-semibold text-lg text-secondary-900">
                ₹{Number(sale.saleAmount).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Payment Status</p>
              <div className="space-y-2">
                <Badge variant={getStageVariant(sale.paymentStatus)} size="md">
                  {sale.paymentStatus}
                </Badge>
                {getAllowedNextStages(sale.paymentStatus).length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {hasPermission(PERMISSIONS.SALE_PAYMENT_UPDATE)&&(getAllowedNextStages(sale.paymentStatus).map((stage) => (
                      <button
                        key={stage}
                        onClick={() => handleStatusChange(stage)}
                        className="px-3 py-1 text-xs bg-secondary-100 text-secondary-700 rounded-full hover:bg-secondary-200 transition-colors font-medium"
                      >
                        Move to {stage}
                      </button>
                    )))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Calendar size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Payment Date</p>
              <p className="font-semibold text-lg text-secondary-900">{sale.saleDate}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Created By</p>
              <p className="font-semibold text-lg text-secondary-900">{sale.createdByUserEmail}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-secondary-200">
          <Link to="/sales" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
            <ArrowLeft size={18} />
            Back to Sales
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SalesDetails;

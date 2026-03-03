import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSaleByIdApi, updatePaymentStatusApi } from "../../api/sales.api";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
const SalesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(id);

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
      toast.success("Satus updated successfully");
      fetchSale();
    } catch (err) {
      console.log(err);

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
  const getStageColor = (stage) => {
    const colors = {
      PENDING: "text-yellow-600",
      SUCCESSFUL: "text-green-600",
      FAILED: "text-red-600",
    };
    return colors[stage] || "text-gray-600";
  };

  if (loading) return <Loader />;
  if (!sale) return null;
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Sale Details</h2>
      </div>

      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="text-gray-500">Invoice Number</p>
          <p className="font-medium">{sale.invoiceNumber}</p>
        </div>

        <div>
          <p className="text-gray-500">Customer</p>
          <p className="font-medium">{sale.customerName}</p>
        </div>

        <div>
          <p className="text-gray-500">Amount</p>
          <p className="font-medium">
            ₹{Number(sale.saleAmount).toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Status</p>
          <p className={`font-semibold ${getStageColor(sale.paymentStatus)}`}>
            {sale.paymentStatus}
          </p>
          {getAllowedNextStages(sale.paymentStatus).length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {getAllowedNextStages(sale.paymentStatus).map((stage) => (
                <button
                  key={stage}
                  onClick={() => handleStatusChange(stage)}
                  className="px-3 py-1 text-xs bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  Move to {stage}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-gray-500">Payment Date</p>
          <p className="font-medium">20 March 2026</p>
        </div>

        <div>
          <p className="text-gray-500">Created By</p>
          <p className="font-medium">Raj Kumar</p>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/sales" className="text-blue-600 hover:underline">
          ← Back to Sales
        </Link>
      </div>
    </div>
  );
};

export default SalesDetails;

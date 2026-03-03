import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllApi } from "../../api/sales.api";
import Loader from "../../components/common/Loader";
const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchSales = async () => {
    try {
      const res = await getAllApi();
      setSales(res.data.data.content);
    } catch (err) {
      toast.error("Error fetching Sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);
  const getPaymentStatusColor = (status) => {
    const colors = {
      PENDING: "text-yellow-600",
      SUCCESSFUL: "text-green-600",
      FAILED: "text-red-600",
    };
    return colors[status] || "text-gray-600";
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Sales</h2>
      </div>

      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="py-2 text-left">Invoice</th>
            <th className="text-left">Customer</th>
            <th className="text-left">Amount</th>
            <th className="text-left">Sale Date</th>
            <th className="text-left">Status</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.length > 0 ? (
            sales.map((sale) => (
              <tr key={sale.id} className="border-b">
                <td className="py-3">{sale.invoiceNumber}</td>
                <td>{sale.customerName}</td>

                <td>₹{Number(sale.saleAmount).toLocaleString()}</td>
                <td>{sale.saleDate}</td>
                <td
                  className={`font-semibold  ${getPaymentStatusColor(sale.paymentStatus)}`}
                >
                  {sale.paymentStatus}
                </td>
                <td className="flex gap-4">
                  <Link
                    to={`/sales/${sale.id}/details`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-500">
                No Sales found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalesList;

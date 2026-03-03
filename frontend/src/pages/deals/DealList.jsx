import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllApi, deleteDealApi } from "../../api/deals.api";
import Loader from "../../components/common/Loader";

const DealList = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeals = async () => {
    try {
      const res = await getAllApi();
      setDeals(res.data.data.content);
    } catch (err) {
      toast.error("Error fetching deals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) return;

    try {
      await deleteDealApi(id);
      toast.success("Deal deleted successfully");
      fetchDeals();
    } catch (err) {
      toast.error(err.response?.data?.message);
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

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-6">Deals</h2>

      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="py-2 text-left">Lead</th>
            <th className="text-left">Stage</th>
            <th className="text-left">Amount</th>
            <th className="text-left">Closing Date</th>
            <th className="text-left">Assigned</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {deals.length > 0 ? (
            deals.map((deal) => {
              const isEditDisabled =
                deal.dealStage === "WON" || deal.dealStage === "LOST";

              const isDeleteDisabled =
                deal.dealStage === "WON" || deal.dealStage === "LOST";

              return (
                <tr key={deal.id} className="border-b">
                  <td className="py-3 font-medium">{deal.leadEmail}</td>

                  <td
                    className={`font-semibold ${getStageColor(deal.dealStage)}`}
                  >
                    {deal.dealStage}
                  </td>

                  <td>₹{Number(deal.expectedAmount).toLocaleString()}</td>

                  <td>{deal.closingDate}</td>

                  <td>
                    {deal.assignedUserEmail ? (
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                        {deal.assignedUserEmail}
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        Not Assigned
                      </span>
                    )}
                  </td>

                  <td className="flex gap-3">
                    <Link
                      to={`/deals/${deal.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>

                    {isEditDisabled ? (
                      <span className="text-gray-400 cursor-not-allowed">
                        Edit
                      </span>
                    ) : (
                      <Link
                        to={`/deals/${deal.id}/edit`}
                        className="text-green-600 hover:underline"
                      >
                        Edit
                      </Link>
                    )}

                    {deal.dealStage === "WON" && !deal.saleId && (
                      <Link
                        to={`/sales/add?dealId=${deal.id}`}
                        className="text-green-600 font-semibold hover:underline"
                      >
                        Create Sale
                      </Link>
                    )}

                    {deal.dealStage === "WON" && deal.saleId && (
                      <span className="text-gray-400">Sale Created</span>
                    )}

                    <button
                      onClick={() => handleDelete(deal.id)}
                      disabled={isDeleteDisabled}
                      className="text-red-600 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-500">
                No deals found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DealList;

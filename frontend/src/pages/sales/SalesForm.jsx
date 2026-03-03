import { Link } from "react-router-dom";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getDealByIdApi } from "../../api/deals.api";
import { createSaleApi } from "../../api/sales.api";
const SalesForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dealId = searchParams.get("dealId");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    saleAmount: "",
    saleDate: "",
    paymentStatus: "",
    dealId: dealId || "",
  });
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    if (dealId) {
      getDealByIdApi(dealId)
        .then((res) => {
          setCustomerEmail(res.data.data.leadEmail);
          setFormData((prev) => ({
            ...prev,
            saleAmount: res.data.data.expectedAmount,
          }));
        })
        .catch(() => toast.error("Error loading deal"));
    }
  }, [dealId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log(formData);
    if (!formData.saleAmount || !formData.saleDate) {
      return toast.error("All fields are required");
    }
    try {
      setLoading(true);
      await createSaleApi(formData);
      toast.success("Sale created successfully");
      navigate("/sales");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-6">Add Sale</h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Customer Email
          </label>
          <input
            type="text"
            value={customerEmail}
            disabled
            placeholder="Enter customer name"
            className="w-full border px-3 py-2 rounded-lg bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Amount</label>
          <input
            type="number"
            name="saleAmount"
            value={formData.saleAmount}
            onChange={handleChange}
            placeholder="Enter amount"
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Payment Date
          </label>
          <input
            type="date"
            name="saleDate"
            value={formData.saleDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save sale"}
        </button>

        <button
          onClick={() => navigate("/sales")}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SalesForm;

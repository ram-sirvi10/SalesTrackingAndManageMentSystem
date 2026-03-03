import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createDealApi,
  updateDealApi,
  getDealByIdApi,
} from "../../api/deals.api";
import { getLeadByIdApi } from "../../api/leads.api";

const DealForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get("leadId");

  const isEdit = !!id;
  console.log("Lead ID === ", id);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    expectedAmount: "",
    closingDate: "",
    leadId: leadId || "",
  });

  const [leadName, setLeadName] = useState("");

  useEffect(() => {
    if (isEdit) {
      getDealByIdApi(id)
        .then((res) => {
          const data = res.data.data;
          setFormData({
            expectedAmount: data.expectedAmount,
            closingDate: data.closingDate,
            leadId: data.leadId,
          });
          setLeadName(data.leadEmail);
        })
        .catch(() => toast.error("Error loading deal"));
    }
  }, [id, isEdit]);

  useEffect(() => {
    if (leadId && !isEdit) {
      getLeadByIdApi(leadId)
        .then((res) => {
          setLeadName(res.data.data.name);
        })
        .catch(() => toast.error("Error loading lead"));
    }
  }, [leadId, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log(formData);

    if (!formData.expectedAmount || !formData.closingDate) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      if (isEdit) {
        await updateDealApi(id, formData);
        toast.success("Deal updated successfully");
      } else {
        await createDealApi(formData);
        toast.success("Deal created successfully");
      }

      navigate("/deals");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">
        {isEdit ? "Edit Deal" : "Create Deal"}
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-2">Lead</label>
          <input
            type="text"
            value={leadName}
            disabled
            className="w-full border px-3 py-2 rounded-lg bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Expected Amount
          </label>
          <input
            type="number"
            name="expectedAmount"
            value={formData.expectedAmount}
            onChange={handleChange}
            placeholder="Enter amount"
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Closing Date */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Closing Date
          </label>
          <input
            type="date"
            name="closingDate"
            value={formData.closingDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Deal"}
        </button>

        <button
          onClick={() => navigate("/deals")}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DealForm;

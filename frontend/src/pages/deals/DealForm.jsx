import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { DollarSign, Calendar, Mail, ArrowLeft } from "lucide-react";
import {
  createDealApi,
  updateDealApi,
  getDealByIdApi,
} from "../../api/deals.api";
import { getLeadByIdApi } from "../../api/leads.api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

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
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isEdit ? "Edit Deal" : "Create New Deal"}
            </h2>
            <p className="text-gray-600 mt-1">
              {isEdit ? "Update deal information" : "Add a new deal to your pipeline"}
            </p>
          </div>
          <button
            onClick={() => navigate("/deals")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Lead Name (Disabled) */}
          <Input
            label="Lead"
            type="text"
            value={leadName}
            disabled
            icon={Mail}
            placeholder="Lead name"
          />

          {/* Expected Amount */}
          <Input
            label="Expected Amount"
            type="number"
            name="expectedAmount"
            value={formData.expectedAmount}
            onChange={handleChange}
            placeholder="Enter expected amount"
            icon={DollarSign}
          />

          {/* Closing Date */}
          <Input
            label="Closing Date"
            type="date"
            name="closingDate"
            value={formData.closingDate}
            onChange={handleChange}
            icon={Calendar}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            loading={loading}
          >
            {loading ? "Saving..." : isEdit ? "Update Deal" : "Create Deal"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/deals")}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DealForm;

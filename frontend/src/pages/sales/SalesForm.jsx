import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Mail, DollarSign, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { getDealByIdApi } from "../../api/deals.api";
import { createSaleApi } from "../../api/sales.api";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

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
    <div className="max-w-3xl">
      <Card>
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">Add Sale</h2>

        <div className="space-y-4">
          <Input
            label="Customer Email"
            type="text"
            value={customerEmail}
            disabled
            placeholder="Customer email"
            icon={Mail}
          />

          <Input
            label="Sale Amount"
            type="number"
            name="saleAmount"
            value={formData.saleAmount}
            onChange={handleChange}
            placeholder="Enter amount"
            icon={DollarSign}
          />

          <Input
            label="Payment Date"
            type="date"
            name="saleDate"
            value={formData.saleDate}
            onChange={handleChange}
            icon={Calendar}
          />
        </div>

        <div className="mt-8 flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            loading={loading}
            variant="primary"
          >
            Save Sale
          </Button>

          <Button onClick={() => navigate("/sales")} variant="secondary">
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SalesForm;

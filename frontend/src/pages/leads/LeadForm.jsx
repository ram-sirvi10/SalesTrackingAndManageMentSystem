import { useState, useEffect } from "react";
import { User, Mail, Phone, Globe } from "lucide-react";
import {
  createLeadApi,
  updateLeadApi,
  getLeadByIdApi,
} from "../../api/leads.api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";

const LeadForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getLeadByIdApi(id).then((res) => {
        setFormData(res.data.data);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (id) {
        await updateLeadApi(id, formData);
        toast.success("Lead updated");
      } else {
        await createLeadApi(formData);
        toast.success("Lead created");
      }
      navigate("/leads");
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <Card>
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">
          {id ? "Edit Lead" : "Add Lead"}
        </h2>

        <div className="space-y-4">
          <Input
            label="Lead Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter lead name"
            icon={User}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            icon={Mail}
          />

          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            icon={Phone}
          />

          <Select
            label="Source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder="Select source"
            options={[
              { value: "Website", label: "Website" },
              { value: "Referral", label: "Referral" },
              { value: "LinkedIn", label: "LinkedIn" },
            ]}
          />
        </div>

        <div className="mt-8 flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            loading={loading}
            variant="primary"
          >
            Save
          </Button>

          <Button onClick={() => navigate("/leads")} variant="secondary">
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LeadForm;

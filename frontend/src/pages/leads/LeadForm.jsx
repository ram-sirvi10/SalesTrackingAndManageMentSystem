import { useState, useEffect } from "react";
import {
  createLeadApi,
  updateLeadApi,
  getLeadByIdApi,
} from "../../api/leads.api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const LeadForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

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
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-6">
        {id ? "Edit Lead" : "Add Lead"}
      </h2>

      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Lead Name"
        className="border p-2 w-full mb-3"
      />

      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 w-full mb-3"
      />

      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="border p-2 w-full mb-3"
      />

      <select
        name="source"
        value={formData.source}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      >
        <option value="">Select Source</option>
        <option>Website</option>
        <option>Referral</option>
        <option>LinkedIn</option>
      </select>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default LeadForm;

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { User, Calendar, DollarSign, Target, ArrowLeft } from "lucide-react";
import {
  createTargetApi,
  updateTargetApi,
  getTargetByIdApi,
} from "../../api/targets.api";
import UserSelectModal from "../../components/common/UserSelecetModel";
import toast from "react-hot-toast";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";

const TargetForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userId: "",
    targetMonth: "",
    targetYear: "",
    targetAmount: "",
  });

  const [userEmail, setUserEmail] = useState("");
  const [userModal, setUserModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) fetchTarget();
  }, [id]);

  const fetchTarget = async () => {
    try {
      const res = await getTargetByIdApi(id);
      const data = res.data.data;

      setForm({
        userId: data.userId,
        targetMonth: data.targetMonth,
        targetYear: data.targetYear,
        targetAmount: data.targetAmount,
      });

      setUserEmail(data.userEmail);
    } catch {
      toast.error("Error loading target");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.userId || !form.targetMonth || !form.targetYear || !form.targetAmount) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updateTargetApi(id, form);
        toast.success("Target updated successfully");
      } else {
        await createTargetApi(form);
        toast.success("Target created successfully");
      }
      navigate("/targets");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    value: currentYear + i,
    label: (currentYear + i).toString(),
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Target className="text-primary-600" />
              {isEdit ? "Edit Target" : "Create New Target"}
            </h2>
            <p className="text-gray-600 mt-1">
              {isEdit ? "Update target information" : "Set a new sales target for a user"}
            </p>
          </div>
          <Link to="/targets">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft size={20} />
            </button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Selection */}
          <div>
            <Input
              label="Assigned User"
              value={userEmail || "Click to select user"}
              readOnly
              onClick={() => setUserModal(true)}
              icon={User}
              placeholder="Select a user"
              className="cursor-pointer"
            />
            {!form.userId && (
              <p className="text-xs text-gray-500 mt-1">
                Click the field above to select a user
              </p>
            )}
          </div>

          {/* Month and Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Month
              </label>
              <Select
                options={monthOptions}
                value={form.targetMonth}
                onChange={(e) => setForm({ ...form, targetMonth: Number(e.target.value) })}
                placeholder="Select month"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Year
              </label>
              <Select
                options={yearOptions}
                value={form.targetYear}
                onChange={(e) => setForm({ ...form, targetYear: Number(e.target.value) })}
                placeholder="Select year"
              />
            </div>
          </div>

          {/* Target Amount */}
          <Input
            label="Target Amount"
            type="number"
            value={form.targetAmount}
            onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
            placeholder="Enter target amount"
            icon={DollarSign}
            min="0"
            step="0.01"
          />

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Button type="submit" disabled={loading} loading={loading}>
              {loading ? "Saving..." : isEdit ? "Update Target" : "Create Target"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/targets")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      <UserSelectModal
        isOpen={userModal}
        onClose={() => setUserModal(false)}
        title="Select User for Target"
        onSelect={(u) => {
          setForm({ ...form, userId: u.id });
          setUserEmail(u.email);
          setUserModal(false);
        }}
      />
    </div>
  );
};

export default TargetForm;

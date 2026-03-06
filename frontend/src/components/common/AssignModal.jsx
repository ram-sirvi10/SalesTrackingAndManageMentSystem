import toast from "react-hot-toast";
import UserSelectModal from "./UserSelecetModel";
const AssignModal = ({
  isOpen,
  onClose,
  entityType,
  entityId,
  assignApi,
  onSuccess,
}) => {
  const handleAssign = async (user) => {
    if (!user) {
      toast.error("Select user first");
      return;
    }

    try {
      const payload =
        entityType === "lead"
          ? { leadId: entityId, userId: user.id }
          : { dealId: entityId, userId: user.id };
      await assignApi(payload);
      toast.success("Assigned successfully");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.log("Error ", err);
      toast.error(err.response?.data?.message || "Assign failed");
    }
  };

  if (!isOpen) return null;

  return (
    <UserSelectModal
      isOpen={isOpen}
      onClose={onClose}
      title="Select User "
      onSelect={(user) => handleAssign(user)}
    />
  );
};

export default AssignModal;

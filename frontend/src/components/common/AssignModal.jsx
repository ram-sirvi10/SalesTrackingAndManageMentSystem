import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllUsersAPi } from "../../api/users.api";

const AssignModal = ({
  isOpen,
  onClose,
  entityType,
  entityId,
  assignApi,
  onSuccess,
}) => {
  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(0);
  const [totalUserPages, setTotalUserPages] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (page = 0, searchValue = "") => {
    try {
      const res = await getAllUsersAPi(page, 5, searchValue);
      setUsers(res.data.data.content);
      setTotalUserPages(res.data.data.totalPages);
      setUserPage(page);
    } catch (err) {
      toast.error("Error fetching users");
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedUserId(null);
      fetchUsers(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (isOpen) {
        fetchUsers(0, search);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  const handleAssign = async () => {
    if (!selectedUserId) {
      toast.error("Select user first");
      return;
    }

    try {
      setLoading(true);

      const payload =
        entityType === "lead"
          ? { leadId: entityId, userId: selectedUserId }
          : { dealId: entityId, userId: selectedUserId };
      console.log(payload);
      await assignApi(payload);

      toast.success("Assigned successfully");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Assign failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-[500px] p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Assign User</h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search user..."
          className="border w-full p-2 mb-3 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* User List */}
        <div className="max-h-60 overflow-y-auto mb-4">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
              className={`p-2 border mb-2 rounded cursor-pointer ${
                selectedUserId === user.id ? "bg-blue-100 border-blue-500" : ""
              }`}
            >
              {user.name} ({user.email})
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between mb-4">
          <button
            disabled={userPage === 0}
            onClick={() => fetchUsers(userPage - 1, search)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={userPage + 1 >= totalUserPages}
            onClick={() => fetchUsers(userPage + 1, search)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={handleAssign}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;

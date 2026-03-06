import { useEffect, useState } from "react";
import { Search, User, ChevronLeft, ChevronRight, X } from "lucide-react";
import toast from "react-hot-toast";
import { getAllUsersAPi } from "../../api/users.api";
import Loader from "./Loader";
import Button from "./Button";
import Input from "./Input";

const UserSelectModal = ({
  isOpen,
  onClose,
  onSelect,
  title = "Select User",
}) => {
  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(0);
  const [totalUserPages, setTotalUserPages] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (page = 0, searchValue = "") => {
    try {
      setLoading(true);
      const res = await getAllUsersAPi(page, 5, searchValue);
      setUsers(res.data.data.content);
      setTotalUserPages(res.data.data.totalPages);
      setUserPage(page);
    } catch {
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      fetchUsers(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (isOpen) fetchUsers(0, search);
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white w-full max-w-lg mx-4 rounded-xl shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-xl font-bold text-secondary-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-secondary-600" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-secondary-200">
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
            autoFocus
          />
        </div>

        {/* User List */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader size="md" />
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    onSelect(user);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-4 border border-secondary-200 rounded-lg cursor-pointer hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                    <User size={20} className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary-900 truncate">{user.name}</p>
                    <p className="text-sm text-secondary-600 truncate">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User size={32} className="text-secondary-400" />
              </div>
              <p className="text-secondary-600">No users found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {users.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-200 bg-secondary-50 rounded-b-xl">
            <p className="text-sm text-secondary-600">
              Page {userPage + 1} of {totalUserPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={userPage === 0}
                onClick={() => fetchUsers(userPage - 1, search)}
                icon={ChevronLeft}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={userPage + 1 >= totalUserPages}
                onClick={() => fetchUsers(userPage + 1, search)}
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSelectModal;

import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { FiTrash2, FiEdit2, FiX, FiSearch } from "react-icons/fi";
import Loader from "../../components/common/Loader";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [editRole, setEditRole] = useState("user");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (q = "") => {
    setLoading(true);
    try {
      const { data } = await axios.get("/users", {
        params: q ? { search: q } : {},
      });
      setUsers(data.users);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const handleUpdateRole = async () => {
    setEditLoading(true);
    try {
      await axios.put(`/users/${editUser._id}`, { role: editRole });
      toast.success("User role updated!");
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update");
    }
    setEditLoading(false);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`/users/${userId}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-500 text-sm mt-1">
            {users.length} total users
          </p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 
                       rounded-xl text-sm focus:outline-none 
                       focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl 
                     text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Search
        </button>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["User", "Email", "Role", "Joined", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-gray-500 font-semibold 
                                 px-4 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full bg-indigo-600 
                                        flex items-center justify-center 
                                        text-white font-bold text-xs flex-shrink-0"
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-bold px-2 py-1 
                                        rounded-full ${
                                          user.role === "admin"
                                            ? "bg-purple-100 text-purple-700"
                                            : "bg-green-100 text-green-700"
                                        }`}
                      >
                        {user.role === "admin" ? "👑 Admin" : "👤 User"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditUser(user);
                            setEditRole(user.role);
                          }}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 
                                     rounded-lg transition-colors"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 text-red-500 hover:bg-red-50 
                                     rounded-lg transition-colors"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No users found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editUser && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center 
                        justify-center p-4"
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Update User Role</h2>
              <button onClick={() => setEditUser(null)}>
                <FiX size={20} className="text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Updating role for <strong>{editUser.name}</strong>
            </p>
            <select
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 
                         text-sm focus:outline-none focus:ring-2 
                         focus:ring-indigo-500 bg-white mb-4"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setEditUser(null)}
                className="flex-1 border border-gray-200 text-gray-700 
                           font-medium py-2.5 rounded-xl hover:bg-gray-50 
                           transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={editLoading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white 
                           font-semibold py-2.5 rounded-xl transition-colors 
                           text-sm disabled:opacity-60"
              >
                {editLoading ? "Updating..." : "Update Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

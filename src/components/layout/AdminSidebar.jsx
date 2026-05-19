import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";
import toast from "react-hot-toast";
import {
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiTag,
  FiLogOut,
  FiX,
} from "react-icons/fi";

const NAV_ITEMS = [
  { path: "/admin/dashboard", label: "Dashboard", icon: FiGrid },
  { path: "/admin/products", label: "Products", icon: FiPackage },
  { path: "/admin/orders", label: "Orders", icon: FiShoppingBag },
  { path: "/admin/users", label: "Users", icon: FiUsers },
  { path: "/admin/coupons", label: "Coupons", icon: FiTag },
];

const AdminSidebar = ({ open, onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 
                         text-white z-30 transform transition-transform 
                         duration-300 flex flex-col
                         ${open ? "translate-x-0" : "-translate-x-full"} 
                         lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Header */}
        <div
          className="p-6 border-b border-gray-700 flex items-center 
                        justify-between"
        >
          <div>
            <Link to="/" className="text-xl font-bold text-white">
              Shop<span className="text-indigo-400">Ease</span>
            </Link>
            <p className="text-gray-400 text-xs mt-1">Admin Panel</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* User */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full bg-indigo-600 flex 
                            items-center justify-center text-white 
                            font-bold text-sm flex-shrink-0"
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm truncate">
                {user?.name}
              </p>
              <p className="text-gray-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl 
                          text-sm font-medium transition-colors ${
                            location.pathname === path
                              ? "bg-indigo-600 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white"
                          }`}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl 
                       text-sm font-medium text-gray-400 hover:bg-gray-800 
                       hover:text-white transition-colors"
          >
            🏠 Back to Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl 
                       text-sm font-medium text-red-400 hover:bg-red-900/30 
                       transition-colors"
          >
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

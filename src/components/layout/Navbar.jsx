import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";
import toast from "react-hot-toast";
import {
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiPackage,
  FiShield,
  FiChevronDown,
} from "react-icons/fi";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { cart } = useSelector((s) => s.cart);
  const { wishlist } = useSelector((s) => s.wishlist);

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(null);

  const navTimeoutRef = useRef(null);

  const cartCount = cart?.items?.length || 0;
  const wishlistCount = wishlist?.items?.length || 0;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully");
    navigate("/login");
    setDropdownOpen(false);
  };

  // Better hover handling
  const handleNavEnter = (section) => {
    clearTimeout(navTimeoutRef.current);

    setActiveNav((prev) => {
      if (prev !== section) {
        return section;
      }
      return prev;
    });
  };

  const handleNavLeave = () => {
    clearTimeout(navTimeoutRef.current);

    navTimeoutRef.current = setTimeout(() => {
      setActiveNav(null);
    }, 120);
  };

  const MEN_LINKS = [
    {
      to: "/products?gender=Men&category=Clothing",
      icon: "👕",
      label: "Men's Clothing",
    },
    {
      to: "/products?gender=Men&category=Footwear",
      icon: "👟",
      label: "Men's Footwear",
    },
    {
      to: "/products?gender=Men&category=Sports",
      icon: "⚽",
      label: "Men's Sports",
    },
    {
      to: "/products?gender=Men",
      icon: "👔",
      label: "View All Men's",
      border: true,
    },
  ];

  const WOMEN_LINKS = [
    {
      to: "/products?gender=Women&category=Clothing",
      icon: "👗",
      label: "Women's Clothing",
    },
    {
      to: "/products?gender=Women&category=Footwear",
      icon: "👠",
      label: "Women's Footwear",
    },
    {
      to: "/products?gender=Women&category=Beauty",
      icon: "💄",
      label: "Women's Beauty",
    },
    {
      to: "/products?gender=Women",
      icon: "👗",
      label: "View All Women's",
      border: true,
    },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Shop<span className="italic text-amber-600">Ease</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Home */}
            <Link
              to="/"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors rounded-lg hover:bg-gray-50"
            >
              Home
            </Link>

            {/* Products */}
            <Link
              to="/products"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors rounded-lg hover:bg-gray-50"
            >
              Products
            </Link>

            {/* Men Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                clearTimeout(navTimeoutRef.current);
                handleNavEnter("men");
              }}
              onMouseLeave={handleNavLeave}
            >
              <button
                className={`flex items-center gap-1 px-4 py-2 font-medium text-sm transition-colors rounded-lg ${
                  activeNav === "men"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Men
                <FiChevronDown
                  size={14}
                  className={`transition-transform ${
                    activeNav === "men" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeNav === "men" && (
                <div
                  className="absolute top-full left-0 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50"
                  onMouseEnter={() => handleNavEnter("men")}
                  onMouseLeave={handleNavLeave}
                >
                  {MEN_LINKS.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setActiveNav(null)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                        link.border
                          ? "border-t border-gray-100 mt-1 pt-3 font-semibold text-indigo-600 hover:text-indigo-800"
                          : ""
                      }`}
                    >
                      <span>{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Women Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                clearTimeout(navTimeoutRef.current);
                handleNavEnter("women");
              }}
              onMouseLeave={handleNavLeave}
            >
              <button
                className={`flex items-center gap-1 px-4 py-2 font-medium text-sm transition-colors rounded-lg ${
                  activeNav === "women"
                    ? "bg-pink-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Women
                <FiChevronDown
                  size={14}
                  className={`transition-transform ${
                    activeNav === "women" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeNav === "women" && (
                <div
                  className="absolute top-full left-0 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50"
                  onMouseEnter={() => handleNavEnter("women")}
                  onMouseLeave={handleNavLeave}
                >
                  {WOMEN_LINKS.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setActiveNav(null)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                        link.border
                          ? "border-t border-gray-100 mt-1 pt-3 font-semibold text-pink-600 hover:text-pink-800"
                          : ""
                      }`}
                    >
                      <span>{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="relative text-gray-600 hover:text-red-500 transition-colors p-2"
              >
                <FiHeart size={22} />

                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-gray-600 hover:text-indigo-600 transition-colors p-2"
            >
              <FiShoppingCart size={22} />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />

                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-bold text-gray-800 text-sm truncate">
                          {user?.name}
                        </p>

                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <FiUser size={15} /> My Profile
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <FiPackage size={15} /> My Orders
                      </Link>

                      {user?.role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-indigo-600 font-semibold hover:bg-indigo-50"
                        >
                          <FiShield size={15} /> Admin Panel
                        </Link>
                      )}

                      <div className="border-t border-gray-100 mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left"
                        >
                          <FiLogOut size={15} /> Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-600 p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

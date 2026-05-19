import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../store/slices/authSlice";
import { fetchCart } from "../store/slices/cartSlice";
import { fetchWishlist } from "../store/slices/wishlistSlice";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const REGISTER_IMAGE =
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [isAuthenticated, error]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    const result = await dispatch(
      registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    );
    if (result.meta.requestStatus === "fulfilled") {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
      toast.success("Welcome to ShopEase!");
      navigate("/");
    }
  };

  const strength =
    formData.password.length === 0
      ? 0
      : formData.password.length < 4
        ? 1
        : formData.password.length < 7
          ? 2
          : formData.password.length < 10
            ? 3
            : 4;

  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "",
    "bg-red-400",
    "bg-yellow-400",
    "bg-blue-400",
    "bg-green-400",
  ];

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {/* ── Left: Image Panel ──────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={REGISTER_IMAGE}
          alt="Shopping"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 
                        via-black/30 to-black/10"
        />
        <div className="relative z-10 flex flex-col justify-end p-16 text-white">
          <p
            className="text-amber-300 text-xs font-sans tracking-[0.3em] 
                        uppercase mb-3"
          >
            Join Us
          </p>
          <h2 className="text-5xl font-bold leading-tight mb-4">
            Shop Smarter,
            <br />
            <span className="italic text-amber-300">Live Better</span>
          </h2>
          <div className="grid grid-cols-2 gap-4 mt-6 max-w-xs">
            {[
              { value: "10K+", label: "Products" },
              { value: "50K+", label: "Happy Customers" },
              { value: "9+", label: "Categories" },
              { value: "24hr", label: "Fast Delivery" },
            ].map((s) => (
              <div
                key={s.label}
                className="border border-white/20 p-3 backdrop-blur-sm"
              >
                <p className="text-amber-300 font-bold text-lg">{s.value}</p>
                <p className="text-gray-300 text-xs font-sans">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Form Panel ──────────────────────────── */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center 
                      bg-[#faf9f7] px-8 py-12 overflow-y-auto"
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="block mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Shop<span className="italic text-amber-600">Ease</span>
            </h1>
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Create your account
            </h2>
            <p className="text-gray-500 font-sans text-sm">
              Join thousands of happy shoppers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                className="block text-xs font-sans font-semibold 
                                text-gray-700 tracking-widest uppercase mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <FiUser
                  className="absolute left-4 top-1/2 -translate-y-1/2 
                                   text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 
                             bg-white font-sans text-sm focus:outline-none 
                             focus:border-gray-900 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-xs font-sans font-semibold 
                                text-gray-700 tracking-widest uppercase mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <FiMail
                  className="absolute left-4 top-1/2 -translate-y-1/2 
                                   text-gray-400"
                  size={16}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 
                             bg-white font-sans text-sm focus:outline-none 
                             focus:border-gray-900 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs font-sans font-semibold 
                                text-gray-700 tracking-widest uppercase mb-2"
              >
                Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 
                                   text-gray-400"
                  size={16}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Min. 6 characters"
                  className="w-full pl-11 pr-11 py-3.5 border border-gray-200 
                             bg-white font-sans text-sm focus:outline-none 
                             focus:border-gray-900 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 
                             text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>

              {/* Strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((l) => (
                      <div
                        key={l}
                        className={`h-1 flex-1 transition-all duration-300 
                                    ${
                                      strength >= l
                                        ? strengthColors[strength]
                                        : "bg-gray-200"
                                    }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-sans text-gray-400 mt-1">
                    {strengthLabels[strength]} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className="block text-xs font-sans font-semibold 
                                text-gray-700 tracking-widest uppercase mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 
                                   text-gray-400"
                  size={16}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Re-enter password"
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 
                             bg-white font-sans text-sm focus:outline-none 
                             focus:border-gray-900 transition-colors"
                />
              </div>
              {formData.confirmPassword && (
                <p
                  className={`text-xs font-sans mt-1 ${
                    formData.password === formData.confirmPassword
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {formData.password === formData.confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white font-sans font-bold 
                         text-sm tracking-widest uppercase py-4 
                         hover:bg-amber-600 transition-colors duration-300
                         disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div
                  className="w-4 h-4 border-2 border-white 
                                border-t-transparent rounded-full animate-spin"
                />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center font-sans text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-gray-900 font-bold hover:text-amber-600 
                         transition-colors underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs font-sans text-gray-400 mt-4">
            By creating an account, you agree to our{" "}
            <span className="underline cursor-pointer">Terms</span> &{" "}
            <span className="underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

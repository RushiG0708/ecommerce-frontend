import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../store/slices/authSlice";
import { fetchCart } from "../store/slices/cartSlice";
import { fetchWishlist } from "../store/slices/wishlistSlice";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const LOGIN_IMAGE =
  "https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?w=1200&q=80";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [isAuthenticated, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (result.meta.requestStatus === "fulfilled") {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
      toast.success("Welcome back!");
      navigate("/");
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {/* ── Left: Image Panel ──────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={LOGIN_IMAGE}
          alt="Fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 
                        via-black/20 to-transparent"
        />
        <div className="relative z-10 flex flex-col justify-end p-16 text-white">
          <p
            className="text-amber-300 text-xs font-sans tracking-[0.3em] 
                        uppercase mb-3"
          >
            ShopEase
          </p>
          <h2 className="text-5xl font-bold leading-tight mb-4">
            Your Style,
            <br />
            <span className="italic text-amber-300">Your Story</span>
          </h2>
          <p
            className="text-gray-300 font-sans text-sm leading-relaxed 
                        max-w-xs"
          >
            Discover thousands of curated products. Fast delivery, easy returns.
          </p>
        </div>
      </div>

      {/* ── Right: Form Panel ──────────────────────────── */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center 
                      bg-[#faf9f7] px-8"
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="block mb-10">
            <h1 className="text-3xl font-bold text-gray-900">
              Shop<span className="italic text-amber-600">Ease</span>
            </h1>
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome back
            </h2>
            <p className="text-gray-500 font-sans text-sm">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
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
              <div className="flex items-center justify-between mb-2">
                <label
                  className="text-xs font-sans font-semibold 
                                  text-gray-700 tracking-widest uppercase"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-sans text-amber-600 
                             hover:text-amber-800"
                >
                  Forgot password?
                </Link>
              </div>
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
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  placeholder="••••••••"
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
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-sans text-gray-400 tracking-widest">
              OR
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-center font-sans text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-gray-900 font-bold hover:text-amber-600 
                         transition-colors underline underline-offset-2"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

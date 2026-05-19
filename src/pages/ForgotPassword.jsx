import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import { FiMail, FiArrowLeft } from "react-icons/fi";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await dispatch(forgotPassword(email));
    setLoading(false);
    if (result.meta.requestStatus === "fulfilled") {
      setSent(true);
      toast.success("Reset email sent!");
    } else {
      toast.error(result.payload || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <Link
            to="/login"
            className="flex items-center gap-2 text-gray-500 
                       hover:text-gray-700 text-sm mb-6"
          >
            <FiArrowLeft size={16} /> Back to Login
          </Link>

          {sent ? (
            <div className="text-center py-6">
              <div
                className="w-16 h-16 bg-green-100 rounded-full flex 
                              items-center justify-center mx-auto mb-4"
              >
                <FiMail size={28} className="text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Check your email
              </h2>
              <p className="text-gray-500 text-sm">
                We sent a password reset link to{" "}
                <span className="font-medium text-gray-700">{email}</span>
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Forgot password?
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail
                      className="absolute left-3 top-1/2 -translate-y-1/2 
                                 text-gray-400"
                      size={18}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 
                                 rounded-xl focus:outline-none focus:ring-2 
                                 focus:ring-primary-500 text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 
                             text-white font-semibold py-3 rounded-xl 
                             transition-colors disabled:opacity-60
                             flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div
                        className="w-4 h-4 border-2 border-white 
                                      border-t-transparent rounded-full 
                                      animate-spin"
                      />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

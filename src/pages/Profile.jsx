import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, changePassword } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiLock,
  FiCamera,
  FiEye,
  FiEyeOff,
  FiSave,
  FiPackage,
  FiHeart,
  FiShield,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.auth);

  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ── Avatar Change ──────────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image must be less than 2MB");
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ── Update Profile ─────────────────────────────────────
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("email", profileData.email);
    if (avatarFile) formData.append("avatar", avatarFile);

    const result = await dispatch(updateProfile(formData));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Profile updated successfully!");
      setAvatarFile(null);
      setAvatarPreview(null);
    } else {
      toast.error(result.payload || "Failed to update profile");
    }
  };

  // ── Change Password ────────────────────────────────────
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (passwordData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    setPasswordLoading(true);
    const result = await dispatch(
      changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    );
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      toast.error(result.payload || "Failed to change password");
    }
    setPasswordLoading(false);
  };

  const tabs = [
    { id: "profile", label: "My Profile", icon: FiUser },
    { id: "password", label: "Change Password", icon: FiLock },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Account Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ── Sidebar ──────────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-4">
          {/* User Card */}
          <div
            className="bg-white rounded-2xl border border-gray-100 p-6 
                          text-center"
          >
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div
                className="w-20 h-20 rounded-full overflow-hidden 
                              bg-indigo-600 flex items-center justify-center 
                              mx-auto"
              >
                {avatarPreview || user?.avatar?.url ? (
                  <img
                    src={avatarPreview || user.avatar.url}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-3xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-indigo-600 text-white 
                           p-1.5 rounded-full hover:bg-indigo-700 
                           transition-colors shadow-md"
              >
                <FiCamera size={12} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <h3 className="font-bold text-gray-800">{user?.name}</h3>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span
              className={`inline-block mt-2 text-xs font-bold px-3 py-1 
                              rounded-full ${
                                user?.role === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-green-100 text-green-700"
                              }`}
            >
              {user?.role === "admin" ? "👑 Admin" : "👤 Customer"}
            </span>
          </div>

          {/* Nav Tabs */}
          <div
            className="bg-white rounded-2xl border border-gray-100 p-3 
                          space-y-1"
          >
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 
                            rounded-xl text-sm font-medium transition-colors 
                            text-left ${
                              activeTab === id
                                ? "bg-indigo-600 text-white"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>

          {/* Quick Links */}
          <div
            className="bg-white rounded-2xl border border-gray-100 p-3 
                          space-y-1"
          >
            <p
              className="text-xs font-semibold text-gray-400 px-4 py-2 
                          uppercase tracking-wider"
            >
              Quick Links
            </p>
            <Link
              to="/orders"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl 
                         text-sm font-medium text-gray-600 hover:bg-gray-50 
                         transition-colors"
            >
              <FiPackage size={16} /> My Orders
            </Link>
            <Link
              to="/wishlist"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl 
                         text-sm font-medium text-gray-600 hover:bg-gray-50 
                         transition-colors"
            >
              <FiHeart size={16} /> Wishlist
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl 
                           text-sm font-medium text-purple-600 hover:bg-purple-50 
                           transition-colors"
              >
                <FiShield size={16} /> Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* ── Main Content ──────────────────────────────────── */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2
                className="text-lg font-bold text-gray-800 mb-6 
                             flex items-center gap-2"
              >
                <FiUser className="text-indigo-600" /> Personal Information
              </h2>

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                {/* Avatar Preview */}
                {avatarPreview && (
                  <div
                    className="flex items-center gap-4 p-4 bg-indigo-50 
                                  rounded-xl border border-indigo-100"
                  >
                    <img
                      src={avatarPreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover 
                                 border-2 border-indigo-200"
                    />
                    <div>
                      <p className="text-sm font-medium text-indigo-700">
                        New avatar selected
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarPreview(null);
                          setAvatarFile(null);
                        }}
                        className="text-xs text-red-500 hover:text-red-700 
                                   mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser
                      className="absolute left-3 top-1/2 -translate-y-1/2 
                                 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 
                                 rounded-xl text-sm focus:outline-none 
                                 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Email */}
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
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 
                                 rounded-xl text-sm focus:outline-none 
                                 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Role (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                  </label>
                  <input
                    type="text"
                    value={
                      user?.role === "admin" ? "Administrator" : "Customer"
                    }
                    readOnly
                    className="w-full px-4 py-3 border border-gray-100 
                               rounded-xl text-sm bg-gray-50 text-gray-500 
                               cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-indigo-600 
                             hover:bg-indigo-700 text-white font-semibold 
                             px-6 py-3 rounded-xl transition-colors 
                             disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div
                        className="w-4 h-4 border-2 border-white 
                                      border-t-transparent rounded-full 
                                      animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={16} /> Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2
                className="text-lg font-bold text-gray-800 mb-2 
                             flex items-center gap-2"
              >
                <FiLock className="text-indigo-600" /> Change Password
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Make sure your new password is at least 6 characters long.
              </p>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <FiLock
                      className="absolute left-3 top-1/2 -translate-y-1/2 
                                 text-gray-400"
                      size={18}
                    />
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter current password"
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 
                                 rounded-xl text-sm focus:outline-none 
                                 focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 
                                 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <FiLock
                      className="absolute left-3 top-1/2 -translate-y-1/2 
                                 text-gray-400"
                      size={18}
                    />
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter new password"
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 
                                 rounded-xl text-sm focus:outline-none 
                                 focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 
                                 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <FiLock
                      className="absolute left-3 top-1/2 -translate-y-1/2 
                                 text-gray-400"
                      size={18}
                    />
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                      placeholder="Confirm new password"
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 
                                 rounded-xl text-sm focus:outline-none 
                                 focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 
                                 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>

                  {/* Match indicator */}
                  {passwordData.confirmPassword && (
                    <p
                      className={`text-xs mt-1 ${
                        passwordData.newPassword ===
                        passwordData.confirmPassword
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {passwordData.newPassword === passwordData.confirmPassword
                        ? "✓ Passwords match"
                        : "✗ Passwords do not match"}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex items-center gap-2 bg-indigo-600 
                             hover:bg-indigo-700 text-white font-semibold 
                             px-6 py-3 rounded-xl transition-colors 
                             disabled:opacity-60"
                >
                  {passwordLoading ? (
                    <>
                      <div
                        className="w-4 h-4 border-2 border-white 
                                      border-t-transparent rounded-full 
                                      animate-spin"
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiLock size={16} /> Update Password
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

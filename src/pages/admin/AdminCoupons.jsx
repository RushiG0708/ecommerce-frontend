import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiTrash2,
  FiX,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import Loader from "../../components/common/Loader";

const EMPTY_FORM = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minOrderAmount: "",
  maxUses: "100",
  expiresAt: "",
};

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/coupons");
      setCoupons(data.coupons);
    } catch (err) {
      toast.error("Failed to fetch coupons");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await axios.post("/coupons", formData);
      toast.success("Coupon created!");
      setShowModal(false);
      setFormData(EMPTY_FORM);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create coupon");
    }
    setSubmitLoading(false);
  };

  const handleToggle = async (coupon) => {
    try {
      await axios.put(`/coupons/${coupon._id}`, {
        isActive: !coupon.isActive,
      });
      toast.success(`Coupon ${coupon.isActive ? "deactivated" : "activated"}!`);
      fetchCoupons();
    } catch (err) {
      toast.error("Failed to update coupon");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await axios.delete(`/coupons/${id}`);
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Coupons</h1>
          <p className="text-gray-500 text-sm mt-1">Manage discount codes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 
                     rounded-xl text-sm font-semibold flex items-center gap-2 
                     transition-colors"
        >
          <FiPlus size={16} /> Create Coupon
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-gray-400">
              No coupons yet. Create your first one!
            </div>
          ) : (
            coupons.map((coupon) => (
              <div
                key={coupon._id}
                className={`bg-white rounded-2xl border p-5 transition-all ${
                  coupon.isActive
                    ? "border-green-200"
                    : "border-gray-100 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono font-bold text-lg text-gray-800">
                      {coupon.code}
                    </p>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 
                                      rounded-full ${
                                        coupon.isActive
                                          ? "bg-green-100 text-green-700"
                                          : "bg-gray-100 text-gray-500"
                                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(coupon)}
                      className="text-gray-400 hover:text-indigo-600 
                                 transition-colors"
                    >
                      {coupon.isActive ? (
                        <FiToggleRight size={22} className="text-green-500" />
                      ) : (
                        <FiToggleLeft size={22} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="text-gray-400 hover:text-red-500 
                                 transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Discount</span>
                    <span className="font-semibold text-indigo-600">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Min Order</span>
                    <span>₹{coupon.minOrderAmount || 0}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Usage</span>
                    <span>
                      {coupon.usedCount} / {coupon.maxUses}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Expires</span>
                    <span
                      className={
                        new Date(coupon.expiresAt) < new Date()
                          ? "text-red-500"
                          : ""
                      }
                    >
                      {new Date(coupon.expiresAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Usage bar */}
                <div className="mt-3">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          (coupon.usedCount / coupon.maxUses) * 100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center 
                        justify-center p-4"
        >
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div
              className="flex items-center justify-between p-6 border-b 
                            border-gray-100"
            >
              <h2 className="text-lg font-bold text-gray-800">Create Coupon</h2>
              <button onClick={() => setShowModal(false)}>
                <FiX size={20} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="e.g. SAVE20"
                  className="w-full border border-gray-200 rounded-xl px-4 
                             py-2.5 text-sm focus:outline-none 
                             focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 
                               py-2.5 text-sm focus:outline-none 
                               focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountValue: e.target.value,
                      })
                    }
                    placeholder={
                      formData.discountType === "percentage" ? "20" : "100"
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 
                               py-2.5 text-sm focus:outline-none 
                               focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minOrderAmount: e.target.value,
                      })
                    }
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-4 
                               py-2.5 text-sm focus:outline-none 
                               focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Uses
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxUses}
                    onChange={(e) =>
                      setFormData({ ...formData, maxUses: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 
                               py-2.5 text-sm focus:outline-none 
                               focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.expiresAt}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setFormData({ ...formData, expiresAt: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 
                             py-2.5 text-sm focus:outline-none 
                             focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-700 
                             font-medium py-2.5 rounded-xl hover:bg-gray-50 
                             transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white 
                             font-semibold py-2.5 rounded-xl transition-colors 
                             text-sm disabled:opacity-60"
                >
                  {submitLoading ? "Creating..." : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;

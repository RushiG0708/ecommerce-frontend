import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../store/slices/cartSlice";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import {
  FiMapPin,
  FiPhone,
  FiUser,
  FiHome,
  FiTag,
  FiCheck,
  FiArrowRight,
} from "react-icons/fi";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);

  const [step, setStep] = useState(1); // 1=shipping, 2=review
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "India",
    pinCode: "",
    phone: "",
  });

  useEffect(() => {
    dispatch(fetchCart());
    // Load saved shipping from sessionStorage
    const saved = sessionStorage.getItem("shippingInfo");
    if (saved) setShippingInfo(JSON.parse(saved));
  }, []);

  const items = cart?.items || [];
  const itemsPrice = cart?.totalPrice || 0;
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const totalPrice = itemsPrice + shippingPrice - discountAmount;

  // ── Handle Shipping Submit ─────────────────────────────
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
    setStep(2);
    window.scrollTo(0, 0);
  };

  // ── Apply Coupon ───────────────────────────────────────
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return toast.error("Enter a coupon code");
    setCouponLoading(true);
    try {
      const { data } = await axios.post("/orders/validate-coupon", {
        couponCode,
        orderAmount: itemsPrice,
      });
      setAppliedCoupon(data.coupon);
      toast.success(`Coupon applied! You save ₹${data.coupon.discountAmount}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
      setAppliedCoupon(null);
    }
    setCouponLoading(false);
  };

  // ── Razorpay Payment ───────────────────────────────────
  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create Razorpay order on backend
      const { data } = await axios.post("/orders/razorpay", {
        couponCode: appliedCoupon?.code || "",
      });

      // 2. Open Razorpay checkout
      const options = {
        key: data.razorpayKeyId,
        amount: data.razorpayOrder.amount,
        currency: "INR",
        name: "ShopEase",
        description: "Order Payment",
        order_id: data.razorpayOrder.id,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: shippingInfo.phone,
        },
        theme: { color: "#4f46e5" },

        handler: async (response) => {
          try {
            // 3. Verify payment + place order
            const orderData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingInfo,
              couponCode: appliedCoupon?.code || "",
            };

            const { data: orderResult } = await axios.post(
              "/orders",
              orderData,
            );

            toast.success("Order placed successfully! 🎉");
            sessionStorage.removeItem("shippingInfo");
            navigate(`/orders/${orderResult.order._id}`);
          } catch (err) {
            toast.error(
              err.response?.data?.message || "Order placement failed",
            );
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment initiation failed");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-gray-500 text-lg">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ── Header + Stepper ──────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-0">
          {["Shipping Info", "Review & Pay"].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center 
                                 justify-center text-sm font-bold transition-all ${
                                   step > i + 1
                                     ? "bg-green-500 text-white"
                                     : step === i + 1
                                       ? "bg-indigo-600 text-white"
                                       : "bg-gray-200 text-gray-500"
                                 }`}
                >
                  {step > i + 1 ? <FiCheck size={14} /> : i + 1}
                </div>
                <span
                  className={`text-sm font-medium ${
                    step === i + 1 ? "text-indigo-600" : "text-gray-400"
                  }`}
                >
                  {s}
                </span>
              </div>
              {i < 1 && (
                <div
                  className={`w-16 h-0.5 mx-3 ${
                    step > 1 ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left: Steps ───────────────────────────────── */}
        <div className="lg:col-span-2">
          {/* STEP 1: Shipping Info */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2
                className="text-lg font-bold text-gray-800 mb-6 
                             flex items-center gap-2"
              >
                <FiMapPin className="text-indigo-600" /> Shipping Information
              </h2>

              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <div className="relative">
                      <FiHome
                        className="absolute left-3 top-1/2 -translate-y-1/2 
                                         text-gray-400"
                        size={16}
                      />
                      <input
                        type="text"
                        required
                        value={shippingInfo.address}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            address: e.target.value,
                          })
                        }
                        placeholder="123, Street Name, Area"
                        className="w-full pl-9 pr-4 py-3 border border-gray-200 
                                   rounded-xl text-sm focus:outline-none 
                                   focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          city: e.target.value,
                        })
                      }
                      placeholder="Mumbai"
                      className="w-full px-4 py-3 border border-gray-200 
                                 rounded-xl text-sm focus:outline-none 
                                 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.state}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          state: e.target.value,
                        })
                      }
                      placeholder="Maharashtra"
                      className="w-full px-4 py-3 border border-gray-200 
                                 rounded-xl text-sm focus:outline-none 
                                 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Pin Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pin Code
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.pinCode}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          pinCode: e.target.value,
                        })
                      }
                      placeholder="400001"
                      className="w-full px-4 py-3 border border-gray-200 
                                 rounded-xl text-sm focus:outline-none 
                                 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.country}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          country: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 
                                 rounded-xl text-sm focus:outline-none 
                                 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Phone */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone
                        className="absolute left-3 top-1/2 -translate-y-1/2 
                                   text-gray-400"
                        size={16}
                      />
                      <input
                        type="tel"
                        required
                        value={shippingInfo.phone}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+91 9876543210"
                        className="w-full pl-9 pr-4 py-3 border border-gray-200 
                                   rounded-xl text-sm focus:outline-none 
                                   focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white 
                             font-semibold py-3 rounded-xl transition-colors 
                             flex items-center justify-center gap-2 mt-2"
                >
                  Continue to Review <FiArrowRight />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Review & Pay */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Shipping Summary */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-lg font-bold text-gray-800 
                                 flex items-center gap-2"
                  >
                    <FiMapPin className="text-indigo-600" /> Delivery Address
                  </h2>
                  <button
                    onClick={() => setStep(1)}
                    className="text-indigo-600 text-sm font-medium hover:underline"
                  >
                    Change
                  </button>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    <FiUser size={14} /> {user?.name}
                  </p>
                  <p>{shippingInfo.address}</p>
                  <p>
                    {shippingInfo.city}, {shippingInfo.state} -{" "}
                    {shippingInfo.pinCode}
                  </p>
                  <p>{shippingInfo.country}</p>
                  <p className="flex items-center gap-1">
                    <FiPhone size={13} /> {shippingInfo.phone}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Order Items ({items.length})
                </h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 py-2 border-b 
                                 border-gray-50 last:border-0"
                    >
                      <img
                        src={
                          item.product?.images?.[0]?.url ||
                          "https://placehold.co/60x60?text=?"
                        }
                        alt={item.product?.name}
                        className="w-14 h-14 object-cover rounded-xl bg-gray-50"
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-medium text-gray-800 text-sm 
                                      line-clamp-1"
                        >
                          {item.product?.name}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-gray-800 text-sm">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white 
                           font-bold py-4 rounded-xl transition-colors 
                           disabled:opacity-60 flex items-center justify-center 
                           gap-2 text-lg"
              >
                {loading ? (
                  <>
                    <div
                      className="w-5 h-5 border-2 border-white 
                                    border-t-transparent rounded-full animate-spin"
                    />
                    Processing...
                  </>
                ) : (
                  <>🔒 Pay ₹{totalPrice.toLocaleString()} Securely</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── Right: Order Summary ───────────────────────── */}
        <div className="lg:col-span-1">
          <div
            className="bg-white rounded-2xl border border-gray-100 p-6 
                          sticky top-24 space-y-4"
          >
            <h2 className="text-lg font-bold text-gray-800">Price Details</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Price ({items.length} items)</span>
                <span>₹{itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span
                  className={
                    shippingPrice === 0 ? "text-green-600 font-medium" : ""
                  }
                >
                  {shippingPrice === 0 ? "FREE" : `₹${shippingPrice}`}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>− ₹{discountAmount}</span>
                </div>
              )}
              <div
                className="border-t border-gray-100 pt-3 flex justify-between 
                              font-bold text-gray-900"
              >
                <span>Total Amount</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="border-t border-gray-100 pt-4">
              <p
                className="text-sm font-semibold text-gray-700 mb-2 
                            flex items-center gap-1"
              >
                <FiTag size={14} /> Apply Coupon
              </p>
              {appliedCoupon ? (
                <div
                  className="flex items-center justify-between bg-green-50 
                                border border-green-200 rounded-xl px-3 py-2"
                >
                  <div>
                    <p className="text-green-700 font-bold text-sm">
                      {appliedCoupon.code}
                    </p>
                    <p className="text-green-600 text-xs">
                      You save ₹{appliedCoupon.discountAmount}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponCode("");
                    }}
                    className="text-red-500 text-xs font-medium hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    placeholder="Enter code"
                    className="flex-1 border border-gray-200 rounded-xl px-3 
                               py-2 text-sm focus:outline-none focus:ring-2 
                               focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl 
                               text-sm font-medium hover:bg-indigo-700 
                               transition-colors disabled:opacity-60"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
              )}
            </div>

            {/* Savings */}
            {(discountAmount > 0 || shippingPrice === 0) && (
              <div
                className="bg-green-50 border border-green-100 rounded-xl 
                              p-3 text-sm text-green-700 font-medium"
              >
                🎉 You're saving ₹
                {(
                  discountAmount + (shippingPrice === 0 ? 50 : 0)
                ).toLocaleString()}{" "}
                on this order!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

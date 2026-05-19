import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import {
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiArrowLeft,
  FiPhone,
} from "react-icons/fi";
import Loader from "../components/common/Loader";

const STATUS_STYLES = {
  Processing: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Shipped: "bg-blue-100 text-blue-700 border-blue-200",
  Delivered: "bg-green-100 text-green-700 border-green-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/orders/${id}`);
      setOrder(data.order);
    } catch (err) {
      toast.error("Failed to fetch order details");
    }
    setLoading(false);
  };

  if (loading) return <Loader />;
  if (!order)
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-gray-500">Order not found</p>
        <Link
          to="/orders"
          className="mt-4 inline-block text-indigo-600 hover:underline"
        >
          Back to Orders
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        to="/orders"
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 
                   text-sm mb-6 w-fit"
      >
        <FiArrowLeft size={16} /> Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
          <p className="text-gray-500 text-sm mt-1">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
          <p className="text-gray-400 text-xs mt-0.5">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-bold border 
                          ${
                            STATUS_STYLES[order.orderStatus] ||
                            "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
        >
          {order.orderStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column ─────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiPackage className="text-indigo-600" size={18} />
              Order Items ({order.orderItems.length})
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-3 border-b 
                             border-gray-50 last:border-0"
                >
                  <img
                    src={item.image || "https://placehold.co/80x80?text=?"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl bg-gray-50 
                               flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product}`}
                      className="font-semibold text-gray-800 hover:text-indigo-600 
                                 transition-colors text-sm line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-500 text-xs mt-1">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-gray-900 flex-shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiMapPin className="text-indigo-600" size={18} />
              Shipping Address
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{order.shippingInfo.address}</p>
              <p>
                {order.shippingInfo.city}, {order.shippingInfo.state} -{" "}
                {order.shippingInfo.pinCode}
              </p>
              <p>{order.shippingInfo.country}</p>
              <p className="flex items-center gap-1 mt-2">
                <FiPhone size={13} className="text-gray-400" />
                {order.shippingInfo.phone}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiCreditCard className="text-indigo-600" size={18} />
              Payment Information
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status</span>
                <span
                  className={`font-semibold ${
                    order.paymentInfo?.status === "paid"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {order.paymentInfo?.status === "paid"
                    ? "✅ Paid"
                    : "❌ Pending"}
                </span>
              </div>
              {order.paymentInfo?.razorpay_payment_id && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment ID</span>
                  <span className="font-mono text-xs text-gray-700">
                    {order.paymentInfo.razorpay_payment_id}
                  </span>
                </div>
              )}
              {order.coupon?.code && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Coupon Applied</span>
                  <span className="font-semibold text-green-600">
                    {order.coupon.code} (−₹{order.coupon.discount})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order Progress */}
          {order.orderStatus !== "Cancelled" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-800 mb-6">Order Progress</h2>
              <div className="flex items-center justify-between relative">
                {["Processing", "Shipped", "Delivered"].map((s, i) => {
                  const statuses = ["Processing", "Shipped", "Delivered"];
                  const currentIndex = statuses.indexOf(order.orderStatus);
                  const isDone = i <= currentIndex;
                  const icons = ["⏳", "🚚", "✅"];
                  return (
                    <div
                      key={s}
                      className="flex flex-col items-center gap-2 z-10"
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center 
                                       justify-center text-xl transition-all 
                                       border-2 ${
                                         isDone
                                           ? "bg-indigo-600 border-indigo-600"
                                           : "bg-white border-gray-200"
                                       }`}
                      >
                        {icons[i]}
                      </div>
                      <span
                        className={`text-xs font-semibold text-center ${
                          isDone ? "text-indigo-600" : "text-gray-400"
                        }`}
                      >
                        {s}
                        {s === "Delivered" && order.deliveredAt && (
                          <span className="block text-gray-400 font-normal">
                            {new Date(order.deliveredAt).toLocaleDateString(
                              "en-IN",
                            )}
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
                {/* Line */}
                <div
                  className="absolute top-6 left-0 right-0 h-0.5 
                                bg-gray-200 -z-0"
                >
                  <div
                    className="h-full bg-indigo-600 transition-all duration-500"
                    style={{
                      width:
                        order.orderStatus === "Processing"
                          ? "0%"
                          : order.orderStatus === "Shipped"
                            ? "50%"
                            : "100%",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right Column: Price Summary ──────────────────── */}
        <div className="lg:col-span-1">
          <div
            className="bg-white rounded-2xl border border-gray-100 p-6 
                          sticky top-24"
          >
            <h2 className="font-bold text-gray-800 mb-4">Price Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items Price</span>
                <span>₹{order.itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span
                  className={
                    order.shippingPrice === 0
                      ? "text-green-600 font-medium"
                      : ""
                  }
                >
                  {order.shippingPrice === 0
                    ? "FREE"
                    : `₹${order.shippingPrice}`}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>− ₹{order.discountAmount}</span>
                </div>
              )}
              <div
                className="border-t border-gray-100 pt-3 flex justify-between 
                              font-bold text-gray-900 text-base"
              >
                <span>Total</span>
                <span>₹{order.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <Link
                to="/products"
                className="w-full block text-center bg-indigo-600 
                           hover:bg-indigo-700 text-white font-semibold 
                           py-3 rounded-xl transition-colors text-sm"
              >
                Continue Shopping
              </Link>
              <Link
                to="/orders"
                className="w-full block text-center border border-gray-200 
                           text-gray-700 font-medium py-3 rounded-xl 
                           hover:bg-gray-50 transition-colors text-sm"
              >
                All Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

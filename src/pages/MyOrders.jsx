import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import {
  FiPackage,
  FiEye,
  FiFilter,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";
import Loader from "../components/common/Loader";

const STATUS_STYLES = {
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const STATUS_ICONS = {
  Processing: "⏳",
  Shipped: "🚚",
  Delivered: "✅",
  Cancelled: "❌",
};

const MyOrders = () => {
  const { user } = useSelector((s) => s.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const { data } = await axios.get("/orders/my", { params });
      setOrders(data.orders);
    } catch (err) {
      toast.error("Failed to fetch orders");
    }
    setLoading(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <p className="text-gray-500 mt-1">{orders.length} order(s) found</p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <FiFilter size={16} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 
                       bg-white"
          >
            <option value="">All Orders</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <FiShoppingBag size={64} className="text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No Orders Found
          </h2>
          <p className="text-gray-500 mb-6">
            {statusFilter
              ? `No ${statusFilter} orders found`
              : "You haven't placed any orders yet"}
          </p>
          <Link
            to="/products"
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl 
                       font-semibold hover:bg-indigo-700 transition-colors 
                       inline-flex items-center gap-2"
          >
            Start Shopping <FiArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-gray-100 p-5 
                         hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div
                className="flex flex-wrap items-center justify-between 
                              gap-3 mb-4"
              >
                <div>
                  <p className="text-xs text-gray-400 mb-1">Order ID</p>
                  <p className="font-mono font-semibold text-gray-800 text-sm">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Placed On</p>
                  <p className="text-sm text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Total</p>
                  <p className="font-bold text-gray-900">
                    ₹{order.totalPrice.toLocaleString()}
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold 
                                  flex items-center gap-1
                                  ${
                                    STATUS_STYLES[order.orderStatus] ||
                                    "bg-gray-100 text-gray-600"
                                  }`}
                >
                  {STATUS_ICONS[order.orderStatus]} {order.orderStatus}
                </span>

                <Link
                  to={`/orders/${order._id}`}
                  className="flex items-center gap-1 text-indigo-600 
                             hover:text-indigo-800 text-sm font-medium 
                             hover:underline"
                >
                  <FiEye size={15} /> View Details
                </Link>
              </div>

              {/* Order Items Preview */}
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {order.orderItems.slice(0, 4).map((item, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 flex items-center 
                                          gap-2 bg-gray-50 rounded-xl p-2"
                  >
                    <img
                      src={item.image || "https://placehold.co/50x50?text=?"}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <div className="min-w-0">
                      <p
                        className="text-xs font-medium text-gray-700 
                                    truncate max-w-[100px]"
                      >
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
                {order.orderItems.length > 4 && (
                  <div
                    className="flex-shrink-0 w-10 h-10 bg-gray-100 
                                  rounded-xl flex items-center justify-center 
                                  text-xs font-bold text-gray-500"
                  >
                    +{order.orderItems.length - 4}
                  </div>
                )}
              </div>

              {/* Progress Bar for non-cancelled orders */}
              {order.orderStatus !== "Cancelled" && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center justify-between relative">
                    {["Processing", "Shipped", "Delivered"].map((s, i) => {
                      const statuses = ["Processing", "Shipped", "Delivered"];
                      const currentIndex = statuses.indexOf(order.orderStatus);
                      const isDone = i <= currentIndex;
                      return (
                        <div
                          key={s}
                          className="flex flex-col items-center gap-1 z-10"
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center 
                                           justify-center text-xs font-bold 
                                           transition-all ${
                                             isDone
                                               ? "bg-indigo-600 text-white"
                                               : "bg-gray-200 text-gray-400"
                                           }`}
                          >
                            {isDone ? "✓" : i + 1}
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              isDone ? "text-indigo-600" : "text-gray-400"
                            }`}
                          >
                            {s}
                          </span>
                        </div>
                      );
                    })}
                    {/* Progress line */}
                    <div
                      className="absolute top-3 left-0 right-0 h-0.5 
                                    bg-gray-200 -z-0"
                    >
                      <div
                        className="h-full bg-indigo-600 transition-all"
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
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;

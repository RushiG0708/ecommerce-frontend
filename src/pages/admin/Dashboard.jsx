import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  FiUsers,
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiAlertTriangle,
} from "react-icons/fi";
import Loader from "../../components/common/Loader";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get("/admin/analytics");
      setData(data);
    } catch (err) {
      toast.error("Failed to load analytics");
    }
    setLoading(false);
  };

  if (loading) return <Loader />;

  const {
    summary,
    ordersPerDay,
    revenuePerMonth,
    topProducts,
    orderStatusBreakdown,
    lowStockProducts,
    recentOrders,
  } = data;

  const STATUS_COLORS = {
    Processing: "bg-yellow-100 text-yellow-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back! Here's what's happening.
        </p>
      </div>

      {/* ── Summary Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `₹${summary.totalRevenue.toLocaleString()}`,
            icon: FiDollarSign,
            color: "bg-green-500",
            light: "bg-green-50",
          },
          {
            label: "Total Orders",
            value: summary.totalOrders,
            icon: FiShoppingBag,
            color: "bg-blue-500",
            light: "bg-blue-50",
          },
          {
            label: "Total Products",
            value: summary.totalProducts,
            icon: FiPackage,
            color: "bg-purple-500",
            light: "bg-purple-50",
          },
          {
            label: "Total Users",
            value: summary.totalUsers,
            icon: FiUsers,
            color: "bg-orange-500",
            light: "bg-orange-50",
            sub: `+${summary.newUsers} this week`,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${card.light} p-2 rounded-xl`}>
                <card.icon
                  size={20}
                  className={card.color.replace("bg-", "text-")}
                />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            <p className="text-gray-500 text-sm mt-1">{card.label}</p>
            {card.sub && (
              <p className="text-green-600 text-xs mt-1 font-medium">
                {card.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ── Charts Row ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Per Month */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">
            Revenue (Last 6 Months)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenuePerMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ fill: "#4f46e5", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Per Day */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">Orders (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ordersPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom Row ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div
          className="lg:col-span-2 bg-white rounded-2xl border 
                        border-gray-100 p-5"
        >
          <h2 className="font-bold text-gray-800 mb-4">Top Selling Products</h2>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No sales data yet
              </p>
            ) : (
              topProducts.map((p, i) => (
                <div
                  key={p._id}
                  className="flex items-center gap-3 py-2 border-b 
                             border-gray-50 last:border-0"
                >
                  <span
                    className="w-6 h-6 rounded-full bg-indigo-100 
                                   text-indigo-600 text-xs font-bold flex 
                                   items-center justify-center flex-shrink-0"
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {p.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {p.totalSold} units sold
                    </p>
                  </div>
                  <span className="font-bold text-gray-800 text-sm">
                    ₹{p.totalRevenue.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 mb-4">Order Status</h2>
            <div className="space-y-2">
              {orderStatusBreakdown.map((s) => (
                <div key={s._id} className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold px-2 py-1 
                                    rounded-full ${
                                      STATUS_COLORS[s._id] ||
                                      "bg-gray-100 text-gray-600"
                                    }`}
                  >
                    {s._id}
                  </span>
                  <span className="font-bold text-gray-800">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiAlertTriangle className="text-orange-500" size={16} />
              Low Stock Alert
            </h2>
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-400 text-sm">
                All products well stocked!
              </p>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.slice(0, 5).map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between"
                  >
                    <p className="text-sm text-gray-700 truncate flex-1">
                      {p.name}
                    </p>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full 
                                      ml-2 flex-shrink-0 ${
                                        p.stock === 0
                                          ? "bg-red-100 text-red-600"
                                          : "bg-orange-100 text-orange-600"
                                      }`}
                    >
                      {p.stock === 0 ? "Out" : `${p.stock} left`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-bold text-gray-800 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Order ID", "Customer", "Amount", "Status", "Date"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-gray-500 font-medium 
                               pb-3 pr-4"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 font-mono text-xs text-gray-600">
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-3 pr-4 font-medium text-gray-800">
                    {order.user?.name}
                  </td>
                  <td className="py-3 pr-4 font-bold text-gray-900">
                    ₹{order.totalPrice.toLocaleString()}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`text-xs font-bold px-2 py-1 
                                      rounded-full ${
                                        STATUS_COLORS[order.orderStatus] ||
                                        "bg-gray-100 text-gray-600"
                                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

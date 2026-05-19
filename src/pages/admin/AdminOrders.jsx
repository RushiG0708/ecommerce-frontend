import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { FiEye, FiTrash2, FiFilter } from "react-icons/fi";
import { Link } from "react-router-dom";
import Loader from "../../components/common/Loader";

const STATUS_STYLES = {
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const { data } = await axios.get("/orders/admin/all", { params });
      setOrders(data.orders);
      setTotalRevenue(data.totalRevenue);
    } catch (err) {
      toast.error("Failed to fetch orders");
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await axios.put(`/orders/admin/${orderId}`, { status });
      toast.success("Order status updated!");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
    setUpdatingId(null);
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await axios.delete(`/orders/admin/${orderId}`);
      toast.success("Order deleted");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">
            Total Revenue:{" "}
            <span className="font-bold text-green-600">
              ₹{totalRevenue.toLocaleString()}
            </span>
          </p>
        </div>
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

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[
                    "Order ID",
                    "Customer",
                    "Items",
                    "Total",
                    "Status",
                    "Date",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-gray-500 font-semibold 
                                 px-4 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">
                        {order.user?.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {order.user?.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {order.orderItems.length} item(s)
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">
                      ₹{order.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusUpdate(order._id, e.target.value)
                        }
                        disabled={
                          updatingId === order._id ||
                          order.orderStatus === "Delivered"
                        }
                        className={`text-xs font-bold px-2 py-1 rounded-full 
                                    border-0 cursor-pointer disabled:cursor-not-allowed
                                    focus:outline-none ${
                                      STATUS_STYLES[order.orderStatus] ||
                                      "bg-gray-100 text-gray-600"
                                    }`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/orders/${order._id}`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 
                                     rounded-lg transition-colors"
                        >
                          <FiEye size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="p-2 text-red-500 hover:bg-red-50 
                                     rounded-lg transition-colors"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No orders found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

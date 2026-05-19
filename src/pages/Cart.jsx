import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../store/slices/cartSlice";
import { addToWishlist } from "../store/slices/wishlistSlice";
import toast from "react-hot-toast";
import {
  FiTrash2,
  FiHeart,
  FiShoppingBag,
  FiArrowRight,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import Loader from "../components/common/Loader";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((s) => s.cart);
  const { isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [isAuthenticated]);

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty < 1) return;
    const result = await dispatch(
      updateCartItem({ productId, quantity: newQty }),
    );
    if (result.meta.requestStatus === "rejected") {
      toast.error(result.payload || "Failed to update");
    }
  };

  const handleRemove = async (productId) => {
    await dispatch(removeFromCart(productId));
    toast.success("Item removed from cart");
  };

  const handleMoveToWishlist = async (productId) => {
    if (!isAuthenticated) return toast.error("Please login");
    await dispatch(addToWishlist(productId));
    await dispatch(removeFromCart(productId));
    toast.success("Moved to wishlist!");
  };

  const handleClearCart = async () => {
    await dispatch(clearCart());
    toast.success("Cart cleared");
  };

  // ── Not logged in ──────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 mb-6">Please login to view your cart</p>
          <Link
            to="/login"
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl 
                       font-semibold hover:bg-indigo-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <Loader />;

  const items = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;
  const shippingPrice = totalPrice > 500 ? 0 : 50;
  const finalTotal = totalPrice + shippingPrice;

  // ── Empty Cart ─────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added anything yet
          </p>
          <Link
            to="/products"
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl 
                       font-semibold hover:bg-indigo-700 transition-colors 
                       inline-flex items-center gap-2"
          >
            <FiShoppingBag size={18} /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Cart</h1>
          <p className="text-gray-500 mt-1">{items.length} item(s)</p>
        </div>
        <button
          onClick={handleClearCart}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 
                     text-sm font-medium border border-red-200 px-4 py-2 
                     rounded-xl hover:bg-red-50 transition-colors"
        >
          <FiTrash2 size={16} /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Cart Items ─────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-gray-100 
                         p-4 flex gap-4 hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <Link
                to={`/products/${item.product?._id}`}
                className="flex-shrink-0"
              >
                <img
                  src={
                    item.product?.images?.[0]?.url ||
                    "https://placehold.co/100x100?text=?"
                  }
                  alt={item.product?.name}
                  className="w-24 h-24 object-cover rounded-xl bg-gray-50"
                />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product?._id}`}>
                  <h3
                    className="font-semibold text-gray-800 hover:text-indigo-600 
                                 transition-colors line-clamp-2 text-sm"
                  >
                    {item.product?.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{item.price}
                  </span>
                  {item.product?.price > item.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{item.product.price}
                    </span>
                  )}
                </div>

                {/* Stock warning */}
                {item.product?.stock < 5 && item.product?.stock > 0 && (
                  <p className="text-orange-500 text-xs mt-1">
                    Only {item.product.stock} left in stock!
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-3">
                  {/* Quantity */}
                  <div
                    className="flex items-center border border-gray-200 
                                  rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.product?._id,
                          item.quantity - 1,
                        )
                      }
                      disabled={item.quantity <= 1}
                      className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 
                                 transition-colors disabled:opacity-40"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span
                      className="px-4 py-1.5 font-semibold text-sm 
                                     border-x border-gray-200 min-w-[2.5rem] 
                                     text-center"
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.product?._id,
                          item.quantity + 1,
                        )
                      }
                      disabled={item.quantity >= item.product?.stock}
                      className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 
                                 transition-colors disabled:opacity-40"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <span className="font-bold text-indigo-600">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>

                  {/* Remove + Wishlist */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMoveToWishlist(item.product?._id)}
                      className="p-2 text-gray-400 hover:text-red-500 
                                 hover:bg-red-50 rounded-lg transition-colors"
                      title="Move to wishlist"
                    >
                      <FiHeart size={16} />
                    </button>
                    <button
                      onClick={() => handleRemove(item.product?._id)}
                      className="p-2 text-gray-400 hover:text-red-500 
                                 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Order Summary ──────────────────────────────── */}
        <div className="lg:col-span-1">
          <div
            className="bg-white rounded-2xl border border-gray-100 p-6 
                          sticky top-24"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span
                  className={
                    shippingPrice === 0 ? "text-green-600 font-medium" : ""
                  }
                >
                  {shippingPrice === 0 ? "FREE" : `₹${shippingPrice}`}
                </span>
              </div>
              {shippingPrice > 0 && (
                <p className="text-xs text-gray-400">
                  Add ₹{500 - totalPrice} more for free shipping
                </p>
              )}
              <div
                className="border-t border-gray-100 pt-3 flex justify-between 
                              font-bold text-gray-900 text-base"
              >
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white 
                         font-semibold py-3 rounded-xl transition-colors mt-6 
                         flex items-center justify-center gap-2"
            >
              Proceed to Checkout <FiArrowRight size={18} />
            </button>

            <Link
              to="/products"
              className="w-full text-center block mt-3 text-indigo-600 
                         hover:underline text-sm font-medium"
            >
              Continue Shopping
            </Link>

            {/* Safe Checkout Badge */}
            <div
              className="mt-4 pt-4 border-t border-gray-100 flex items-center 
                            justify-center gap-2 text-xs text-gray-400"
            >
              <span>🔒</span>
              <span>100% Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

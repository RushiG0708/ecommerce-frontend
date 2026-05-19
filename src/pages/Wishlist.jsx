import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  removeFromWishlist,
  moveToCart,
} from "../store/slices/wishlistSlice";
import toast from "react-hot-toast";
import {
  FiTrash2,
  FiShoppingCart,
  FiHeart,
  FiArrowRight,
} from "react-icons/fi";
import Loader from "../components/common/Loader";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector((s) => s.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = async (productId) => {
    await dispatch(removeFromWishlist(productId));
    toast.success("Removed from wishlist");
  };

  const handleMoveToCart = async (productId) => {
    const result = await dispatch(moveToCart(productId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Moved to cart!");
    } else {
      toast.error(result.payload || "Failed");
    }
  };

  if (loading) return <Loader />;

  const items = wishlist?.items || [];

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiHeart size={64} className="text-gray-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-500 mb-6">
            Save items you love to your wishlist
          </p>
          <Link
            to="/products"
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl 
                       font-semibold hover:bg-indigo-700 transition-colors 
                       inline-flex items-center gap-2"
          >
            Discover Products <FiArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
        <p className="text-gray-500 mt-1">{items.length} saved item(s)</p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
                      lg:grid-cols-4 gap-6"
      >
        {items.map((item) => {
          const product = item.product;
          if (!product) return null;

          const finalPrice =
            product.discountPrice > 0 ? product.discountPrice : product.price;
          const discount =
            product.discountPrice > 0
              ? Math.round(
                  ((product.price - product.discountPrice) / product.price) *
                    100,
                )
              : 0;

          return (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-gray-100 
                         overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Image */}
              <div className="relative bg-gray-50 h-52 overflow-hidden">
                <Link to={`/products/${product._id}`}>
                  <img
                    src={
                      product.images?.[0]?.url ||
                      "https://placehold.co/400x300?text=No+Image"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 
                               transition-transform duration-300"
                  />
                </Link>

                {discount > 0 && (
                  <span
                    className="absolute top-3 left-3 bg-red-500 text-white 
                                   text-xs font-bold px-2 py-1 rounded-lg"
                  >
                    {discount}% OFF
                  </span>
                )}

                {product.stock === 0 && (
                  <div
                    className="absolute inset-0 bg-black/40 flex items-center 
                                  justify-center"
                  >
                    <span
                      className="bg-white text-gray-800 text-sm font-bold 
                                     px-4 py-2 rounded-full"
                    >
                      Out of Stock
                    </span>
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={() => handleRemove(product._id)}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full 
                             shadow-md hover:bg-red-50 hover:text-red-500 
                             transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <span
                  className="text-xs text-indigo-600 font-medium 
                                 bg-indigo-50 px-2 py-1 rounded-full"
                >
                  {product.category}
                </span>

                <Link to={`/products/${product._id}`}>
                  <h3
                    className="font-semibold text-gray-800 mt-2 mb-3 
                                 line-clamp-2 hover:text-indigo-600 
                                 transition-colors text-sm"
                  >
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{finalPrice}
                    </span>
                    {discount > 0 && (
                      <span className="text-xs text-gray-400 line-through ml-1">
                        ₹{product.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* Move to Cart */}
                <button
                  onClick={() => handleMoveToCart(product._id)}
                  disabled={product.stock === 0}
                  className="w-full mt-3 flex items-center justify-center 
                             gap-2 bg-indigo-600 hover:bg-indigo-700 text-white 
                             font-medium py-2 rounded-xl transition-colors 
                             disabled:opacity-50 disabled:cursor-not-allowed 
                             text-sm"
                >
                  <FiShoppingCart size={16} />
                  {product.stock === 0 ? "Out of Stock" : "Move to Cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;

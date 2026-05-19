import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct, clearProduct } from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import { addToWishlist } from "../store/slices/wishlistSlice";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import {
  FiShoppingCart,
  FiHeart,
  FiStar,
  FiArrowLeft,
  FiPackage,
  FiShield,
  FiRefreshCw,
  FiTruck,
} from "react-icons/fi";
import Loader from "../components/common/Loader";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading } = useSelector((s) => s.products);
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    dispatch(fetchProduct(id));
    fetchReviews();
    return () => dispatch(clearProduct());
  }, [id]);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/products/${id}/reviews`);
      setReviews(data.reviews);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) return toast.error("Please login to add to cart");
    const result = await dispatch(addToCart({ productId: id, quantity }));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Added to cart!");
    } else {
      toast.error(result.payload || "Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      return navigate("/login");
    }
    await dispatch(addToCart({ productId: id, quantity }));
    navigate("/checkout");
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) return toast.error("Please login");
    const result = await dispatch(addToWishlist(id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Added to wishlist!");
    } else {
      toast.error(result.payload || "Failed");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error("Please login to review");
    setReviewLoading(true);
    try {
      await axios.post(`/products/${id}/reviews`, reviewForm);
      toast.success("Review submitted!");
      setReviewForm({ rating: 5, comment: "" });
      fetchReviews();
      dispatch(fetchProduct(id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
    setReviewLoading(false);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`/products/${id}/reviews/${reviewId}`);
      toast.success("Review deleted");
      fetchReviews();
      dispatch(fetchProduct(id));
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  if (loading) return <Loader />;
  if (!product)
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-gray-500 text-lg">Product not found</p>
        <Link
          to="/products"
          className="mt-4 inline-block text-indigo-600 hover:underline"
        >
          Back to Products
        </Link>
      </div>
    );

  const finalPrice =
    product.discountPrice > 0 ? product.discountPrice : product.price;
  const discount =
    product.discountPrice > 0
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100,
        )
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-indigo-600">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-indigo-600">
          Products
        </Link>
        <span>/</span>
        <Link
          to={`/products?category=${product.category}`}
          className="hover:text-indigo-600"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium line-clamp-1">
          {product.name}
        </span>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* ── Images ──────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Main Image */}
          <div
            className="bg-gray-50 rounded-2xl overflow-hidden h-96 
                          flex items-center justify-center border border-gray-100"
          >
            <img
              src={
                product.images?.[selectedImage]?.url ||
                "https://placehold.co/600x400?text=No+Image"
              }
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden 
                              border-2 transition-all ${
                                selectedImage === i
                                  ? "border-indigo-600"
                                  : "border-gray-200 hover:border-indigo-300"
                              }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ─────────────────────────────────── */}
        <div className="space-y-6">
          {/* Category + Name */}
          <div>
            <span
              className="text-sm text-indigo-600 font-medium bg-indigo-50 
                             px-3 py-1 rounded-full"
            >
              {product.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-3">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  size={18}
                  className={
                    star <= Math.round(product.ratings)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-gray-600 text-sm font-medium">
              {product.ratings?.toFixed(1) || "0.0"}
            </span>
            <span className="text-gray-400 text-sm">
              ({product.numReviews || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-gray-900">
              ₹{finalPrice}
            </span>
            {discount > 0 && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  ₹{product.price}
                </span>
                <span
                  className="bg-green-100 text-green-700 text-sm 
                                 font-bold px-3 py-1 rounded-full"
                >
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <FiPackage
              size={16}
              className={product.stock > 0 ? "text-green-500" : "text-red-500"}
            />
            <span
              className={`text-sm font-medium ${
                product.stock > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.stock > 10
                ? "In Stock"
                : product.stock > 0
                  ? `Only ${product.stock} left!`
                  : "Out of Stock"}
            </span>
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Quantity:
              </span>
              <div
                className="flex items-center border border-gray-200 
                              rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 hover:bg-gray-50 text-gray-600 
                             font-bold transition-colors"
                >
                  −
                </button>
                <span
                  className="px-4 py-2 font-semibold text-gray-800 
                                 border-x border-gray-200 min-w-[3rem] 
                                 text-center"
                >
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="px-4 py-2 hover:bg-gray-50 text-gray-600 
                             font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 
                         border-2 border-indigo-600 text-indigo-600 
                         font-semibold py-3 rounded-xl hover:bg-indigo-50 
                         transition-colors disabled:opacity-50 
                         disabled:cursor-not-allowed"
            >
              <FiShoppingCart size={18} /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white 
                         font-semibold py-3 rounded-xl transition-colors 
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToWishlist}
              className="p-3 border-2 border-gray-200 rounded-xl 
                         hover:border-red-300 hover:text-red-500 
                         transition-colors"
            >
              <FiHeart size={20} />
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
            {[
              { icon: FiTruck, text: "Free delivery above ₹500" },
              { icon: FiRefreshCw, text: "30-day easy returns" },
              { icon: FiShield, text: "100% secure payment" },
              { icon: FiPackage, text: "Quality guaranteed" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 text-xs text-gray-500"
              >
                <Icon size={14} className="text-indigo-500 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────── */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8">
          {["description", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold capitalize transition-colors
                          border-b-2 -mb-px ${
                            activeTab === tab
                              ? "border-indigo-600 text-indigo-600"
                              : "border-transparent text-gray-500 hover:text-gray-700"
                          }`}
            >
              {tab === "reviews" ? `Reviews (${product.numReviews || 0})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Description Tab */}
      {activeTab === "description" && (
        <div className="prose max-w-none text-gray-600 leading-relaxed">
          <p>{product.description}</p>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="space-y-8">
          {/* Write Review */}
          {isAuthenticated && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Star Rating Picker */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Your Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setReviewForm({ ...reviewForm, rating: star })
                        }
                        className="text-2xl transition-transform hover:scale-110"
                      >
                        <FiStar
                          className={
                            star <= reviewForm.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                          size={24}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label
                    className="text-sm font-medium text-gray-700 
                                    mb-2 block"
                  >
                    Your Review
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, comment: e.target.value })
                    }
                    required
                    rows={4}
                    placeholder="Share your experience with this product..."
                    className="w-full border border-gray-200 rounded-xl p-3 
                               text-sm focus:outline-none focus:ring-2 
                               focus:ring-indigo-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white 
                             font-semibold px-6 py-2 rounded-xl transition-colors
                             disabled:opacity-60 flex items-center gap-2"
                >
                  {reviewLoading ? (
                    <>
                      <div
                        className="w-4 h-4 border-2 border-white 
                                      border-t-transparent rounded-full 
                                      animate-spin"
                      />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-gray-500">
                No reviews yet. Be the first to review!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-2xl border border-gray-100 p-5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div
                        className="w-10 h-10 rounded-full bg-indigo-600 
                                      flex items-center justify-center 
                                      text-white font-bold text-sm"
                      >
                        {review.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {review.user?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <FiStar
                          key={s}
                          size={14}
                          className={
                            s <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                    {review.comment}
                  </p>

                  {/* Delete button for own review or admin */}
                  {(user?._id === review.user?._id ||
                    user?.role === "admin") && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="mt-3 text-xs text-red-500 hover:text-red-700 
                                 font-medium"
                    >
                      Delete Review
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import { addToWishlist } from "../store/slices/wishlistSlice";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiFilter,
  FiShoppingCart,
  FiHeart,
  FiStar,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    products,
    categories,
    totalPages,
    currentPage,
    totalProducts,
    loading,
  } = useSelector((s) => s.products);
  const { isAuthenticated } = useSelector((s) => s.auth);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [gender, setGender] = useState(searchParams.get("gender") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [rating, setRating] = useState(searchParams.get("rating") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "");
    setGender(searchParams.get("gender") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setRating(searchParams.get("rating") || "");
    setPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  const fetchWithFilters = useCallback(() => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (gender) params.gender = gender;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (rating) params.rating = rating;
    params.page = page;
    dispatch(fetchProducts(params));

    const urlParams = {};
    if (search) urlParams.search = search;
    if (category) urlParams.category = category;
    if (gender) urlParams.gender = gender;
    if (minPrice) urlParams.minPrice = minPrice;
    if (maxPrice) urlParams.maxPrice = maxPrice;
    if (rating) urlParams.rating = rating;
    if (page > 1) urlParams.page = page;
    setSearchParams(urlParams);
  }, [search, category, gender, minPrice, maxPrice, rating, page]);

  useEffect(() => {
    fetchWithFilters();
  }, [fetchWithFilters]);
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setGender("");
    setMinPrice("");
    setMaxPrice("");
    setRating("");
    setPage(1);
    setSearchParams({});
    dispatch(fetchProducts({}));
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) return toast.error("Please login to add to cart");
    const result = await dispatch(addToCart({ productId, quantity: 1 }));
    if (result.meta.requestStatus === "fulfilled")
      toast.success("Added to cart!");
    else toast.error(result.payload || "Failed");
  };

  const handleAddToWishlist = async (productId) => {
    if (!isAuthenticated) return toast.error("Please login");
    const result = await dispatch(addToWishlist(productId));
    if (result.meta.requestStatus === "fulfilled")
      toast.success("Added to wishlist!");
    else toast.error(result.payload || "Failed");
  };

  const hasActiveFilters =
    search || category || gender || minPrice || maxPrice || rating;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
        <p className="text-gray-500 mt-1">
          {totalProducts > 0
            ? `Showing ${totalProducts} products`
            : "No products found"}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterPanel
            categories={categories}
            category={category}
            setCategory={setCategory}
            gender={gender}
            setGender={setGender}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            rating={rating}
            setRating={setRating}
            clearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            setPage={setPage}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="flex gap-3 mb-6">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <FiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 
                             text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 
                             rounded-xl focus:outline-none focus:ring-2 
                             focus:ring-indigo-500 text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl 
                           hover:bg-indigo-700 transition-colors text-sm 
                           font-medium"
              >
                Search
              </button>
            </form>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 border 
                         border-gray-200 px-4 py-3 rounded-xl text-sm 
                         font-medium hover:bg-gray-50"
            >
              <FiFilter size={16} />
              Filters
              {hasActiveFilters && (
                <span
                  className="bg-indigo-600 text-white text-xs w-5 h-5 
                                 rounded-full flex items-center justify-center"
                >
                  !
                </span>
              )}
            </button>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div
              className="lg:hidden mb-6 bg-white rounded-2xl border 
                            border-gray-200 p-4"
            >
              <FilterPanel
                categories={categories}
                category={category}
                setCategory={setCategory}
                gender={gender}
                setGender={setGender}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                rating={rating}
                setRating={setRating}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                setPage={setPage}
              />
            </div>
          )}

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {search && (
                <FilterTag
                  label={`Search: ${search}`}
                  onRemove={() => {
                    setSearch("");
                    setPage(1);
                  }}
                />
              )}
              {category && (
                <FilterTag
                  label={`Category: ${category}`}
                  onRemove={() => {
                    setCategory("");
                    setPage(1);
                  }}
                />
              )}
              {gender && (
                <FilterTag
                  label={`Gender: ${gender}`}
                  onRemove={() => {
                    setGender("");
                    setPage(1);
                  }}
                />
              )}
              {minPrice && (
                <FilterTag
                  label={`Min: ₹${minPrice}`}
                  onRemove={() => {
                    setMinPrice("");
                    setPage(1);
                  }}
                />
              )}
              {maxPrice && (
                <FilterTag
                  label={`Max: ₹${maxPrice}`}
                  onRemove={() => {
                    setMaxPrice("");
                    setPage(1);
                  }}
                />
              )}
              {rating && (
                <FilterTag
                  label={`Rating: ${rating}★+`}
                  onRemove={() => {
                    setRating("");
                    setPage(1);
                  }}
                />
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:text-red-700 
                           font-medium underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden 
                             border border-gray-100 animate-pulse"
                >
                  <div className="h-52 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-gray-500 text-lg font-medium">
                No products found
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your filters
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-indigo-600 font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-gray-200 
                               hover:bg-gray-50 disabled:opacity-40 
                               disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft size={18} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium 
                                  transition-colors ${
                                    currentPage === i + 1
                                      ? "bg-indigo-600 text-white"
                                      : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                                  }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-gray-200 
                               hover:bg-gray-50 disabled:opacity-40 
                               disabled:cursor-not-allowed"
                  >
                    <FiChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Filter Panel ───────────────────────────────────────────
const FilterPanel = ({
  categories,
  category,
  setCategory,
  gender,
  setGender,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  rating,
  setRating,
  clearFilters,
  hasActiveFilters,
  setPage,
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-gray-800 flex items-center gap-2">
        <FiFilter size={16} /> Filters
      </h3>
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-xs text-red-500 hover:text-red-700 font-medium"
        >
          Clear all
        </button>
      )}
    </div>

    {/* Category */}
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="category"
            value=""
            checked={category === ""}
            onChange={() => {
              setCategory("");
              setPage(1);
            }}
            className="text-indigo-600"
          />
          <span className="text-sm text-gray-600">All Categories</span>
        </label>
        {categories.map((cat) => (
          <label key={cat} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              value={cat}
              checked={category === cat}
              onChange={() => {
                setCategory(cat);
                setPage(1);
              }}
              className="text-indigo-600"
            />
            <span className="text-sm text-gray-600">{cat}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Gender */}
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Gender</h4>
      <div className="space-y-2">
        {[
          { value: "", label: "All" },
          { value: "Men", label: "👔 Men" },
          { value: "Women", label: "👗 Women" },
          { value: "Unisex", label: "🤝 Unisex" },
        ].map((g) => (
          <label
            key={g.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name="gender"
              value={g.value}
              checked={gender === g.value}
              onChange={() => {
                setGender(g.value);
                setPage(1);
              }}
              className="text-indigo-600"
            />
            <span className="text-sm text-gray-600">{g.label}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Price Range */}
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h4>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value);
            setPage(1);
          }}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 
                     text-sm focus:outline-none focus:ring-2 
                     focus:ring-indigo-500"
        />
        <input
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            setPage(1);
          }}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 
                     text-sm focus:outline-none focus:ring-2 
                     focus:ring-indigo-500"
        />
      </div>
    </div>

    {/* Rating */}
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        Minimum Rating
      </h4>
      <div className="space-y-2">
        {["", "4", "3", "2", "1"].map((r) => (
          <label key={r} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rating"
              value={r}
              checked={rating === r}
              onChange={() => {
                setRating(r);
                setPage(1);
              }}
              className="text-indigo-600"
            />
            <span className="text-sm text-gray-600 flex items-center gap-1">
              {r === "" ? (
                "All Ratings"
              ) : (
                <>
                  {r}{" "}
                  <FiStar
                    className="text-yellow-400 fill-yellow-400"
                    size={12}
                  />{" "}
                  & above
                </>
              )}
            </span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

// ── Product Card ───────────────────────────────────────────
const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => (
  <div
    className="bg-white rounded-2xl shadow-sm hover:shadow-lg 
                  transition-all border border-gray-100 group overflow-hidden"
  >
    <div className="relative overflow-hidden bg-gray-50 h-52">
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
      <button
        onClick={() => onAddToWishlist(product._id)}
        className="absolute top-3 right-3 bg-white p-2 rounded-full 
                   shadow-md hover:bg-red-50 hover:text-red-500 
                   transition-colors opacity-0 group-hover:opacity-100"
      >
        <FiHeart size={16} />
      </button>
      {product.discountPrice > 0 && (
        <span
          className="absolute top-3 left-3 bg-red-500 text-white 
                         text-xs font-bold px-2 py-1 rounded-lg"
        >
          {Math.round(
            ((product.price - product.discountPrice) / product.price) * 100,
          )}
          % OFF
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
    </div>

    <div className="p-4">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="text-xs text-indigo-600 font-medium bg-indigo-50 
                         px-2 py-1 rounded-full"
        >
          {product.category}
        </span>
        {product.gender && product.gender !== "N/A" && (
          <span
            className="text-xs font-medium px-2 py-1 rounded-full
                           bg-pink-50 text-pink-600"
          >
            {product.gender === "Men"
              ? "👔"
              : product.gender === "Women"
                ? "👗"
                : "🤝"}{" "}
            {product.gender}
          </span>
        )}
      </div>

      <Link to={`/products/${product._id}`}>
        <h3
          className="font-semibold text-gray-800 mt-2 mb-1 line-clamp-2 
                       hover:text-indigo-600 transition-colors text-sm"
        >
          {product.name}
        </h3>
      </Link>

      <div className="flex items-center gap-1 mb-3">
        <FiStar className="text-yellow-400 fill-yellow-400" size={13} />
        <span className="text-xs text-gray-600">
          {product.ratings?.toFixed(1) || "0.0"}
        </span>
        <span className="text-xs text-gray-400">
          ({product.numReviews || 0})
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-gray-900">
            ₹{product.discountPrice > 0 ? product.discountPrice : product.price}
          </span>
          {product.discountPrice > 0 && (
            <span className="text-xs text-gray-400 line-through ml-1">
              ₹{product.price}
            </span>
          )}
        </div>
        <button
          onClick={() => onAddToCart(product._id)}
          disabled={product.stock === 0}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 
                     rounded-xl transition-colors disabled:opacity-50 
                     disabled:cursor-not-allowed"
        >
          <FiShoppingCart size={16} />
        </button>
      </div>
    </div>
  </div>
);

// ── Filter Tag ─────────────────────────────────────────────
const FilterTag = ({ label, onRemove }) => (
  <span
    className="flex items-center gap-1 bg-indigo-50 text-indigo-700 
                   text-xs font-medium px-3 py-1 rounded-full"
  >
    {label}
    <button onClick={onRemove} className="hover:text-indigo-900 ml-1">
      <FiX size={12} />
    </button>
  </span>
);

export default Products;

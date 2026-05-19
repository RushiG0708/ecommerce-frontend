import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchCategories } from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import { addToWishlist } from "../store/slices/wishlistSlice";
import toast from "react-hot-toast";
import { FiShoppingCart, FiHeart, FiArrowRight } from "react-icons/fi";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&q=80";
const BANNER_IMAGE =
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1800&q=80";

const CATEGORIES = [
  {
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80",
  },
  {
    name: "Clothing",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80",
  },
  {
    name: "Footwear",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  },
  {
    name: "Beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
  },
  {
    name: "Home & Kitchen",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
  },
  {
    name: "Sports",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80",
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((s) => s.products);
  const { isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8 }));
    dispatch(fetchCategories());
  }, [dispatch]);

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

  return (
    <div
      className="bg-[#faf9f7] min-h-screen"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative h-[92vh] overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        {/* Content */}
        <div
          className="relative z-10 h-full flex flex-col justify-center 
                        max-w-7xl mx-auto px-8 md:px-16"
        >
          <div className="max-w-xl">
            <p
              className="text-amber-300 text-sm font-sans tracking-[0.3em] 
                          uppercase mb-4 animate-pulse"
            >
              New Collection 2026
            </p>
            <h1
              className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Style That
              <br />
              <span className="italic text-amber-300">Speaks</span>
              <br />
              For You
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed font-sans">
              Discover curated collections that define modern elegance. Quality
              pieces for every occasion.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                to="/products"
                className="bg-white text-gray-900 font-sans font-bold 
                           px-8 py-4 hover:bg-amber-300 transition-all 
                           duration-300 flex items-center gap-2 text-sm 
                           tracking-widest uppercase"
              >
                Shop Now <FiArrowRight />
              </Link>
              <Link
                to="/products?category=Clothing"
                className="border border-white text-white font-sans 
                           px-8 py-4 hover:bg-white hover:text-gray-900 
                           transition-all duration-300 text-sm 
                           tracking-widest uppercase"
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 
                        flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-xs font-sans tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-px h-12 bg-white/40 animate-pulse" />
        </div>
      </section>

      {/* ── MARQUEE STRIP ─────────────────────────────────── */}
      <div className="bg-gray-900 text-white py-3 overflow-hidden">
        <div className="flex gap-12 animate-none whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex gap-12 font-sans text-xs 
                                    tracking-[0.2em] uppercase text-gray-400"
            >
              <span>Free Delivery Above ₹500</span>
              <span className="text-amber-400">✦</span>
              <span>Easy 30-Day Returns</span>
              <span className="text-amber-400">✦</span>
              <span>Secure Payments</span>
              <span className="text-amber-400">✦</span>
              <span>24/7 Customer Support</span>
              <span className="text-amber-400">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p
            className="text-amber-600 text-xs font-sans tracking-[0.3em] 
                  uppercase mb-3"
          >
            Explore
          </p>
          <h2 className="text-4xl font-bold text-gray-900">Shop by Category</h2>
        </div>

        <div
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 
                  lg:grid-cols-9 gap-3"
        >
          {[
            {
              name: "Electronics",
              icon: "💻",
              path: "/products?category=Electronics",
            },
            {
              name: "Clothing",
              icon: "👕",
              path: "/products?gender=Men&category=Clothing",
            },
            {
              name: "Footwear",
              icon: "👟",
              path: "/products?category=Footwear",
            },
            { name: "Books", icon: "📚", path: "/products?category=Books" },
            {
              name: "Home & Kitchen",
              icon: "🏠",
              path: "/products?category=Home+%26+Kitchen",
            },
            { name: "Beauty", icon: "💄", path: "/products?category=Beauty" },
            { name: "Sports", icon: "⚽", path: "/products?category=Sports" },
            { name: "Toys", icon: "🧸", path: "/products?category=Toys" },
            { name: "Other", icon: "📦", path: "/products?category=Other" },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="flex flex-col items-center gap-2 p-4 bg-white 
                   rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 
                   transition-all border border-gray-100 group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <span
                className="text-xs font-medium text-gray-600 text-center 
                         leading-tight font-sans"
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Men & Women quick links below */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Link
            to="/products?gender=Men"
            className="flex items-center justify-center gap-3 py-4 bg-gray-900 
                 text-white rounded-2xl hover:bg-gray-700 transition-colors"
          >
            <span className="text-2xl">👔</span>
            <div>
              <p className="font-bold text-sm tracking-wide">
                Men's Collection
              </p>
              <p className="text-gray-400 text-xs font-sans">
                Clothing · Footwear · More
              </p>
            </div>
          </Link>
          <Link
            to="/products?gender=Women"
            className="flex items-center justify-center gap-3 py-4 bg-pink-600 
                 text-white rounded-2xl hover:bg-pink-700 transition-colors"
          >
            <span className="text-2xl">👗</span>
            <div>
              <p className="font-bold text-sm tracking-wide">
                Women's Collection
              </p>
              <p className="text-pink-200 text-xs font-sans">
                Clothing · Beauty · Footwear
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p
              className="text-amber-600 text-xs font-sans tracking-[0.3em] 
                          uppercase mb-2"
            >
              Handpicked
            </p>
            <h2 className="text-4xl font-bold text-gray-900">
              Featured Products
            </h2>
          </div>
          <Link
            to="/products"
            className="font-sans text-sm tracking-widest uppercase 
                       text-gray-600 hover:text-gray-900 border-b 
                       border-gray-400 pb-0.5 flex items-center gap-2 
                       hover:gap-3 transition-all"
          >
            View All <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-72 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-gray-300">
            <p className="text-gray-400 text-lg">No products yet</p>
            <p className="text-gray-300 text-sm mt-2">
              Add products from the admin panel
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <div key={product._id} className="group">
                {/* Image */}
                <div
                  className="relative overflow-hidden bg-gray-100 
                                aspect-[3/4] mb-4"
                >
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={
                        product.images?.[0]?.url ||
                        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover 
                                 group-hover:scale-105 transition-transform 
                                 duration-500"
                    />
                  </Link>

                  {/* Hover actions */}
                  <div
                    className="absolute bottom-0 left-0 right-0 
                                  bg-white/95 py-3 px-4 flex gap-2
                                  translate-y-full group-hover:translate-y-0 
                                  transition-transform duration-300"
                  >
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      disabled={product.stock === 0}
                      className="flex-1 bg-gray-900 text-white text-xs 
                                 font-sans tracking-widest uppercase py-2 
                                 hover:bg-amber-500 transition-colors 
                                 disabled:opacity-40 flex items-center 
                                 justify-center gap-1"
                    >
                      <FiShoppingCart size={13} />
                      {product.stock === 0 ? "Sold Out" : "Add to Cart"}
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(product._id)}
                      className="border border-gray-300 p-2 hover:border-gray-900 
                                 hover:text-red-500 transition-colors"
                    >
                      <FiHeart size={14} />
                    </button>
                  </div>

                  {/* Badges */}
                  {product.discountPrice > 0 && (
                    <span
                      className="absolute top-3 left-3 bg-red-500 
                                     text-white text-xs font-sans 
                                     tracking-wider px-2 py-1"
                    >
                      {Math.round(
                        ((product.price - product.discountPrice) /
                          product.price) *
                          100,
                      )}
                      % OFF
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span
                      className="absolute top-3 right-3 bg-gray-900 
                                     text-white text-xs font-sans 
                                     tracking-wider px-2 py-1"
                    >
                      SOLD OUT
                    </span>
                  )}
                </div>

                {/* Info */}
                <div>
                  <p
                    className="text-xs font-sans text-gray-400 
                                tracking-widest uppercase mb-1"
                  >
                    {product.category}
                  </p>
                  <Link to={`/products/${product._id}`}>
                    <h3
                      className="text-gray-900 font-medium text-sm 
                                   line-clamp-1 hover:text-amber-600 
                                   transition-colors mb-1"
                    >
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">
                      ₹
                      {product.discountPrice > 0
                        ? product.discountPrice
                        : product.price}
                    </span>
                    {product.discountPrice > 0 && (
                      <span className="text-gray-400 line-through text-sm">
                        ₹{product.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── FULL WIDTH BANNER ─────────────────────────────── */}
      <section className="relative h-[50vh] overflow-hidden my-8">
        <img
          src={BANNER_IMAGE}
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div
          className="relative z-10 h-full flex items-center justify-center 
                        text-center text-white px-6"
        >
          <div>
            <p
              className="text-amber-300 text-xs font-sans tracking-[0.4em] 
                          uppercase mb-4"
            >
              Limited Time Offer
            </p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Up to 50% Off
              <br />
              <span className="italic text-amber-300">Selected Items</span>
            </h2>
            <Link
              to="/products"
              className="inline-block bg-white text-gray-900 font-sans 
                         font-bold text-sm tracking-widest uppercase 
                         px-10 py-4 hover:bg-amber-300 transition-colors"
            >
              Shop the Sale
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="border-t border-b border-gray-200 bg-white">
        <div
          className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 
                        md:grid-cols-4 gap-8 text-center"
        >
          {[
            { icon: "🚚", title: "Free Delivery", sub: "On orders above ₹500" },
            { icon: "↩️", title: "Easy Returns", sub: "30-day return policy" },
            { icon: "🔒", title: "Secure Payment", sub: "100% protected" },
            { icon: "🎧", title: "24/7 Support", sub: "Always here to help" },
          ].map((f) => (
            <div key={f.title}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <p className="font-bold text-gray-900 text-sm tracking-wide">
                {f.title}
              </p>
              <p className="text-gray-400 text-xs mt-1 font-sans">{f.sub}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

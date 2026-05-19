import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/slices/productSlice";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from "react-icons/fi";
import Loader from "../../components/common/Loader";

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Footwear",
  "Books",
  "Home & Kitchen",
  "Beauty",
  "Sports",
  "Toys",
  "Other",
];

const GENDERS = ["N/A", "Men", "Women", "Unisex"];

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  category: "Electronics",
  stock: "",
  gender: "N/A",
};

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, totalPages, currentPage } = useSelector(
    (s) => s.products,
  );

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({ page }));
  }, [page]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const openCreate = () => {
    setEditProduct(null);
    setFormData(EMPTY_FORM);
    setImages([]);
    setImagePreviews([]);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || "",
      category: product.category,
      stock: product.stock,
      gender: product.gender || "N/A",
    });
    setImages([]);
    setImagePreviews(product.images?.map((i) => i.url) || []);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== "") data.append(k, v);
      });
      images.forEach((img) => data.append("images", img));

      if (editProduct) {
        await axios.put(`/products/${editProduct._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated!");
      } else {
        await axios.post("/products", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product created!");
      }
      setShowModal(false);
      dispatch(fetchProducts({ page }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
    setSubmitLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`/products/${id}`);
      toast.success("Product deleted");
      dispatch(fetchProducts({ page }));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your product catalog
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 
                     py-2 rounded-xl text-sm font-semibold flex items-center 
                     gap-2 transition-colors"
        >
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div
            className="bg-white rounded-2xl border border-gray-100 
                          overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {[
                      "Product",
                      "Category",
                      "Price",
                      "Stock",
                      "Rating",
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
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              product.images?.[0]?.url ||
                              "https://placehold.co/50x50?text=?"
                            }
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg 
                                       bg-gray-100"
                          />
                          <span
                            className="font-medium text-gray-800 
                                           line-clamp-1 max-w-[180px]"
                          >
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span
                            className="text-xs bg-indigo-50 text-indigo-700 
                                           px-2 py-1 rounded-full font-medium 
                                           w-fit"
                          >
                            {product.category}
                          </span>
                          {product.gender && product.gender !== "N/A" && (
                            <span
                              className="text-xs bg-pink-50 text-pink-600 
                                             px-2 py-1 rounded-full font-medium 
                                             w-fit"
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
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        ₹{product.price}
                        {product.discountPrice > 0 && (
                          <span className="text-xs text-green-600 ml-1">
                            (₹{product.discountPrice})
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-bold px-2 py-1 
                                          rounded-full ${
                                            product.stock === 0
                                              ? "bg-red-100 text-red-600"
                                              : product.stock < 10
                                                ? "bg-orange-100 text-orange-600"
                                                : "bg-green-100 text-green-600"
                                          }`}
                        >
                          {product.stock === 0
                            ? "Out of Stock"
                            : `${product.stock} units`}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        ⭐ {product.ratings?.toFixed(1) || "0.0"}
                        <span className="text-gray-400 text-xs ml-1">
                          ({product.numReviews})
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(product)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 
                                       rounded-lg transition-colors"
                          >
                            <FiEdit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
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
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center 
                        justify-center p-4"
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl 
                          max-h-[90vh] overflow-y-auto"
          >
            <div
              className="flex items-center justify-between p-6 
                            border-b border-gray-100"
            >
              <h2 className="text-lg font-bold text-gray-800">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl 
                               px-4 py-2.5 text-sm focus:outline-none 
                               focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl 
                               px-4 py-2.5 text-sm focus:outline-none 
                               focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl 
                               px-4 py-2.5 text-sm focus:outline-none 
                               focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Discount Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discountPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountPrice: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 rounded-xl 
                               px-4 py-2.5 text-sm focus:outline-none 
                               focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl 
                               px-4 py-2.5 text-sm focus:outline-none 
                               focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl 
                               px-4 py-2.5 text-sm focus:outline-none 
                               focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g === "N/A"
                          ? "N/A (Not Applicable)"
                          : g === "Men"
                            ? "👔 Men"
                            : g === "Women"
                              ? "👗 Women"
                              : "🤝 Unisex"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl 
                               px-4 py-2.5 text-sm focus:outline-none 
                               focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Images */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Images {!editProduct && "*"}
                  </label>
                  <label
                    className="flex items-center justify-center gap-2 
                                    border-2 border-dashed border-gray-200 
                                    rounded-xl py-6 cursor-pointer 
                                    hover:border-indigo-300 transition-colors"
                  >
                    <FiUpload className="text-gray-400" size={20} />
                    <span className="text-sm text-gray-500">
                      Click to upload images (max 5)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreviews.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {imagePreviews.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`preview ${i}`}
                          className="w-16 h-16 object-cover rounded-xl 
                                     border border-gray-200"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-700 
                             font-medium py-2.5 rounded-xl hover:bg-gray-50 
                             transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 
                             text-white font-semibold py-2.5 rounded-xl 
                             transition-colors text-sm disabled:opacity-60 
                             flex items-center justify-center gap-2"
                >
                  {submitLoading ? (
                    <>
                      <div
                        className="w-4 h-4 border-2 border-white 
                                      border-t-transparent rounded-full 
                                      animate-spin"
                      />
                      Saving...
                    </>
                  ) : editProduct ? (
                    "Update Product"
                  ) : (
                    "Create Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

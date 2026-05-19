import { Link } from "react-router-dom";
import { FiGithub, FiMail, FiHeart } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div
        className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 
                      md:grid-cols-3 gap-8"
      >
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Shop<span className=" italic text-amber-600">Ease</span>
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your one-stop destination for everything you need. Quality products,
            fast delivery, great prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-primary-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="hover:text-primary-400 transition-colors"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="hover:text-primary-400 transition-colors"
              >
                Cart
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                className="hover:text-primary-400 transition-colors"
              >
                My Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FiMail size={14} />
              support@shopease.com
            </li>
            <li className="flex items-center gap-2">
              <FiGithub size={14} />
              github.com/shopease
            </li>
          </ul>
        </div>
      </div>

      <div
        className="border-t border-gray-800 py-4 text-center text-xs 
                      text-gray-500 flex items-center justify-center gap-1"
      >
        Made with <FiHeart size={12} className="text-red-400" />
        by ShopEase Team © {new Date().getFullYear()}
      </div>
    </footer>
  );
};

export default Footer;

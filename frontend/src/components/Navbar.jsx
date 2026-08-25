import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext'; // 🔥 নতুন ইম্পোর্ট
import { ShoppingBag, LogOut, LogIn } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext); // 🔥 কার্ট আইটেম নিয়ে আসা
  const navigate = useNavigate();

  // কার্টের মোট আইটেম সংখ্যা হিসাব করা
const totalItemsCount = cartItems.length;
  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-black text-indigo-600 tracking-tight">
          Bazar<span className="text-orange-500">Hub</span>
        </Link>

        <div className="flex items-center space-x-4">
          {/* কার্ট আইকন উইথ লাইভ কাউন্ট ব্যাজ */}
          <Link to="/cart" className="p-2 text-gray-600 hover:text-indigo-600 relative">
            <ShoppingBag className="w-6 h-6" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                {totalItemsCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center space-x-3">
              {user.is_vendor && (
                <Link to="/vendor-dashboard" className="text-xs font-bold text-white bg-orange-500 px-3 py-2 rounded-xl shadow-sm hover:bg-orange-600 transition">
                  ভেন্ডর প্যানেল
                </Link>
              )}
              <span className="text-sm font-medium hidden md:inline text-gray-700">@{user.username}</span>
              <button 
                onClick={() => { logout(); navigate('/login'); }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-1 text-sm font-semibold text-white bg-indigo-600 px-4 py-2 rounded-xl shadow-sm hover:bg-indigo-700 transition">
              <LogIn className="w-4 h-4" />
              <span>লগইন</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

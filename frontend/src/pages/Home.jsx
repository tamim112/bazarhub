import { useState, useEffect, useContext } from 'react';
import apiClient from '../api/apiClient';
import { Layers, ShoppingCart, Tag } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Home = () => {
  // ১. সেফলি কার্ট কনটেক্সট চেক করা (যাতে কনটেক্সট মিসিং হলেও ক্র্যাশ না করে)
  const cartContext = useContext(CartContext);
  const addToCart = cartContext ? cartContext.addToCart : null;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // ২. Django থেকে প্রোডাক্ট এবং ক্যাটাগরি ডেটা ফেচ করা
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        // apiClient-এর বেস ইউআরএল অনুযায়ী পাথ অ্যাডজাস্ট করুন
        const [productRes, categoryRes] = await Promise.all([
          apiClient.get('store/products/'),
          apiClient.get('store/categories/')
        ]);
        setProducts(productRes.data || []);
        setCategories(categoryRes.data || []);
      } catch (error) {
        console.error("Error fetching data from API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreData();
  }, []);

  // ৩. ডিফেন্সিভ ক্যাটাগরি ফিল্টার লজিক
  const filteredProducts = Array.isArray(products)
    ? (selectedCategory ? products.filter(p => p.category === selectedCategory) : products)
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ক্যাটাগরি সেকশন */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1">
          <Layers className="w-4 h-4" /> ক্যাটাগরি সমূহ
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${!selectedCategory ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border'}`}
          >
            সব প্রোডাক্ট
          </button>
          {Array.isArray(categories) && categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${selectedCategory === cat.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* প্রোডাক্ট গ্রিড সেকশন */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1">
          <Tag className="w-4 h-4" /> আমাদের কালেকশন ({filteredProducts.length})
        </h3>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed text-gray-500 font-medium">
            এই ক্যাটাগরিতে কোনো প্রোডাক্ট পাওয়া যায়নি!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition">
                {/* ইমেজ */}
                <div className="bg-gray-100 h-48 w-full relative overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gray-50">No Image</div>
                  )}
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                    Seller: {product.vendor_username}
                  </span>
                </div>

                {/* প্রোডাক্ট বডি */}
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">{product.category_name || "General"}</span>
                    <h4 className="font-bold text-gray-800 text-base line-clamp-1 mt-0.5">{product.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{product.description || "কোনো বিবরণ দেওয়া নেই।"}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-xs text-gray-400 block leading-none">মূল্য</span>
                      <span className="text-lg font-black text-gray-900">৳{product.price}</span>
                    </div>
                    
                    {/* কার্ট বাটন */}
                    <button 
                      onClick={async () => {
                        if (addToCart) {
                          const res = await addToCart(product.id);
                          if (res && res.success) alert("প্রোডাক্টটি সফলভাবে কার্টে যোগ হয়েছে!");
                        } else {
                          alert("কার্ট সিস্টেম এই মুহূর্তে লোড হচ্ছে না।");
                        }
                      }}
                      className="p-2.5 bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 rounded-xl transition border border-gray-100"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

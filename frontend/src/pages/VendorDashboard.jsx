import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { PlusCircle, Package, Image, AlertCircle } from 'lucide-react';

const VendorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ফর্ম স্টেট সমূহ
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // সিকিউরিটি চেক: কোনো সাধারণ কাস্টমার যেন এই পেজে না আসতে পারে
  useEffect(() => {
    if (!user || !user.is_vendor) {
      navigate('/login');
    } else {
      // Django থেকে ক্যাটাগরি লিস্ট নিয়ে আসা যাতে ড্রপডাউনে দেখানো যায়
      const fetchCategories = async () => {
        try {
          const res = await apiClient.get('store/categories/');
          setCategories(res.data || []);
        } catch (err) {
          console.error("Categories fetch error:", err);
        }
      };
      fetchCategories();
    }
  }, [user, navigate]);

const handleImageChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    setImage(e.target.files[0]); // 🔥 প্রথম ফাইলটি সিঙ্গেল অবজেক্ট হিসেবে সেট হবে
  }
};

  const handleUploadProduct = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!category) {
      setError('দয়া করে একটি প্রোডাক্ট ক্যাটাগরি সিলেক্ট করুন!');
      return;
    }

    setLoading(true);

    // ইমেজ ফাইল সহ ডেটা পাঠানোর জন্য প্রফেশনাল FormData আর্কিটেকচার
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await apiClient.post('store/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // ফাইল আপলোডের জন্য হেডার পরিবর্তন
        },
      });

      if (response.status === 201) {
        setMessage('প্রোডাক্টটি সফলভাবে আপনার ইনভেন্টরিতে যুক্ত হয়েছে!');
        // ফর্ম খালি করে দেওয়া
        setName('');
        setCategory('');
        setDescription('');
        setPrice('');
        setStock('');
        setImage(null);
        document.getElementById('productImage').value = ''; // ফাইল ইনপুট ক্লিয়ার
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'প্রোডাক্ট আপলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl">
        <h2 className="text-xl font-black text-gray-800 flex items-center gap-2 mb-2">
          <PlusCircle className="w-6 h-6 text-indigo-600" /> নতুন প্রোডাক্ট যোগ করুন
        </h2>
        <p className="text-xs text-gray-500 mb-6">আপনার শপের জন্য ক্যাটাগরি অনুযায়ী প্রোডাক্টের বিবরণ দিন।</p>

        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 text-center font-medium border border-red-100 flex items-center justify-center gap-1.5"><AlertCircle className="w-4 h-4" /> {error}</div>}
        {message && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-xl mb-4 text-center font-medium border border-green-100">{message}</div>}

        <form onSubmit={handleUploadProduct} className="space-y-4">
          {/* ক্যাটাগরি সিলেক্ট ড্রপডাউন */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">ক্যাটাগরি সিলেক্ট করুন</label>
            <select 
              required value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-indigo-500 text-sm transition"
            >
              <option value="">-- ক্যাটাগরি বাছুন --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* প্রোডাক্ট নাম */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">প্রোডাক্টের নাম</label>
            <input 
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-indigo-500 text-sm transition"
              placeholder="যেমন: Smart Watch Series 9"
            />
          </div>

          {/* প্রোডাক্ট বিবরণ */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">প্রোডাক্টের বিবরণ (Description)</label>
            <textarea 
              rows="3" value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-indigo-500 text-sm transition"
              placeholder="প্রোডাক্টের আকর্ষণীয় ফিচারগুলো লিখুন..."
            ></textarea>
          </div>

          {/* প্রাইস এবং স্টক গ্রিড */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">মূল্য (৳)</label>
              <input 
                type="number" required value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-indigo-500 text-sm transition"
                placeholder="৳ Price"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">স্টক পরিমাণ (Qty)</label>
              <input 
                type="number" required value={stock} onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-indigo-500 text-sm transition"
                placeholder="যেমন: 50"
              />
            </div>
          </div>

          {/* প্রোডাক্ট ইমেজ আপলোডার */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
              <Image className="w-3.5 h-3.5 text-gray-400" /> প্রোডাক্টের ছবি আপলোড
            </label>
            <input 
              id="productImage" type="file" accept="image/*" onChange={handleImageChange}
              className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition border border-dashed p-2 rounded-xl bg-gray-50/50"
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition text-sm flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            {loading ? "আপলোড হচ্ছে..." : "ইনভেন্টরিতে যুক্ত করুন"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorDashboard;

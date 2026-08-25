import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, Trash2, ArrowRight, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, loading } = useContext(CartContext);
  const navigate = useNavigate();

  const grandTotal = cartItems.reduce((total, item) => total + parseFloat(item.total_price), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-md mx-auto md:max-w-4xl">
      <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
        <ShoppingCart className="w-6 h-6 text-indigo-600" /> আপনার শপিং কার্ট ({cartItems.length})
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium mb-4">আপনার কার্টটি বর্তমানে খালি আছে।</p>
          <Link to="/" className="inline-flex items-center gap-1 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md hover:bg-indigo-700 transition">
            প্রোডাক্ট কিনুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* কার্ট আইটেম লিস্ট */}
          <div className="md:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border">
                    <img 
                      src={item.product_details.image ? `${item.product_details.image}` : 'https://placeholder.com'} 
                      alt={item.product_details.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm md:text-base line-clamp-1">{item.product_details.name}</h4>
                    <p className="text-xs text-gray-400">মূল্য: ৳{item.product_details.price}</p>
                    
                    <div className="flex items-center gap-2 mt-2 bg-gray-50 border w-fit rounded-lg p-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-white rounded text-gray-600 transition">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-2 text-gray-800">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-white rounded text-gray-600 transition">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  <span className="text-base font-black text-gray-800">৳{item.total_price}</span>
                  {/* রিমুভ অপশন */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

                    {/* অর্ডার সামারি কার্ড */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl h-fit space-y-4">
            <h3 className="font-black text-lg text-gray-800 border-b pb-2">অর্ডার সামারি</h3>
            <div className="flex justify-between text-sm text-gray-600">
              <span>মোট আইটেম</span>
              <span className="font-bold">{cartItems.length} টি</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 border-b pb-4">
              <span>ডেলিভারি চার্জ</span>
              <span className="text-green-600 font-bold">ফ্রি</span>
            </div>
            <div className="flex justify-between text-lg font-black text-gray-900 pt-2">
              <span>সর্বমোট</span>
              <span className="text-indigo-600">৳{grandTotal}</span>
            </div>
            
            {/* চেকআউট বাটন (Workable Link) */}
            <Link to="/checkout" className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-indigo-700 transition text-sm flex items-center justify-center gap-2">
              <span>চেকআউট করুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* 🔥 নতুন যুক্ত করা হলো: আরও প্রোডাক্ট যোগ করার বাটন */}
            <Link to="/" className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 border border-gray-200">
              <span>আরও প্রোডাক্ট যোগ করুন</span>
            </Link>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;

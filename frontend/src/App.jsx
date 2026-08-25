import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import VendorDashboard from './pages/VendorDashboard'; // 🔥 নতুন ইম্পোর্ট

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-6 max-w-md md:max-w-6xl">
            <Routes>
              <Route path="/" element={<Home />} /> 
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/vendor-dashboard" element={<VendorDashboard />} /> {/* 🔥 ভেন্ডর রাউট */}
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

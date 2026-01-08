import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Navbar from './components/Navbar';
import PackageList from './features/packages/PackageList';
import PackageDetail from './features/packages/PackageDetail';
import MyBookings from './features/bookings/MyBookings';
import AdminDashboard from './features/admin/AdminDashboard';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/packages" element={<PackageList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/packages/:id" element={<PackageDetail />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

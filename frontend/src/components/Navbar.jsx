import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Navbar = () => {
    const { isAuthenticated, role } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">Travel Booking</Link>
            </div>
            <div className="nav-links">
                {isAuthenticated ? (
                    <>
                        {role === 'ADMIN' && <Link to="/admin/dashboard">Admin Dashboard</Link>}
                        <Link to="/packages">Explore Packages</Link>
                        <Link to="/my-bookings">My Bookings</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

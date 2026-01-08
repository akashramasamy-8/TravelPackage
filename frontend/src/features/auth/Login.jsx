import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from './authSlice';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const { loading, error, isAuthenticated, role } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            if (role === 'ADMIN') Navigate('/admin/dashboard');
            else Navigate('/packages');
        }
        return () => { dispatch(clearError()); }
    }, [isAuthenticated, role, Navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-container">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to continue your journey</p>
                </div>

                {error && <div className="error-message-styled">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group-styled">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            placeholder="you@example.com"
                        />
                    </div>
                    <div className="form-group-styled">
                        <label>Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="submit-btn-styled" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

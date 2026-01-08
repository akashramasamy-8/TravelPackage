import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings } from './bookingSlice';
import { Link } from 'react-router-dom';
import './MyBookings.css';

const MyBookings = () => {
    const dispatch = useDispatch();
    const { bookings, loading, error } = useSelector((state) => state.bookings);

    useEffect(() => {
        dispatch(fetchUserBookings());
    }, [dispatch]);

    if (loading) return <div>Loading bookings...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="bookings-container">
            <div className="bookings-header">
                <h2>My Bookings</h2>
                <p>Track your upcoming adventures and past journeys</p>
            </div>

            {bookings.length === 0 ? (
                <div className="empty-bookings">
                    <h3>No bookings found yet</h3>
                    <p>Ready to start your next adventure?</p>
                    <Link to="/packages" className="btn-explore">Explore Packages</Link>
                </div>
            ) : (
                <div className="bookings-list">
                    {bookings.map(booking => (
                        <div key={booking.id} className="booking-item">
                            <div className="booking-details">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <h3>{booking.travelPackage?.name || "Unknown Package"}</h3>
                                    <span className={`status-badge status-${booking.status?.toLowerCase() || 'pending'}`}>
                                        {booking.status || 'PENDING'}
                                    </span>
                                </div>

                                <div className="booking-meta">
                                    <div className="meta-item">
                                        <span>📅 {new Date(booking.bookingDate).toLocaleDateString(undefined, {
                                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                        })}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span>📍 {booking.travelPackage?.location || 'N/A'}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span>⏱ {booking.travelPackage?.duration || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="booking-includes" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #e2e8f0', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                    {booking.selectedHotel && (
                                        <div className="include-item" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span style={{ fontSize: '1.2rem' }}>🏨</span>
                                            <div>
                                                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#1e293b' }}>{booking.selectedHotel.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{booking.roomType} Room</div>
                                            </div>
                                        </div>
                                    )}
                                    {booking.selectedFlight && (
                                        <div className="include-item" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span style={{ fontSize: '1.2rem' }}>✈️</span>
                                            <div>
                                                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#1e293b' }}>{booking.selectedFlight.airline}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{booking.flightClass} Class</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="price-display">
                                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Total Paid</span>
                                <span className="total-price">₹{booking.totalPrice}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;

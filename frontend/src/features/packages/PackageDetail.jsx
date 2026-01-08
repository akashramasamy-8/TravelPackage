import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchPackageById, addHotel, addFlight, addItinerary } from './packageSlice';
import { createBooking, clearBookingMessage, fetchUserBookings } from '../bookings/bookingSlice';
import './PackageDetails.css';

const PackageDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentPackage: pkg, loading } = useSelector((state) => state.packages);
    const { isAuthenticated, role } = useSelector((state) => state.auth);
    const { bookings, successMessage, error: bookingError } = useSelector((state) => state.bookings);

    // Selection State
    const [selectedHotelId, setSelectedHotelId] = useState(null);
    const [roomType, setRoomType] = useState('STANDARD'); // STANDARD, DELUXE, SUITE
    const [selectedFlightId, setSelectedFlightId] = useState(null);
    const [flightClass, setFlightClass] = useState('ECONOMY'); // ECONOMY, BUSINESS, FIRST

    // Check if already booked
    const isBooked = useMemo(() => {
        return bookings.some(b => b.travelPackage?.id === parseInt(id));
    }, [bookings, id]);

    useEffect(() => {
        dispatch(fetchPackageById(id));
        if (isAuthenticated) {
            dispatch(fetchUserBookings());
        }
        return () => { dispatch(clearBookingMessage()); }
    }, [dispatch, id, isAuthenticated]);

    // Derived Calculations
    const { totalPrice, hotelCost, flightCost, breakdown } = useMemo(() => {
        if (!pkg) return { totalPrice: 0, hotelCost: 0, flightCost: 0, breakdown: {} };

        // Base Price (assuming pkg.price is the base fee without components, or we treat it as total base)
        let base = pkg.price || 0;
        let hCost = 0;
        let fCost = 0;

        if (selectedHotelId) {
            const h = pkg.hotels.find(h => h.id === selectedHotelId);
            if (h) {
                let multiplier = 1.0;
                if (roomType === 'DELUXE') multiplier = 1.2;
                if (roomType === 'SUITE') multiplier = 1.5;
                hCost = (h.price || 0) * multiplier;
            }
        }

        if (selectedFlightId) {
            const f = pkg.flights.find(f => f.id === selectedFlightId);
            if (f) {
                let multiplier = 1.0;
                if (flightClass === 'BUSINESS') multiplier = 2.0;
                if (flightClass === 'FIRST') multiplier = 3.0;
                fCost = (f.price || 0) * multiplier;
            }
        }

        return {
            totalPrice: base + hCost + fCost,
            hotelCost: hCost,
            flightCost: fCost,
            breakdown: { base, hCost, fCost }
        };
    }, [pkg, selectedHotelId, roomType, selectedFlightId, flightClass]);

    const [showAdminForm, setShowAdminForm] = useState(false);
    const [activeAdminTab, setActiveAdminTab] = useState('hotels');
    const [itemData, setItemData] = useState({});

    const handleAddItem = (e) => {
        e.preventDefault();
        const actionData = { id, [activeAdminTab.slice(0, -1)]: itemData };
        if (activeAdminTab === 'hotels') dispatch(addHotel({ id, hotel: itemData }));
        if (activeAdminTab === 'flights') dispatch(addFlight({ id, flight: itemData }));
        if (activeAdminTab === 'itinerary') dispatch(addItinerary({ id, itinerary: itemData }));
        setShowAdminForm(false);
        setItemData({});
    };

    const handleBooking = () => {
        const bookingData = {
            packageId: id,
            hotelId: selectedHotelId,
            flightId: selectedFlightId,
            roomType,
            flightClass
        };
        dispatch(createBooking(bookingData));
    };

    if (loading) return <div>Loading...</div>;
    if (!pkg) return <div>Package not found</div>;

    return (
        <div className="details-container">
            {/* Left Column: Content */}
            <div className="details-content">
                <div className="details-header">
                    {pkg.imageUrl && <img src={pkg.imageUrl} alt={pkg.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />}
                    <h1>{pkg.name}</h1>
                    <div className="details-location">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                        {pkg.location} • {pkg.duration}
                    </div>
                </div>

                <div className="description-box">
                    <h3>About this Trip</h3>
                    <p>{pkg.description}</p>
                </div>

                {/* Admin Management Section */}
                {role === 'ADMIN' && (
                    <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                        <h3>Manage Package Content</h3>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <button onClick={() => { setActiveAdminTab('itinerary'); setShowAdminForm(true); }} className="btn-secondary">Add Itinerary</button>
                            <button onClick={() => { setActiveAdminTab('hotels'); setShowAdminForm(true); }} className="btn-secondary">Add Hotel</button>
                            <button onClick={() => { setActiveAdminTab('flights'); setShowAdminForm(true); }} className="btn-secondary">Add Flight</button>
                        </div>

                        {showAdminForm && (
                            <form onSubmit={handleAddItem} className="auth-container" style={{ maxWidth: '100%', margin: '0', boxShadow: 'none', border: '1px solid #ddd' }}>
                                <h4>Add {activeAdminTab.charAt(0).toUpperCase() + activeAdminTab.slice(1)}</h4>
                                {activeAdminTab === 'hotels' && (
                                    <>
                                        <div className="form-group"><input placeholder="Hotel Name" value={itemData.name || ''} onChange={e => setItemData({ ...itemData, name: e.target.value })} required /></div>
                                        <div className="form-group"><input placeholder="Location" value={itemData.location || ''} onChange={e => setItemData({ ...itemData, location: e.target.value })} required /></div>
                                        <div className="form-group"><input placeholder="Rating (1-5)" type="number" step="0.1" value={itemData.rating || ''} onChange={e => setItemData({ ...itemData, rating: e.target.value })} required /></div>
                                        <div className="form-group"><input placeholder="Price" type="number" value={itemData.price || ''} onChange={e => setItemData({ ...itemData, price: e.target.value })} required /></div>
                                    </>
                                )}
                                {activeAdminTab === 'flights' && (
                                    <>
                                        <div className="form-group"><input placeholder="Airline" value={itemData.airline || ''} onChange={e => setItemData({ ...itemData, airline: e.target.value })} required /></div>
                                        <div className="form-group"><input placeholder="Source" value={itemData.source || ''} onChange={e => setItemData({ ...itemData, source: e.target.value })} required /></div>
                                        <div className="form-group"><input placeholder="Destination" value={itemData.destination || ''} onChange={e => setItemData({ ...itemData, destination: e.target.value })} required /></div>
                                        <div className="form-group"><input placeholder="Price" type="number" value={itemData.price || ''} onChange={e => setItemData({ ...itemData, price: e.target.value })} required /></div>
                                    </>
                                )}
                                {activeAdminTab === 'itinerary' && (
                                    <>
                                        <div className="form-group"><input placeholder="Day Number" type="number" value={itemData.dayNumber || ''} onChange={e => setItemData({ ...itemData, dayNumber: e.target.value })} required /></div>
                                        <div className="form-group"><textarea placeholder="Description" value={itemData.description || ''} onChange={e => setItemData({ ...itemData, description: e.target.value })} required style={{ width: '100%' }} /></div>
                                    </>
                                )}
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="submit">Save</button>
                                    <button type="button" onClick={() => { setShowAdminForm(false); setItemData({}); }} style={{ background: '#6c757d' }}>Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {/* Itinerary */}
                <div className="section-container">
                    <div className="section-heading">
                        <span role="img" aria-label="map">🗺️</span> Itinerary
                    </div>
                    <div className="itinerary-timeline">
                        {Array.isArray(pkg.itinerary) && pkg.itinerary.map(item => (
                            <div key={item.id} className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-day">Day {item.dayNumber}</div>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hotel Selection */}
                <div className="section-container">
                    <div className="section-heading">
                        <span className="hotel-icon">🏨</span> Select Accommodation
                    </div>
                    <div className="options-grid">
                        {Array.isArray(pkg.hotels) && pkg.hotels.map(h => (
                            <div
                                key={h.id}
                                className={`option-card hotel-card ${selectedHotelId === h.id ? 'selected' : ''}`}
                                onClick={() => setSelectedHotelId(h.id)}
                            >
                                <div className="option-header">
                                    <span className="option-name">{h.name}</span>
                                    <span className="option-price">₹{h.price}/n</span>
                                </div>

                                <div className="hotel-meta">
                                    <span>📍 {h.location}</span>
                                    <span className="rating-badge">★ {h.rating}</span>
                                    {h.carbonFootprint < 100 && <span style={{ color: '#166534', fontSize: '0.8rem', marginTop: '0.25rem' }}>🌱 Eco-Friendly</span>}
                                </div>

                                {selectedHotelId === h.id && (
                                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1' }} onClick={e => e.stopPropagation()}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Room Type</label>
                                        <select
                                            value={roomType}
                                            onChange={(e) => setRoomType(e.target.value)}
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                        >
                                            <option value="STANDARD">Standard</option>
                                            <option value="DELUXE">Deluxe (+20%)</option>
                                            <option value="SUITE">Suite (+50%)</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Flight Selection */}
                <div className="section-container">
                    <div className="section-heading">
                        <span className="flight-icon">✈️</span> Select Flight
                    </div>
                    <div className="options-grid">
                        {Array.isArray(pkg.flights) && pkg.flights.map(f => (
                            <div
                                key={f.id}
                                className={`option-card flight-card ${selectedFlightId === f.id ? 'selected' : ''}`}
                                onClick={() => setSelectedFlightId(f.id)}
                            >
                                <div className="option-header">
                                    <span className="airline-badge">{f.airline}</span>
                                    <span className="option-price">₹{f.price}</span>
                                </div>

                                <div className="flight-meta">
                                    <span>🛫 {f.source} ➝ {f.destination}</span>
                                    {f.price < 500 && <span style={{ color: '#0369a1', fontSize: '0.8rem' }}>💎 Best Value</span>}
                                </div>

                                {selectedFlightId === f.id && (
                                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1' }} onClick={e => e.stopPropagation()}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Class</label>
                                        <select
                                            value={flightClass}
                                            onChange={(e) => setFlightClass(e.target.value)}
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                        >
                                            <option value="ECONOMY">Economy</option>
                                            <option value="BUSINESS">Business (2x)</option>
                                            <option value="FIRST">First Class (3x)</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Sticky Summary & Budget Tracker */}
            <div className="booking-sidebar">
                <div className="summary-header">
                    <h3>Trip Summary</h3>
                </div>

                {/* Budget Tracker Visualization */}
                <div style={{ display: 'flex', height: '8px', width: '100%', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                    <div style={{ width: `${(breakdown.base / totalPrice) * 100}%`, background: '#94a3b8' }} title="Base Package" />
                    <div style={{ width: `${(breakdown.hCost / totalPrice) * 100}%`, background: '#f59e0b' }} title="Hotel" />
                    <div style={{ width: `${(breakdown.fCost / totalPrice) * 100}%`, background: '#3b82f6' }} title="Flight" />
                </div>

                <div className="price-breakdown">
                    <div className="price-row">
                        <span>Base Package</span>
                        <span>₹{breakdown.base.toFixed(2)}</span>
                    </div>
                    <div className="price-row">
                        <span style={{ color: selectedHotelId ? '#d97706' : '#94a3b8' }}>
                            {selectedHotelId ? `Hotel (${roomType})` : 'No Hotel Selected'}
                        </span>
                        <span>₹{breakdown.hCost.toFixed(2)}</span>
                    </div>
                    <div className="price-row">
                        <span style={{ color: selectedFlightId ? '#2563eb' : '#94a3b8' }}>
                            {selectedFlightId ? `Flight (${flightClass})` : 'No Flight Selected'}
                        </span>
                        <span>₹{breakdown.fCost.toFixed(2)}</span>
                    </div>
                    <div className="price-row total">
                        <span>Total Est.</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                {isAuthenticated ? (
                    isBooked ? (
                        <button className="book-btn disabled" disabled>Already Booked</button>
                    ) : (
                        <button className="book-btn" onClick={handleBooking}>Book Adventure</button>
                    )
                ) : (
                    <Link to="/login" className="book-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>Login to Book</Link>
                )}

                {successMessage && <div className="success-msg" style={{ marginTop: '1rem', color: '#166534', background: '#dcfce7', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>{successMessage}</div>}
                {bookingError && <div className="error-msg" style={{ marginTop: '1rem', color: '#991b1b', background: '#fee2e2', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>{bookingError}</div>}
            </div>
        </div>
    );
};

export default PackageDetail;

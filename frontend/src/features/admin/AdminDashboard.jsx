import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackages, createPackage, deletePackage } from '../packages/packageSlice';
import { fetchAllBookings, updateBookingStatus } from '../bookings/bookingSlice';
import { fetchHotels, fetchFlights, createHotel, createFlight } from '../resources/resourceSlice';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { packages } = useSelector((state) => state.packages);
    const { bookings } = useSelector((state) => state.bookings);
    const { hotels, flights } = useSelector((state) => state.resources);

    const [activeTab, setActiveTab] = useState('packages');

    // Package Form State
    const [newPackage, setNewPackage] = useState({
        name: '', location: '', duration: '', price: '', description: '', imageUrl: ''
    });
    const [newItinerary, setNewItinerary] = useState([{ dayNumber: 1, description: '' }]);
    const [selectedHotels, setSelectedHotels] = useState([]);
    const [selectedFlights, setSelectedFlights] = useState([]);
    const [calculatedPrice, setCalculatedPrice] = useState(0);
    const [calculatedCarbon, setCalculatedCarbon] = useState(0);

    // Inventory State - Hotels & Flights
    const [newHotel, setNewHotel] = useState({ name: '', location: '', price: '', rating: '', carbonFootprint: '' });
    const [newFlight, setNewFlight] = useState({ airline: '', source: '', destination: '', price: '', carbonFootprint: '' });
    const [hotelSearch, setHotelSearch] = useState('');
    const [flightSearch, setFlightSearch] = useState('');

    useEffect(() => {
        dispatch(fetchPackages());
        dispatch(fetchAllBookings());
        dispatch(fetchHotels());
        dispatch(fetchFlights());
    }, [dispatch]);

    // Calculation Effect (keep)

    const addItineraryDay = () => setNewItinerary([...newItinerary, { dayNumber: newItinerary.length + 1, description: '' }]);
    const removeItineraryDay = (index) => setNewItinerary(newItinerary.filter((_, i) => i !== index));
    const updateItinerary = (index, field, value) => {
        const updated = [...newItinerary];
        updated[index][field] = value;
        setNewItinerary(updated);
    };

    const handleCreatePackage = (e) => {
        e.preventDefault();
        const pkgData = {
            ...newPackage,
            hotels: selectedHotels.map(id => hotels.find(h => h.id === id)),
            flights: selectedFlights.map(id => flights.find(f => f.id === id)),
            itinerary: newItinerary.filter(i => i.description) // Only send filled items
        };
        dispatch(createPackage(pkgData));
        setNewPackage({ name: '', location: '', duration: '', price: '', description: '' });
        setNewItinerary([{ dayNumber: 1, description: '' }]);
        setSelectedHotels([]);
        setSelectedFlights([]);
    };

    const handleCreateHotel = (e) => {
        e.preventDefault();
        dispatch(createHotel(newHotel));
        setNewHotel({ name: '', location: '', price: '', rating: '', carbonFootprint: '' });
    };

    const handleCreateFlight = (e) => {
        e.preventDefault();
        dispatch(createFlight(newFlight));
        setNewFlight({ airline: '', source: '', destination: '', price: '', carbonFootprint: '' });
    };

    const handleDeletePackage = (id) => {
        if (window.confirm('Are you sure you want to delete this package?')) {
            dispatch(deletePackage(id));
        }
    };

    const handleStatusUpdate = (id, status) => {
        dispatch(updateBookingStatus({ id, status }));
    };

    const toggleHotelSelection = (id) => {
        setSelectedHotels(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const toggleFlightSelection = (id) => {
        setSelectedFlights(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    // Filter Logic
    const filteredHotels = Array.isArray(hotels) ? hotels.filter(h =>
        h.name.toLowerCase().includes(hotelSearch.toLowerCase()) ||
        h.location.toLowerCase().includes(hotelSearch.toLowerCase())
    ) : [];

    const filteredFlights = Array.isArray(flights) ? flights.filter(f =>
        f.airline.toLowerCase().includes(flightSearch.toLowerCase()) ||
        f.source.toLowerCase().includes(flightSearch.toLowerCase()) ||
        f.destination.toLowerCase().includes(flightSearch.toLowerCase())
    ) : [];

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>Admin Dashboard</h2>
            </div>

            <div className="admin-tabs">
                <button className={`tab-btn ${activeTab === 'packages' ? 'active' : ''}`} onClick={() => setActiveTab('packages')}>Packages</button>
                <button className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>Bookings</button>
                <button className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>Inventory</button>
            </div>

            <div className="tab-content">
                {activeTab === 'packages' && (
                    <div>
                        <h3 className="section-title">Create New Package</h3>
                        <form onSubmit={handleCreatePackage} className="admin-form-container">
                            <div className="form-column">
                                <h4>Basic Details</h4>
                                <div className="admin-form-group">
                                    <label>Package Name</label>
                                    <input placeholder="Ex: Maldives Blast" value={newPackage.name} onChange={e => setNewPackage({ ...newPackage, name: e.target.value })} required />
                                </div>
                                <div className="admin-form-group">
                                    <label>Location</label>
                                    <input placeholder="Ex: Maldives" value={newPackage.location} onChange={e => setNewPackage({ ...newPackage, location: e.target.value })} required />
                                </div>
                                <div className="admin-form-group">
                                    <label>Duration</label>
                                    <input placeholder="Ex: 5 Days / 4 Nights" value={newPackage.duration} onChange={e => setNewPackage({ ...newPackage, duration: e.target.value })} required />
                                </div>
                                <div className="admin-form-group">
                                    <label>Base Price (₹)</label>
                                    <input type="number" value={newPackage.price} onChange={e => setNewPackage({ ...newPackage, price: e.target.value })} required />
                                </div>
                                <div className="admin-form-group">
                                    <label>Image URL</label>
                                    <input placeholder="https://..." value={newPackage.imageUrl || ''} onChange={e => setNewPackage({ ...newPackage, imageUrl: e.target.value })} />
                                </div>
                                <div className="admin-form-group">
                                    <label>Description</label>
                                    <textarea rows="4" placeholder="Detailed description..." value={newPackage.description} onChange={e => setNewPackage({ ...newPackage, description: e.target.value })} required />
                                </div>

                                <div className="summary-box">
                                    <h4>Package Summary</h4>
                                    <p><strong>Total Estimated Price:</strong> ₹{calculatedPrice}</p>
                                    <p><strong>Total Carbon Footprint:</strong> {calculatedCarbon} kg CO2e</p>
                                </div>
                                <button type="submit" className="btn-primary">Create Package</button>
                            </div>

                            <div className="form-column">
                                <h4>Select Resources</h4>

                                <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>Hotels</label>
                                <input
                                    className="search-input"
                                    type="text"
                                    placeholder="Search hotels..."
                                    value={hotelSearch}
                                    onChange={(e) => setHotelSearch(e.target.value)}
                                />
                                <div className="selection-list-container">
                                    {filteredHotels.map(h => (
                                        <div key={h.id} className="selection-item" onClick={() => toggleHotelSelection(h.id)}>
                                            <input type="checkbox" checked={selectedHotels.includes(h.id)} onChange={() => { }} />
                                            <div className="selection-info">
                                                <strong>{h.name}</strong>
                                                <span>{h.location} • ₹{h.price} • {h.carbonFootprint}kg CO2</span>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredHotels.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '1rem' }}>No hotels found</p>}
                                </div>

                                <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>Flights</label>
                                <input
                                    className="search-input"
                                    type="text"
                                    placeholder="Search flights..."
                                    value={flightSearch}
                                    onChange={(e) => setFlightSearch(e.target.value)}
                                />
                                <div className="selection-list-container">
                                    {filteredFlights.map(f => (
                                        <div key={f.id} className="selection-item" onClick={() => toggleFlightSelection(f.id)}>
                                            <input type="checkbox" checked={selectedFlights.includes(f.id)} onChange={() => { }} />
                                            <div className="selection-info">
                                                <strong>{f.airline}</strong>
                                                <span>{f.source} ➝ {f.destination} • ₹{f.price} • {f.carbonFootprint}kg CO2</span>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredFlights.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '1rem' }}>No flights found</p>}
                                </div>

                                <h4 style={{ marginTop: '1rem' }}>Itinerary</h4>
                                <div style={{ marginBottom: '1rem' }}>
                                    {newItinerary.map((item, index) => (
                                        <div key={index} className="admin-form-group" style={{ flexDirection: 'row', marginBottom: '0.5rem' }}>
                                            <input placeholder="Day" type="number" value={item.dayNumber} onChange={e => updateItinerary(index, 'dayNumber', e.target.value)} style={{ width: '80px' }} />
                                            <input placeholder="Activity Description" value={item.description} onChange={e => updateItinerary(index, 'description', e.target.value)} style={{ flex: 1 }} />
                                            <button type="button" onClick={() => removeItineraryDay(index)} className="btn-danger" style={{ padding: '0.5rem 0.75rem' }}>✕</button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addItineraryDay} className="tab-btn" style={{ border: '1px dashed #cbd5e1', width: '100%', marginTop: '0.5rem' }}>+ Add Day</button>
                                </div>
                            </div>
                        </form>

                        <h3 className="section-title">Existing Packages</h3>
                        <div className="admin-grid">
                            {packages.map(pkg => (
                                <div key={pkg.id} className="admin-card">
                                    {pkg.imageUrl && <img src={pkg.imageUrl} alt={pkg.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }} />}
                                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{pkg.name}</h4>
                                    <p style={{ color: '#64748b', margin: '0 0 0.5rem 0' }}>Price: <strong>₹{pkg.price}</strong></p>
                                    <p style={{ color: '#64748b', margin: '0 0 1rem 0' }}>Carbon: {pkg.totalCarbonFootprint} kg</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Link to={`/packages/${pkg.id}`} style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>Edit Details</Link>
                                        <button onClick={() => handleDeletePackage(pkg.id)} className="btn-danger">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <div className="booking-list">
                        <h3 className="section-title">All Bookings</h3>
                        <div className="admin-grid">
                            {bookings.map(booking => (
                                <div key={booking.id} className="admin-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <h4 style={{ margin: 0 }}>#{booking.id}</h4>
                                        <span className={`status-badge ${booking.status === 'CONFIRMED' ? 'status-confirmed' : booking.status === 'CANCELLED' ? 'status-cancelled' : 'status-pending'}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0.25rem 0' }}><strong>User:</strong> {booking.user?.name}</p>
                                    <p style={{ margin: '0.25rem 0' }}><strong>Email:</strong> {booking.user?.email}</p>
                                    <p style={{ margin: '0.25rem 0 1rem 0' }}><strong>Package:</strong> {booking.travelPackage?.name}</p>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {booking.status !== 'CONFIRMED' && <button onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')} className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Confirm</button>}
                                        {booking.status !== 'CANCELLED' && <button onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')} className="btn-danger" style={{ fontSize: '0.8rem' }}>Cancel</button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'inventory' && (
                    <div className="admin-form-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                        <div>
                            <h3 className="section-title">Add Hotel</h3>
                            <form onSubmit={handleCreateHotel} className="form-column">
                                <div className="admin-form-group"><input placeholder="Name" value={newHotel.name} onChange={e => setNewHotel({ ...newHotel, name: e.target.value })} required /></div>
                                <div className="admin-form-group"><input placeholder="Location" value={newHotel.location} onChange={e => setNewHotel({ ...newHotel, location: e.target.value })} required /></div>
                                <div className="admin-form-group"><input placeholder="Price/Night" type="number" value={newHotel.price} onChange={e => setNewHotel({ ...newHotel, price: e.target.value })} required /></div>
                                <div className="admin-form-group"><input placeholder="Rating" type="number" step="0.1" value={newHotel.rating} onChange={e => setNewHotel({ ...newHotel, rating: e.target.value })} /></div>
                                <div className="admin-form-group"><input placeholder="CO2 (kg)" type="number" value={newHotel.carbonFootprint} onChange={e => setNewHotel({ ...newHotel, carbonFootprint: e.target.value })} required /></div>
                                <button type="submit" className="btn-primary">Add Hotel</button>
                            </form>

                            <h4 style={{ marginTop: '2rem' }}>Available Hotels</h4>
                            <div className="selection-list-container">
                                {Array.isArray(hotels) && hotels.map(h => (
                                    <div key={h.id} className="selection-item">
                                        <div className="selection-info">
                                            <strong>{h.name}</strong>
                                            <span>{h.location}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="section-title">Add Flight</h3>
                            <form onSubmit={handleCreateFlight} className="form-column">
                                <div className="admin-form-group"><input placeholder="Airline" value={newFlight.airline} onChange={e => setNewFlight({ ...newFlight, airline: e.target.value })} required /></div>
                                <div className="admin-form-group"><input placeholder="Source" value={newFlight.source} onChange={e => setNewFlight({ ...newFlight, source: e.target.value })} required /></div>
                                <div className="admin-form-group"><input placeholder="Destination" value={newFlight.destination} onChange={e => setNewFlight({ ...newFlight, destination: e.target.value })} required /></div>
                                <div className="admin-form-group"><input placeholder="Price" type="number" value={newFlight.price} onChange={e => setNewFlight({ ...newFlight, price: e.target.value })} required /></div>
                                <div className="admin-form-group"><input placeholder="CO2 (kg)" type="number" value={newFlight.carbonFootprint} onChange={e => setNewFlight({ ...newFlight, carbonFootprint: e.target.value })} required /></div>
                                <button type="submit" className="btn-primary">Add Flight</button>
                            </form>

                            <h4 style={{ marginTop: '2rem' }}>Available Flights</h4>
                            <div className="selection-list-container">
                                {Array.isArray(flights) && flights.map(f => (
                                    <div key={f.id} className="selection-item">
                                        <div className="selection-info">
                                            <strong>{f.airline}</strong>
                                            <span>{f.source} ➝ {f.destination}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

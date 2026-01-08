import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackages } from './packageSlice';
import { Link } from 'react-router-dom';
import DestinationGrid from './DestinationGrid';
import './PackageList.css';

const PackageList = () => {
    const dispatch = useDispatch();
    const { packages, loading, error } = useSelector((state) => state.packages);
    const [selectedDestination, setSelectedDestination] = useState(null);

    useEffect(() => {
        dispatch(fetchPackages());
    }, [dispatch]);

    if (loading) return <div>Loading packages...</div>;
    if (error) return <div className="error">{error}</div>;

    const filteredPackages = selectedDestination
        ? packages.filter(pkg => pkg.location === selectedDestination)
        : packages;

    if (!selectedDestination) {
        return <DestinationGrid packages={packages} onSelectDestination={setSelectedDestination} />;
    }

    return (
        <div className="package-container">
            <div className="package-header">
                <h2>{selectedDestination} Packages</h2>
                <p>Explore our curated selection of experiences in {selectedDestination}</p>
            </div>

            <button onClick={() => setSelectedDestination(null)} className="back-btn" style={{ marginBottom: '2rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                Back to Destinations
            </button>

            <div className="packages-grid">
                {filteredPackages.map((pkg) => (
                    <div key={pkg.id} className="user-package-card">
                        <div className="card-image-wrapper">
                            {pkg.imageUrl ? (
                                <img src={pkg.imageUrl} alt={pkg.name} className="card-image" />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>No Image</div>
                            )}
                            <div className="price-tag">₹{pkg.price}</div>
                        </div>

                        <div className="card-content">
                            <h3>{pkg.name}</h3>
                            <div className="location-text">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                {pkg.location}
                            </div>

                            <div className="card-meta">
                                <span>⏱ {pkg.duration}</span>
                                <span>🌱 {pkg.totalCarbonFootprint} kg CO2</span>
                            </div>

                            <Link to={`/packages/${pkg.id}`} className="view-btn">View Itinerary</Link>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPackages.length === 0 && (
                <div className="status-msg">
                    <p>No packages found for this destination yet.</p>
                </div>
            )}
        </div>
    );

};

export default PackageList;

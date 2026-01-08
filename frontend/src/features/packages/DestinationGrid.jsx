import React, { useState } from 'react';
import './PackageList.css'; // Reusing PackageList styles since we merged them

const DestinationGrid = ({ packages, onSelectDestination }) => {
    // Generic logic for initial image from packages
    const destinations = packages.reduce((acc, pkg) => {
        const loc = pkg.location;
        if (!acc[loc]) {
            // Check for specific override for Canada or other locations if needed
            let displayImage = pkg.imageUrl;
            if (loc === 'Canada') {
                displayImage = '/images/canada_destination.png';
            }

            acc[loc] = {
                name: loc,
                count: 0,
                image: displayImage
            };
        }
        acc[loc].count++;
        return acc;
    }, {});

    const destinationList = Object.values(destinations);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredDestinations = destinationList.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="package-container">
            {/* Hero Section */}
            <div className="package-hero">
                <div className="hero-content">
                    <h1>Explore the World</h1>
                    <p>Discover handpicked adventures, luxury stays, and unforgettable experiences tailored just for you.</p>

                    <div className="search-bar">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Where do you want to go?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-btn">Search</button>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="stats-container">
                <div className="stat-item">
                    <span className="stat-number">100+</span>
                    <span className="stat-label">Destinations</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">24/7</span>
                    <span className="stat-label">Support</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">15k+</span>
                    <span className="stat-label">Happy Travelers</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">4.9</span>
                    <span className="stat-label">Rating</span>
                </div>
            </div>

            {/* Destination Grid */}
            <div className="destination-grid-container">
                <h2>Popular Destinations</h2>
                <div className="destination-grid">
                    {filteredDestinations.map((dest) => (
                        <div key={dest.name} className="destination-card" onClick={() => onSelectDestination(dest.name)}>
                            <div className="destination-image" style={{ backgroundImage: `url(${dest.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'})` }}>
                                <div className="destination-overlay">
                                    <h3>{dest.name} Packages</h3>
                                    <span className="tour-count">{dest.count} Tours Available</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {filteredDestinations.length === 0 && (
                    <div className="status-msg">
                        <p>No destinations found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );

};

export default DestinationGrid;

import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-hero">
            <div className="hero-background"></div>
            <div className="hero-overlay"></div>

            <div className="hero-content">
                <h1 className="hero-title animate-fade-up">
                    Discover Your Next Adventure
                </h1>
                <p className="hero-subtitle animate-fade-up animate-delay-1">
                    Experience the world's most breathtaking destinations with our premium curated travel packages.
                </p>
                <div className="cta-group animate-fade-up animate-delay-2">
                    <Link to="/register" className="btn-hero-primary">
                        Get Started
                    </Link>
                    <Link to="/login" className="btn-hero-secondary">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

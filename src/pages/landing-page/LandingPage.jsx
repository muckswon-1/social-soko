import React from 'react';
import { Link } from 'react-router';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <nav className="landing-nav">
          <div className="logo">Social Soko</div>
          <div className="nav-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <span className="hero-eyebrow">Verified B2B networking</span>
          <h1>Connect, Collaborate, Grow</h1>
          <p>Build meaningful relationships with verified professionals. Discover trusted businesses, share expertise, and turn conversations into opportunities.</p>

          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-secondary">I already have an account</Link>
          </div>

          <div className="trust-strip">
            <div className="trust-item">🔐 Secure & verified businesses</div>
            <div className="trust-item">⭐ Reviews & transparent profiles</div>
            <div className="trust-item">📈 Built for growth & leads</div>
          </div>
        </section>

        <div className="features-wrap">
          <section className="features-section">
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Verified Professionals</h3>
              <p>Every business is verified to keep the network professional and trustworthy.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Networking</h3>
              <p>Modern security, role-based access, and private messaging with reporting tools.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Grow Your Business</h3>
              <p>Join industry groups, get reviews, and turn interest into qualified leads.</p>
            </div>
          </section>
        </div>
      </main>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} Social Soko. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

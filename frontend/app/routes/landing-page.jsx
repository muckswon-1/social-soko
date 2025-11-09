import { Link } from "react-router";
import styles from "../styles/landing-page.css?url";

export function meta() {
    return [{title: "Social Soko | Home"}]
}

export function links() {
    return [{rel: "stylesheet", href: styles}]
}


export default function LandingPage() {
  return (
    <div className="page page-landing">
      <main className="main-content page-landing-main">
        {/* Hero */}
        <section className="card hero-landing">
          <div className="hero-content">
            <span className="hero-eyebrow">Verified B2B Networking</span>
            <h1 className="hero-title">Connect, Collaborate, Grow</h1>
            <p className="hero-text">
              Meet verified businesses, join trusted circles, and turn every
              conversation into a real opportunity. Social Soko helps you build
              a network that's built to transact.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                I already have an account
              </Link>
            </div>

            <div className="trust-row">
              <div className="trust-pill">🔐 Secure &amp; verified businesses</div>
              <div className="trust-pill">⭐ Transparent profiles &amp; reviews</div>
              <div className="trust-pill">
                📈 Built to generate leads &amp; deals
              </div>
            </div>
          </div>

          <aside className="hero-aside">
            <div>
              <h3 className="hero-aside-title">Why Social Soko?</h3>
              <p className="hero-aside-text">
                Curated, verified B2B members only. No noise. No random spam.
                Just serious buyers, sellers, and partners.
              </p>
            </div>
            <div>
              <h3 className="hero-aside-title">What you can do:</h3>
              <p className="hero-aside-text">
                Showcase your company, join industry channels, request quotes,
                share offers, and track reputation in one place.
              </p>
            </div>
          </aside>
        </section>

        {/* Features */}
        <section className="section features-section">
          <div className="features-grid">
            <article className="card feature-card">
              <div className="feature-icon">✓</div>
              <h3 className="feature-title">Verified Professionals</h3>
              <p className="feature-text">
                Every company is vetted to keep your conversations relevant,
                professional, and high intent.
              </p>
            </article>

            <article className="card feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure Networking</h3>
              <p className="feature-text">
                Role-based access, private messaging, and reporting controls to
                maintain a safe environment.
              </p>
            </article>

            <article className="card feature-card">
              <div className="feature-icon">🚀</div>
              <h3 className="feature-title">Grow Your Business</h3>
              <p className="feature-text">
                Join niche groups, publish offers, collect reviews, and turn
                your visibility into measurable leads.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>
          &copy; {new Date().getFullYear()} Social Soko. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

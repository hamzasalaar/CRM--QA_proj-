import React from "react";
import { Link } from "react-router-dom";
import crmImage from "../assets/images/crm.jpg"; // Import the image

export default function PublicHome() {
  return (
    <main className="public-home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1>Manage Customers, Sales & Growth — All in One CRM</h1>
            <p>Streamline your operations, improve collaboration, and scale faster with CRMPro.</p>
            <Link to="/register" className="cta-btn">Get Started Free</Link>
          </div>
          <div className="hero-image">
            <img src={crmImage} alt="CRM Dashboard Illustration" /> {/* Use imported image */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">What You Get</h2>
          <div className="feature-grid">
            <div className="feature-box">
              <h4>👥 Customer Management</h4>
              <p>Keep track of customer details, activity history, and interactions in one place.</p>
            </div>
            <div className="feature-box">
              <h4>⚙️ Task Automation</h4>
              <p>Automate daily repetitive tasks so your team can focus on closing deals.</p>
            </div>
            <div className="feature-box">
              <h4>🤝 Team Collaboration</h4>
              <p>Collaborate with teammates through shared notes, tasks, and notifications.</p>
            </div>
            <div className="feature-box">
              <h4>📊 Analytics & Reports</h4>
              <p>View detailed analytics to make data-driven business decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Start Your Free CRM Trial Today</h2>
          <p>Join thousands of growing businesses using CRMPro to stay organized and close more deals.</p>
          <Link to="/register" className="cta-btn">Start Free Trial</Link>
        </div>
      </section>

      <style>{`
        .public-home {
          font-family: 'Segoe UI', sans-serif;
          color: #212529;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        /* HERO */
        .hero {
          background: #f4f9fb;
          padding: 4rem 2rem;
        }

        .hero-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .hero-text {
          flex: 1;
          min-width: 280px;
        }

        .hero-text h1 {
          font-size: 2.7rem;
          margin-bottom: 1rem;
          color: #008080;
        }

        .hero-text p {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          color: #555;
        }

        .hero-image {
          flex: 1;
          text-align: center;
        }

        .hero-image img {
          max-width: 100%;
          height: auto;
        }

        /* CTA BUTTON */
        .cta-btn {
          background-color: #008080;
          color: white;
          padding: 0.8rem 1.6rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.3s ease;
        }

        .cta-btn:hover {
          background-color: #006666;
        }

        /* FEATURES */
        .features {
          background: #ffffff;
          padding: 4rem 2rem;
        }

        .section-title {
          font-size: 2rem;
          margin-bottom: 2rem;
          text-align: center;
          color: #008080;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-box {
          background-color: #f1f4f9;
          padding: 1.8rem;
          border-radius: 8px;
          box-shadow: 0 1px 5px rgba(0,0,0,0.05);
          text-align: left;
        }

        .feature-box h4 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .feature-box p {
          color: #555;
          font-size: 0.95rem;
        }

        /* CTA SECTION */
        .cta-section {
          background: #008080;
          color: white;
          text-align: center;
          padding: 3.5rem 2rem;
        }

        .cta-section h2 {
          font-size: 2rem;
          margin-bottom: 0.8rem;
        }

        .cta-section p {
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 768px) {
          .hero-text h1 {
            font-size: 2rem;
          }

          .cta-section h2 {
            font-size: 1.6rem;
          }

          .hero-content {
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
          }

          .hero-image {
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
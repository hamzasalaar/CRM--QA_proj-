// filepath: src/components/PublicHeader.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function PublicHeader() {
  return (
    <header className="public-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          CRM<span className="logo-highlight">Pro</span>
        </Link>

        {/* Navigation */}
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="#" className="nav-link">Features</Link>
          <Link to="#" className="nav-link">Pricing</Link>
          <Link to="#" className="nav-link">About</Link>
          <Link to="#" className="nav-link">Contact</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="auth-links">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/register" className="signup-btn">Get Started</Link>
        </div>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .public-header {
          width: 100%;
          background-color: #fff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 30px;
          max-width: 1200px;
          margin: 0 auto;
          flex-wrap: wrap;
        }

        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #008080;
          text-decoration: none;
        }

        .logo-highlight {
          color: #008080;
          font-weight: bold;
        }

        .nav-links {
          display: flex;
          gap: 20px;
        }

        .nav-link {
          text-decoration: none;
          font-size: 16px;
          color: #333;
          padding: 5px 10px;
          transition: color 0.3s ease-in-out;
        }

        .nav-link:hover {
          color: #008080;
        }

        .auth-links {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .login-btn {
          text-decoration: none;
          font-size: 14px;
          color: Black;
        }

        .signup-btn {
         
          color: Black;
          text-decoration: none;
          font-size: 14px;
          padding: 8px 15px;
          border-radius: 5px;
          font-weight: bold;
          transition: background-color 0.3s ease;
        }

        .signup-btn:hover {
          background-color: #006666;
        }

        @media (max-width: 768px) {
          .nav-links,
          .auth-links {
            display: none;
          }

          .header-container {
            justify-content: space-between;
          }
        }
      `}</style>
    </header>
  );
}

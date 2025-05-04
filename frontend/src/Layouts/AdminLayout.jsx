import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import LogoutButton from "../pages/Logout";

export default function AdminLayout() {
  const user = useSelector((state) => state.Auth.user); // Get user data from Redux store
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("You must be an admin to access this page.");
      navigate("/login"); // You can also navigate to a general page if not an admin
      return null;
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") {
    // Optional: Render a loading state or nothing until the user is verified
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container">
        <header className="bg-dark text-white p-3">
          <h1>Admin Dashboard</h1>
          <nav>
            <ul className="nav">
                <Link to="/admin" className="btn btn-light m-2">
                  Dashboard
                </Link>
              <li>
                <Link to="/admin/users" className="btn btn-light m-2">
                  Manage Users
                </Link>
              </li>
              <li>
                <Link to="/admin/reports" className="btn btn-light m-2">
                  View Reports
                </Link>
              </li>
            </ul>
          </nav>
          <LogoutButton className="btn btn-outline-danger w-100 mt-4" label="Logout" /> {/* Logout button or component */}
        </header>
        <main className="p-4">
          <Outlet /> {/* This is where nested routes/components will render */}
        </main>
      </div>
    </>
  );
}

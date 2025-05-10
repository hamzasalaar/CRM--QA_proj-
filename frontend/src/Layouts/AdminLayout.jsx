// src/layout/AdminLayout.jsx
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import AdminHeader from "../components/AdminHeader"; // Adjust the path as needed

export default function AdminLayout() {
  const user = useSelector((state) => state.Auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("You must be an admin to access this page.");
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AdminHeader />
      <div className="container">
      
      <main className="p-4">
        <Outlet />
      </main>
    </div>

    </div>
    
  );
}

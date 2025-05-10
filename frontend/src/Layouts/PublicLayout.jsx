import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";

export default function PublicLayouts() {
  const user = useSelector((state) => state.Auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin"); // Redirect admin to the admin-specific area
      } else if (user.role === "manager") {
        navigate("/manager"); // Redirect manager to the manager-specific area
      } else if (user.role === "user") {
        navigate("/user"); // Redirect regular user to the user-specific area
      } else {
        navigate("/login"); // Redirect to login if role is not recognized
      }
    }
  }, [user, navigate]);
  return (
    <>
        <PublicHeader /> {/* Add the Header for public routes */}
        <main>
            <Outlet /> 
        </main>
        
    </>
);
}

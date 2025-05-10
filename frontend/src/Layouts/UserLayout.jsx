import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserHeader from "../components/UserHeader";

export default function UserLayout() {
  const user = useSelector((state) => state.Auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <>
      <UserHeader />
      <main className="p-4" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Outlet />
      </main>
    </>
  );
}

import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ManagerHeader from "../components/ManagerHeader";

export default function ManagerLayout() {
  const user = useSelector((state) => state.Auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user?.user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <>
      <ManagerHeader />
      <main className="p-4" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Outlet />
      </main>
    </>
  );
}

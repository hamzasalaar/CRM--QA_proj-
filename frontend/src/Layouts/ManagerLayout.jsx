import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Logout as logoutAction } from "../redux/AuthSlice";
import axios from "axios";
import toast from "react-hot-toast";

export default function ManagerLayout() {
  const user = useSelector((state) => state.Auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        dispatch(logoutAction());
        toast.success("Logout successful");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="manager-layout">
      <nav className="p-3 bg-light d-flex justify-content-between align-items-center border-bottom">
        <div>
          <Link className="me-3" to="/manager">
            Dashboard
          </Link>
          <Link className="me-3" to="/manager/team">
            Team Management
          </Link>
          <Link className="me-3" to="/manager/tasks">
            Task Management
          </Link>
          <Link className="me-3" to="/manager/requests">
            Pending Requests
          </Link>
          <Link className="me-3" to="/manager/leads">
            Manage Leads
          </Link>
          <Link className="me-3" to="/manager/deals">
            Manage Deals
          </Link>
        </div>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
}

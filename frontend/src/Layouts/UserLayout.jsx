import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Logout as logoutAction } from "../redux/AuthSlice";
import axios from "axios";

export default function UserLayout() {
  const user = useSelector((state) => state.Auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

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

  const handleSendRequest = async () => {
    try {
      const managerEmail = prompt("Enter Manager's Email to send request:");

      if (!managerEmail) return;

      const response = await axios.post(
        "http://localhost:3000/api/user/send-request",
        { managerEmail },
        { withCredentials: true }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  };

  return (
    <div className="user-dashboard-layout">
      <nav className="p-3 bg-light d-flex justify-content-between align-items-center border-bottom">
        <div>
          <Link className="me-3" to="/user/dashboard">
            Dashboard
          </Link>
          <Link className="me-3" to="/user/tasks">
            My Tasks
          </Link>
          <Link className="me-3" to="/user/team">
            Team Requests
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
        <button
          className="btn btn-primary btn-sm mb-3"
          onClick={handleSendRequest}
        >
          Send Request to a Join Team
        </button>
        <Outlet />
      </div>
    </div>
  );
}

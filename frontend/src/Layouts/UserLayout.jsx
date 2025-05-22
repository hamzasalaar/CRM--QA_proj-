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

  return (
    <div className="user-dashboard-layout">
      <nav className="p-3 bg-light d-flex justify-content-between align-items-center border-bottom">
        <div>
          <Link className="me-3" to="/user">
            Dashboard
          </Link>
          <Link className="me-3" to="/user/tasks">
            My Tasks
          </Link>
          <Link className="me-3" to="/user/requests">
            My Requests
          </Link>
          <Link className="me-3" to="/user/leads">
            My Leads
          </Link>
          <Link className="me-3" to="/user/deals">
            My Deals
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

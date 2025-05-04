import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserManagement from "./pages/UserManagement";
import ManagerDashboard from "./pages/ManagerDashboard"; // Assuming this is your manager dashboard component
import TeamManagement from "./pages/TeamManagement"; // If this is a separate page
import { Toaster } from "react-hot-toast";
import AdminLayout from "./Layouts/AdminLayout";
import UserLayout from "./Layouts/UserLayout";
import PublicLayout from "./Layouts/PublicLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerLayout from "./Layouts/ManagerLayout";
import TaskManagement from "./pages/TaskManagement";
import UserDashboard from "./pages/UserDashboard"; // Assuming this is your user dashboard component
import UserTasks from "./pages/UserTasks";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <div className="app-container">
        <h1>CRM</h1>
        <Routes>
          {/* Public Routes (Login and Register pages) */}
          <Route path="/" element={<PublicLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* User Layout */}
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="tasks" element={<UserTasks />} />
          </Route>

          {/* Admin Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            {/* User Management page */}
          </Route>

          {/* Manager Routes */}
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<ManagerDashboard />} />
            <Route path="team" element={<TeamManagement />} />
            <Route path="tasks" element={<TaskManagement />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

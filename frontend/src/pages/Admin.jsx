import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Logout } from "../redux/AuthSlice";
import axios from "axios";
import "../css/Admin.css"; // Make sure this is the path to your new CSS file

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [role, setRole] = useState("user"); // Default role for normal users

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const GetUsers = async () => {
      try {
        const request = await axios.get(
          "http://localhost:3000/api/admin/getuser",
          { withCredentials: true }
        );
        const response = request.data;
        if (response.success) {
          setUsers(response.data);
        } else {
          setError("Failed to fetch users.");
        }
      } catch (error) {
        console.error(error);
        setError("An error occurred while fetching users.");
      } finally {
        setLoading(false);
      }
    };

    GetUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const request = await axios.post(
        `http://localhost:3000/api/admin/deleteuser/${id}`,
        {},
        { withCredentials: true }
      );
      const response = request.data;
      if (request.status === 200) {
        toast.success(response.message);
        setUsers(users.filter((user) => user._id !== id)); // Update the list by removing the deleted user
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const AddUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        { name, email, password, role }
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        if (response.data.success) {
          toast.success("New user added!");
          setUsers([...users, response.data.user]);
          setName("");
          setEmail("");
          setPassword("");
          // setRole("user"); // Reset role to default after user creation
          setShowForm(false);
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.error ||
          "Couldn't add new user. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      const request = await axios.post("http://localhost:3000/api/auth/logout");
      if (request.status === 200) {
        dispatch(Logout());
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="admin-container">
      <h2 className="admin-heading">Admin Dashboard</h2>
      <h3 className="user-list-title">User List</h3>

      <div className="header-actions">
        <button onClick={toggleForm} className="add-user-btn">
          ➕ Add New User
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-container">
            <h3>Add New User</h3>
            <form onSubmit={AddUser}>
              <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                pattern="^[^\s].*[^\s]$"
                title="Username cannot have leading or trailing spaces, and it must not be empty."
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                title="Password must be at least 8 characters long and contain both letters and numbers."
                maxLength="16"
              />
              {/* Only show the role select field if the user is an admin */}
              {/* <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={role === "user"} // Disable role selection for non-admin users
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select> */}
              <div className="form-buttons">
                <button className="create-user-btn" type="submit">
                  Create User
                </button>
                <button
                  className="cancel-btn"
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-users">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td
                    className={`user-role ${
                      user.role === "admin" ? "admin-role" : "user-role"
                    }`}
                  >
                    {user.role}
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <br />
        <button className="register-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

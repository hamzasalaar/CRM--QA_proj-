import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Logout } from "../redux/AuthSlice";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Admin.css";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("user");

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const GetUsers = async () => {
      try {
        const request = await axios.get(
          "http://localhost:3000/api/admin/getuser",
          {
            withCredentials: true,
          }
        );
        const response = request.data;
        if (response.success) {
          setUsers(response.data);
        } else {
          setError("Failed to fetch users.");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Unauthorized access!");
          navigate("/");
        } else {
          setError("An error occurred while fetching users.");
        }
      } finally {
        setLoading(false);
      }
    };

    GetUsers();
  }, [navigate]);

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const request = await axios.post(
        `http://localhost:3000/api/admin/deleteuser/${userToDelete}`,
        {},
        { withCredentials: true }
      );
      const response = request.data;
      if (request.status === 200) {
        toast.success(response.message);
        setUsers(users.filter((user) => user._id !== userToDelete));
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      setShowConfirmDelete(false);
      setUserToDelete(null);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  const handleUpdate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!editName.trim() || !editEmail.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    if (!emailRegex.test(editEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/admin/update/${editingUser}`,
        { name: editName, email: editEmail, role: editRole },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("User updated successfully!");
        setUsers(
          users.map((user) =>
            user._id === editingUser
              ? { ...user, name: editName, email: editEmail, role: editRole }
              : user
          )
        );
        setEditingUser(null);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h3 className="subheading">User List</h3>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>
                    {editingUser === user._id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="form-control form-control-sm"
                        required
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td>
                    {editingUser === user._id ? (
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="form-control form-control-sm"
                        required
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td>
                    {editingUser === user._id ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="form-select form-select-sm"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td>
                    {editingUser === user._id ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={handleUpdate}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingUser(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      user.role !== "admin" && (
                        <>
                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteClick(user._id)}
                          >
                            Delete
                          </button>
                        </>
                      )
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmDelete(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this user?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const UserDashboard = () => {
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [managerEmail, setManagerEmail] = useState("");
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const [managers, setManagers] = useState([]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/managers", {
          withCredentials: true,
        });
        setManagers(res.data.managers);
      } catch (err) {
        console.error("Failed to load managers");
      }
    };

    fetchManagers();
  }, []);

  useEffect(() => {
    const fetchManagerDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/manager-details",
          { withCredentials: true }
        );
        setManager(response.data.manager);
      } catch (err) {
        console.error(err);
        setManager(null); // Set manager as null if not assigned
      } finally {
        setLoading(false);
      }
    };

    fetchManagerDetails();
  }, []);

  const handleSendRequest = async (email) => {
    if (!email) return toast.error("Invalid manager email");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/send-request",
        { managerEmail: email },
        { withCredentials: true }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  };

  if (loading) return <div>Loading manager details...</div>;
  if (error) return <div className="text-danger">Error: {error}</div>;

  return (
    <div className="user-dashboard container my-4">
      <h2 className="text-center">User Dashboard</h2>

      <div className="manager-list mt-4">
        <h4>Available Managers</h4>
        {Array.isArray(managers) && managers.length === 0 ? (
          <p>No managers found.</p>
        ) : (
          <ul className="list-group">
            {managers.map((mgr) => (
              <li
                key={mgr._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  {mgr.name} ({mgr.email})
                </span>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleSendRequest(mgr.email)}
                >
                  Send Request
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {manager ? (
        <div className="manager-details mt-4">
          <h4>Manager Details</h4>
          <p>
            <strong>Name:</strong> {manager.name}
          </p>
          <p>
            <strong>Email:</strong> {manager.email}
          </p>
        </div>
      ) : (
        <p className="text-muted">No manager assigned.</p>
      )}

      {showLeaveModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Leave</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLeaveModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to leave your team? This action cannot
                  be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowLeaveModal(false)}
                  disabled={leaving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={async () => {
                    setLeaving(true);
                    try {
                      const res = await axios.post(
                        "http://localhost:3000/api/user/leave-team",
                        {},
                        {
                          withCredentials: true,
                        }
                      );
                      toast.success(res.data.message);
                      setManager(null);
                      setShowLeaveModal(false);
                    } catch (err) {
                      toast.error(
                        err.response?.data?.message || "Failed to leave team"
                      );
                    } finally {
                      setLeaving(false);
                    }
                  }}
                >
                  {leaving ? "Leaving..." : "Leave Team"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {manager && (
        <div className="mt-3">
          <button
            className="btn btn-danger btn-sm"
            onClick={async () => {
              try {
                const res = await axios.post(
                  "http://localhost:3000/api/user/leave-team",
                  {},
                  {
                    withCredentials: true,
                  }
                );
                toast.success(res.data.message);
                setManager(null); // instantly reflect change in UI
              } catch (err) {
                toast.error(
                  err.response?.data?.message || "Failed to leave team"
                );
              }
            }}
          >
            Leave Team
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

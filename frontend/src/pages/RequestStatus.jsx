import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const RequestStatus = () => {
  const [status, setStatus] = useState(null);
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false); // trigger re-fetch after cancel

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/user/my-requests",
          { withCredentials: true }
        );
        setStatus(res.data.status);
        setManager(res.data.manager);
      } catch (err) {
        console.error("Failed to fetch request status", err);
        toast.error("Failed to load request status");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [refresh]); // re-run when refresh toggles

  const getStatusBadge = () => {
    switch (status) {
      case "pending":
        return <span className="badge bg-warning text-dark">Pending</span>;
      case "accepted":
        return <span className="badge bg-success">Accepted</span>;
      case "rejected":
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return <span className="badge bg-secondary">Not Sent</span>;
    }
  };

  const handleCancelRequest = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel your pending request?"
    );
    if (!confirmCancel) return;

    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/cancel-request",
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setRefresh(!refresh); // trigger re-fetch
    } catch (err) {
      console.error("Failed to cancel request", err);
      toast.error(err.response?.data?.message || "Failed to cancel request");
    }
  };

  if (loading) return <div className="p-4">Loading request status...</div>;

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Team Join Request Status</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title d-flex justify-content-between align-items-center">
            Request Information
            {getStatusBadge()}
          </h5>
          <hr />
          {status === "none" && <p>You haven't sent any request yet.</p>}

          {status !== "none" && (
            <>
              {status === "accepted" && manager ? (
                <div>
                  <p className="mb-1">
                    <strong>Manager Name:</strong> {manager.name}
                  </p>
                  <p className="mb-1">
                    <strong>Manager Email:</strong> {manager.email}
                  </p>
                  <p className="text-success mt-3">
                    You’ve been successfully added to the team!
                  </p>
                </div>
              ) : (
                <>
                  {status === "pending" && (
                    <>
                      <p>Your request is still under review.</p>
                      <button
                        className="btn btn-outline-danger btn-sm mt-2"
                        onClick={handleCancelRequest}
                      >
                        Cancel Request
                      </button>
                    </>
                  )}
                  {status === "rejected" && (
                    <p className="text-danger">
                      Your request was rejected by the manager.
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestStatus;

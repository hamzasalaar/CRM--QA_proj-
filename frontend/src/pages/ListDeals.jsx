import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ListDeals = () => {
  const [deals, setDeals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const dealsPerPage = 5;

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/manager/my-team",
          {
            withCredentials: true,
          }
        );
        setTeamMembers(res.data.teamMembers || []);
      } catch (err) {
        toast.error("Failed to load team members");
      }
    };
    fetchTeam();
  }, []);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/manager/deals", {
          withCredentials: true,
        });
        setDeals(res.data.deals || []);
      } catch (err) {
        toast.error("Failed to fetch deals");
      }
    };
    fetchDeals();
  }, []);

  const startEdit = (deal) => {
    setEditingId(deal._id);
    setEditData({
      ...deal,
      assignedTo: deal.assignedTo?._id || "",
    });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/manager/deals/${editingId}`,
        editData,
        { withCredentials: true }
      );
      toast.success("Deal updated");
      setEditingId(null);
      const updated = await axios.get(
        "http://localhost:3000/api/manager/deals",
        {
          withCredentials: true,
        }
      );
      setDeals(updated.data.deals || []);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this deal?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:3000/api/manager/deals/${id}`, {
        withCredentials: true,
      });
      toast.success("Deal deleted");
      setDeals((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.associatedLead?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || deal.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || deal.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const indexOfLast = currentPage * dealsPerPage;
  const indexOfFirst = indexOfLast - dealsPerPage;
  const currentDeals = filteredDeals.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDeals.length / dealsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterPriority]);

  return (
    <div className="card p-4 shadow-sm rounded-4">
      <h4 className="mb-4 text-primary fw-bold">All Deals</h4>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder=" Search by title or lead..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all"> All Statuses</option>
            <option>Open</option>
            <option>Won</option>
            <option>Lost</option>
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all"> All Priorities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Value</th>
              <th>Stage</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Lead</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDeals.map((deal) => (
              <tr key={deal._id}>
                <td>
                  {editingId === deal._id ? (
                    <input
                      name="title"
                      value={editData.title}
                      onChange={handleChange}
                      className="form-control"
                    />
                  ) : (
                    <strong>{deal.title}</strong>
                  )}
                </td>
                <td>
                  {editingId === deal._id ? (
                    <input
                      name="value"
                      type="number"
                      value={editData.value}
                      onChange={handleChange}
                      className="form-control"
                    />
                  ) : (
                    `$${deal.value}`
                  )}
                </td>
                <td>
                  {editingId === deal._id ? (
                    <select
                      name="stage"
                      value={editData.stage}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option>Prospect</option>
                      <option>Proposal</option>
                      <option>Negotiation</option>
                      <option>Closed</option>
                    </select>
                  ) : (
                    deal.stage
                  )}
                </td>
                <td>
                  {editingId === deal._id ? (
                    <select
                      name="status"
                      value={editData.status}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option>Open</option>
                      <option>Won</option>
                      <option>Lost</option>
                    </select>
                  ) : (
                    <span
                      className={`badge ${
                        deal.status === "Won"
                          ? "bg-success"
                          : deal.status === "Lost"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {deal.status}
                    </span>
                  )}
                </td>
                <td>
                  {editingId === deal._id ? (
                    <select
                      name="priority"
                      value={editData.priority}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  ) : (
                    <span
                      className={`badge ${
                        deal.priority === "High"
                          ? "bg-danger"
                          : deal.priority === "Medium"
                          ? "bg-warning text-dark"
                          : "bg-light text-dark"
                      }`}
                    >
                      {deal.priority}
                    </span>
                  )}
                </td>
                <td>
                  {deal.associatedLead?.name || (
                    <span className="text-muted">Lead Removed</span>
                  )}
                </td>
                <td>
                  {editingId === deal._id ? (
                    <select
                      name="assignedTo"
                      value={editData.assignedTo || ""}
                      className="form-select"
                      onChange={handleChange}
                    >
                      <option value="">-- Unassigned --</option>
                      {teamMembers.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    deal.assignedTo?.name || (
                      <span className="text-muted">Unassigned</span>
                    )
                  )}
                </td>
                <td>
                  {editingId === deal._id ? (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={handleUpdate}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => startEdit(deal)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(deal._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <ul className="pagination pagination-sm">
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ListDeals;

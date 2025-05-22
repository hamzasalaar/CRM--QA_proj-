import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [editData, setEditData] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 5;

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
        console.error("Failed to load team members", err);
      }
    };
    fetchTeam();
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/manager/all-leads",
          {
            withCredentials: true,
          }
        );
        setLeads(res.data.leads || []);
      } catch (err) {
        console.error("Failed to fetch leads", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this lead?"
    );
    if (!confirm) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/manager/delete-lead/${id}`,
        {
          withCredentials: true,
        }
      );
      setLeads((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      toast.error("Failed to delete lead");
    }
  };

  const handleEdit = (lead) => {
    setEditingLeadId(lead._id);
    setEditData({ ...lead }); // fill form with current lead values
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/manager/edit-lead/${editingLeadId}`,
        editData,
        { withCredentials: true }
      );
      toast.success("Lead updated successfully");
      setEditingLeadId(null);
      // Refresh list or update lead locally
      setLeads((prev) =>
        prev.map((lead) => (lead._id === editingLeadId ? res.data.lead : lead))
      );
    } catch (err) {
      console.error("Failed to update lead", err);
      toast.error("Update failed");
    }
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-4">Loading leads...</div>;

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || lead.status === filterStatus;

    const matchesPriority =
      filterPriority === "all" || lead.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const indexOfLast = currentPage * leadsPerPage;
  const indexOfFirst = indexOfLast - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLeads.length / leadsPerPage)
  );

  return (
    <div className="container mt-4">
      <h3>All Leads</h3>
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {leads.length === 0 ? (
        <p>No leads found.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.map((lead) => (
              <tr key={lead._id}>
                <td>
                  {editingLeadId === lead._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      className="form-control"
                      onChange={handleEditChange}
                    />
                  ) : (
                    lead.name
                  )}
                </td>
                <td>
                  {editingLeadId === lead._id ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      className="form-control"
                      onChange={handleEditChange}
                    />
                  ) : (
                    lead.email
                  )}
                </td>
                <td>
                  {editingLeadId === lead._id ? (
                    <input
                      type="text"
                      name="phone"
                      value={editData.phone}
                      className="form-control"
                      onChange={handleEditChange}
                    />
                  ) : (
                    lead.phone
                  )}
                </td>
                <td>
                  {editingLeadId === lead._id ? (
                    <select
                      name="priority"
                      value={editData.priority}
                      className="form-select"
                      onChange={handleEditChange}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  ) : (
                    <span
                      className={`badge bg-${getPriorityColor(lead.priority)}`}
                    >
                      {lead.priority}
                    </span>
                  )}
                </td>
                <td>
                  {editingLeadId === lead._id ? (
                    <select
                      name="status"
                      value={editData.status}
                      className="form-select"
                      onChange={handleEditChange}
                    >
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Qualified</option>
                      <option>Lost</option>
                    </select>
                  ) : (
                    lead.status
                  )}
                </td>
                <td>
                  {editingLeadId === lead._id ? (
                    <select
                      name="assignedTo"
                      className="form-select"
                      value={
                        editData.assignedTo?._id || editData.assignedTo || ""
                      }
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          assignedTo: e.target.value || null, // clear if blank
                        })
                      }
                    >
                      <option value="">-- Unassigned --</option>
                      {teamMembers.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    lead.assignedTo?.name || (
                      <span className="text-muted">Unassigned</span>
                    )
                  )}
                </td>

                <td>{lead.createdBy?.name}</td>
                <td>
                  {editingLeadId === lead._id ? (
                    <>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={handleUpdate}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setEditingLeadId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(lead)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(lead._id)}
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
      )}
      <div className="d-flex justify-content-center mt-3">
        <nav>
          <ul className="pagination">
            {/* Previous Button */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
              >
                Previous
              </button>
            </li>

            {/* Page Numbers */}
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

            {/* Next Button */}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

// Helper to map priority to color
const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "danger";
    case "Medium":
      return "warning";
    case "Low":
      return "secondary";
    default:
      return "light";
  }
};

export default LeadList;

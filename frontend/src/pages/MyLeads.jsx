import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../css/MyLeads.css";

const MyLeads = () => {
  const [leads, setLeads] = useState([]);
  const [editLeadId, setEditLeadId] = useState(null);
  const [editData, setEditData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/my-leads", {
          withCredentials: true,
        });
        setLeads(res.data.leads || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load leads");
      }
    };
    fetchLeads();
  }, []);

  const handleEdit = (lead) => {
    setEditLeadId(lead._id);
    setEditData({ ...lead });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/user/update-lead/${editLeadId}`,
        editData,
        { withCredentials: true }
      );
      toast.success("Lead updated");
      setEditLeadId(null);
      setLeads((prev) =>
        prev.map((l) => (l._id === editLeadId ? { ...l, ...editData } : l))
      );
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };
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
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterPriority]);

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">My Assigned Leads</h3>
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
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Lost</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentLeads.map((lead) => (
            <React.Fragment key={lead._id}>
              <tr>
                <td>{lead.name}</td>
                <td>
                  {editLeadId === lead._id ? (
                    <input
                      name="email"
                      value={editData.email}
                      onChange={handleChange}
                      className="form-control"
                    />
                  ) : (
                    lead.email
                  )}
                </td>
                <td>
                  {editLeadId === lead._id ? (
                    <input
                      name="phone"
                      value={editData.phone}
                      onChange={handleChange}
                      className="form-control"
                    />
                  ) : (
                    lead.phone
                  )}
                </td>
                <td>
                  {editLeadId === lead._id ? (
                    <select
                      name="status"
                      value={editData.status}
                      onChange={handleChange}
                      className="form-select"
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
                  {editLeadId === lead._id ? (
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
                    lead.priority
                  )}
                </td>
                <td>
                  {editLeadId === lead._id ? (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={handleUpdate}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditLeadId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(lead)}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>

              {/* Notes Section */}
              <tr>
                <td colSpan="6">
                  <details>
                    <summary>Notes</summary>
                    <ul className="mt-2">
                      {(lead.notes || []).map((note, idx) => (
                        <li key={idx}>
                          {note.content}{" "}
                          <small className="text-muted">
                            ({new Date(note.date).toLocaleString()})
                          </small>
                        </li>
                      ))}
                    </ul>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const content = e.target.note.value.trim();
                        if (!content) return;
                        try {
                          const res = await axios.post(
                            `http://localhost:3000/api/user/add-note/${lead._id}`,
                            { content },
                            { withCredentials: true }
                          );
                          toast.success("Note added");
                          setLeads((prev) =>
                            prev.map((l) =>
                              l._id === lead._id ? res.data.lead : l
                            )
                          );
                          e.target.reset();
                        } catch (err) {
                          console.log(err);
                          toast.error("Failed to add note");
                        }
                      }}
                    >
                      <div className="input-group mt-2">
                        <input
                          name="note"
                          className="form-control"
                          placeholder="Add a note..."
                        />
                        <button
                          type="submit"
                          className="btn btn-outline-secondary btn-sm"
                        >
                          Add
                        </button>
                      </div>
                    </form>
                  </details>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <ul className="pagination">
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

export default MyLeads;

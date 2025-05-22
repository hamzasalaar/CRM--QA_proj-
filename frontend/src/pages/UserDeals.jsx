import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const UserDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDealId, setEditDealId] = useState(null);
  const [editData, setEditData] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const dealsPerPage = 5;

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/my-deals", {
          withCredentials: true,
        });
        setDeals(res.data.deals);
      } catch (err) {
        toast.error("Failed to fetch deals");
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEdit = (deal) => {
    setEditDealId(deal._id);
    setEditData({
      ...deal,
      priority: deal.priority || "Medium",
      status: deal.status || "Open",
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/user/edit-deal/${editDealId}`,
        editData,
        { withCredentials: true }
      );
      setDeals((prev) =>
        prev.map((d) => (d._id === editDealId ? res.data.deal : d))
      );
      toast.success("Deal updated");
      setEditDealId(null);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch = deal.title
      .toLowerCase()
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

  if (loading) return <div className="p-4">Loading deals...</div>;

  return (
    <div className="container mt-4">
      <h4 className="mb-3">My Deals</h4>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search deals..."
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
            <option value="all">All Statuses</option>
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
            <option value="all">All Priorities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Title</th>
            <th>Value</th>
            <th>Lead</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentDeals.map((deal) => (
            <tr key={deal._id}>
              <td>{deal.title}</td>
              <td>${deal.value}</td>
              <td>
                {deal.associatedLead?.name || (
                  <span className="text-muted">Lead Removed</span>
                )}
              </td>
              <td>
                {editDealId === deal._id ? (
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
                  deal.status
                )}
              </td>
              <td>
                {editDealId === deal._id ? (
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
                  deal.priority
                )}
              </td>
              <td>
                {editDealId === deal._id ? (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={handleUpdate}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditDealId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleEdit(deal)}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default UserDeals;

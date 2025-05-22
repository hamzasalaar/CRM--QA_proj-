import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../css/LeadsPage.css";

const CreateLead = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "Other",
    priority: "Medium",
    status: "New",
    assignedTo: "",
  });
  const [showForm, setShowForm] = useState(false);

  const [teamMembers, setTeamMembers] = useState([]);

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
        console.error("Failed to load team", err);
      }
    };
    fetchTeam();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/manager/create-lead",
        formData,
        {
          withCredentials: true,
        }
      );
      toast.success("Lead created successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        source: "Other",
        priority: "Medium",
        assignedTo: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create lead");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold text-teal">Lead Management</h3>
        <button
          className="btn btn-primary btn-create-toggle"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Create New Lead"}
        </button>
      </div>

      {showForm && (
        <div className="lead-form-container">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Source</label>
                <select
                  name="source"
                  value={formData.source}
                  className="form-select"
                  onChange={handleChange}
                >
                  <option>Website</option>
                  <option>Referral</option>
                  <option>Social</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  className="form-select"
                  onChange={handleChange}
                >
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Qualified</option>
                  <option>Lost</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  className="form-select"
                  onChange={handleChange}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="col-md-6 mb-4">
                <label>Assign To</label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  className="form-select"
                  onChange={handleChange}
                >
                  <option value="">-- Unassigned --</option>
                  {teamMembers.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-end">
              <button className="btn btn-success px-4">Create Lead</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateLead;

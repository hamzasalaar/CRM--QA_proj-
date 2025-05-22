import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CreateDeal = ({ onDealCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    value: "",
    stage: "Prospect",
    status: "Open",
    priority: "Medium",
    associatedLead: "",
    assignedTo: "",
  });

  const [teamLeads, setTeamLeads] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const leadsRes = await axios.get(
          "http://localhost:3000/api/manager/all-leads",
          {
            withCredentials: true,
          }
        );
        setTeamLeads(leadsRes.data.leads || []);

        const teamRes = await axios.get(
          "http://localhost:3000/api/manager/my-team",
          {
            withCredentials: true,
          }
        );
        setTeamMembers(teamRes.data.teamMembers || []);
      } catch (err) {
        toast.error("Failed to load team or leads");
      }
    };

    fetchTeamData();
  }, []);

  useEffect(() => {
    const fetchTeamLeads = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/manager/all-leads",
          {
            withCredentials: true,
          }
        );
        setTeamLeads(res.data.leads || []);
      } catch (err) {
        toast.error("Failed to load team leads");
      }
    };

    fetchTeamLeads();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/api/manager/deals/create",
        formData,
        { withCredentials: true }
      );
      toast.success("Deal created successfully!");
      setFormData({
        title: "",
        value: "",
        stage: "Prospect",
        status: "Open",
        priority: "Medium",
        associatedLead: "",
      });

      if (onDealCreated) onDealCreated(res.data.deal);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create deal");
    }
  };

  return (
    <div className="card p-4 mb-4">
      <h5>Create New Deal</h5>
      <form onSubmit={handleSubmit}>
        <div className="row mb-2">
          <div className="col-md-6">
            <label>Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label>Value</label>
            <input
              type="number"
              name="value"
              className="form-control"
              value={formData.value}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-md-4">
            <label>Stage</label>
            <select
              name="stage"
              className="form-select"
              value={formData.stage}
              onChange={handleChange}
            >
              <option>Prospect</option>
              <option>Proposal</option>
              <option>Negotiation</option>
              <option>Closed</option>
            </select>
          </div>
          <div className="col-md-4">
            <label>Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Open</option>
              <option>Won</option>
              <option>Lost</option>
            </select>
          </div>
          <div className="col-md-4">
            <label>Priority</label>
            <select
              name="priority"
              className="form-select"
              value={formData.priority}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label>Lead</label>
          <select
            name="associatedLead"
            className="form-select"
            value={formData.associatedLead}
            onChange={handleChange}
            required
          >
            <option value="">-- Select a Lead --</option>
            {teamLeads.map((lead) => (
              <option key={lead._id} value={lead._id}>
                {lead.name} ({lead.email})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Assign To</label>
          <select
            name="assignedTo"
            className="form-select"
            value={formData.assignedTo}
            onChange={handleChange}
          >
            <option value="">-- Select Team Member --</option>
            {teamMembers.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name} ({member.email})
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          Create Deal
        </button>
      </form>
    </div>
  );
};

export default CreateDeal;

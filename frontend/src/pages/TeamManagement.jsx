import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "react-modal";

const TeamManagement = () => {
  const [team, setTeam] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchTeam = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/manager/my-team", {
        withCredentials: true,
      });
      setTeam(res.data.teamMembers);
    } catch (err) {
      toast.error("Failed to load team members");
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:3000/api/manager/add-user",
        { email: newMemberEmail },
        { withCredentials: true }
      );
      toast.success("Team member added successfully!");
      setNewMemberEmail("");
      fetchTeam();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setUserToDelete(id); // Store user ID
    setShowConfirmDelete(true); // Show confirmation modal
  };

  const handleRemove = async (userId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/manager/remove-user/${userId}`,
        { withCredentials: true }
      );
      toast.success("Member removed");
      fetchTeam();
    } catch (err) {
      toast.error("Failed to remove member");
    } finally {
      setShowConfirmDelete(false); // Close the modal after deletion
      setUserToDelete(null); // Clear the user ID
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Team Management</h2>

      <div className="input-group mb-3">
        <input
          type="email"
          className="form-control"
          placeholder="Enter user email"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
        />
        <button
          className="btn btn-primary"
          type="button"
          disabled={loading}
          onClick={handleAddMember}
        >
          {loading ? "Adding..." : "Add Member"}
        </button>
      </div>

      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {team.map((member) => (
            <tr key={member._id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteClick(member._id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={showConfirmDelete}
        onRequestClose={() => setShowConfirmDelete(false)}
        contentLabel="Confirm Delete"
        ariaHideApp={false} // prevents warnings (in a bigger app you can set this properly)
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "12px",
            padding: "20px",
            width: "400px",
            textAlign: "center",
          },
        }}
      >
        <h5>Confirm Deletion</h5>
        <p>Are you sure you want to delete this user?</p>
        <div className="d-flex justify-content-around mt-4">
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
            onClick={() => handleRemove(userToDelete)}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TeamManagement;

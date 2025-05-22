import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function UserTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/my-tasks",
          { withCredentials: true }
        );
        setTasks(response.data.tasks);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch tasks");
        toast.error(err.response?.data?.message || "Failed to fetch tasks");
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setNewStatus(task.status);
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/user/update-status/${selectedTask._id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success("Task status updated");
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === selectedTask._id ? { ...task, status: newStatus } : task
        )
      );
      setShowModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };
  const handleMarkCompleted = async (id) => {
    try {
      await axios.post(
        `http://localhost:3000/api/user/completed/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success("Task marked as completed");
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, status: "Completed" } : task
        )
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to mark as completed"
      );
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-danger">Error: {error}</div>;
  }

  return (
    <div className="user-tasks">
      <h2 className="mb-4">My Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Assigned By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task._id}>
                <td>{index + 1}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.status}</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td>
                  {task.createdBy?.name || task.createdBy?.email || "N/A"}
                </td>
                {/* Display manager details */}
                <td>
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => handleEditClick(task)}
                  >
                    Edit
                  </button>
                  {task.status !== "Completed" && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleMarkCompleted(task._id)}
                    >
                      Mark as Completed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Editing Task Status */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Task Status</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Task:</strong> {selectedTask.title}
                </p>
                <select
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

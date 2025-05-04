import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newStatus, setNewStatus] = useState(""); // Track the status of the task during editing

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/manager/manager-tasks",
        {
          withCredentials: true,
        }
      );
      setTasks(res.data.tasks);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    }
  };

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/manager/my-team", {
        withCredentials: true,
      });
      setTeamMembers(res.data.teamMembers);
    } catch (error) {
      toast.error("Failed to fetch team members");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchTeamMembers();
  }, []);

  // Create Task
  const handleCreateTask = async () => {
    if (!title || !description || !assignedTo || !dueDate) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:3000/api/manager/create-task",
        { title, description, assignedTo, dueDate },
        { withCredentials: true }
      );
      toast.success("Task created successfully!");
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setDueDate("");
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  // Mark Task Completed
  const handleMarkCompleted = async (id) => {
    try {
      await axios.post(
        `http://localhost:3000/api/manager/completed/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success("Task marked as completed");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to mark as completed");
    }
  };

  // Open Update Modal
  const openUpdateModal = (task) => {
    setEditingTask(task);
    setNewTitle(task.title);
    setNewDescription(task.description);
    setNewDueDate(task.dueDate?.slice(0, 10));
    setNewStatus(task.status); // Set the current status of the task
    setShowModal(true);
  };

  // Save Updated Task
  const handleSaveChanges = async () => {
    if (!newTitle || !newDescription || !newDueDate || !newStatus) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/manager/update-task/${editingTask._id}`,
        {
          title: newTitle,
          description: newDescription,
          dueDate: newDueDate,
          status: newStatus, // Include the updated status
        },
        { withCredentials: true }
      );
      toast.success("Task updated successfully!");
      setShowModal(false);
      fetchTasks();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  // Delete Task
  const handleDeleteTask = async (id) => {
    const confirmAction = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmAction) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/manager/delete-task/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  // Filtering and Searching
  const filteredTasks = tasks
    .filter((task) => {
      if (filterStatus === "all") return true;
      return task.status === filterStatus;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Task Management</h2>

      {/* Create Task */}
      <div className="card p-3 mb-4">
        <h5>Create New Task</h5>
        <div className="row g-2">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-control"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Select Team Member</option>
              {teamMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-primary w-100"
              onClick={handleCreateTask}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Search */}
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Filter Buttons */}
        <div className="d-flex gap-2">
          <button
            className={`btn ${
              filterStatus === "all" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setFilterStatus("all")}
          >
            All
          </button>
          <button
            className={`btn ${
              filterStatus === "pending" ? "btn-warning" : "btn-outline-warning"
            }`}
            onClick={() => setFilterStatus("pending")}
          >
            Pending
          </button>
          <button
            className={`btn ${
              filterStatus === "completed"
                ? "btn-success"
                : "btn-outline-success"
            }`}
            onClick={() => setFilterStatus("completed")}
          >
            Completed
          </button>
          <button
            className={`btn ${
              filterStatus === "in-progress"
                ? "btn-warning"
                : "btn-outline-warning"
            }`}
            onClick={() => setFilterStatus("in-progress")}
          >
            In-Progress
          </button>
        </div>
      </div>

      {/* Update Task Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Task</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                />
                <select
                  className="form-control mb-2"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
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

      {/* Tasks Table */}
      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                <span
                  className={`badge ${
                    task.status === "completed" ? "bg-success" : "bg-warning"
                  }`}
                >
                  {task.status}
                </span>
              </td>
              <td>{task.assignedTo?.name || "N/A"}</td>
              <td>{task.dueDate?.slice(0, 10)}</td>
              <td>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => handleMarkCompleted(task._id)}
                >
                  Complete
                </button>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => openUpdateModal(task)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredTasks.length === 0 && (
        <p className="text-center">No tasks found</p>
      )}
    </div>
  );
};

export default TaskManagement;

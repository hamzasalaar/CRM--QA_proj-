const Task = require("../models/taskModel");
const User = require("../models/userModel");

const getUserTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ assignedTo: userId }).populate(
      "assignedTo",
      "name email"
    ).populate("createdBy", "name email");

    if (!tasks || tasks.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No tasks found for this user" });
    }

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendRequest = async (req, res) => {
  try {
    const { managerEmail } = req.body;
    if (!managerEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Manager email is required" });
    }
    const userId = req.user._id;

    const manager = await User.findOne({ email: managerEmail });
    if (!manager || manager.role !== "manager") {
      return res
        .status(400)
        .json({ success: false, message: "Manager not found" });
    }
    if (manager.teamMembers.includes(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "You are already in the team" });
    }

    if (manager.pendingRequests.includes(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Request already sent" });
    }

    manager.pendingRequests.push(userId);
    await manager.save();

    res
      .status(200)
      .json({ success: true, message: "Request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const taskId = req.params.id;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    task.status = status;
    await task.save();

    res.status(200).json({ success: true, message: "Task status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const managerDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "manager",
      "name email"
    );
    if (!user || !user.manager) {
      return res
        .status(404)
        .json({ success: false, message: "Manager not found" });
    }

    res.status(200).json({ success: true, manager: user.manager });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  sendRequest,
  getUserTasks,
  updateTaskStatus,
  managerDetails,
};

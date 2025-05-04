const Task = require("../models/taskModel");
const User = require("../models/userModel");

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

    const manager = await User.findById(req.user._id).populate("teamMembers");

    const isTeamMember = manager.teamMembers.some(
      (member) => member._id.toString() === assignedTo
    );

    if (!isTeamMember) {
      return res.status(400).json({
        success: false,
        message: "Assigned user must be your team member",
      });
    }

    const user = await User.findById(assignedTo);
    if (!user || user.role !== "user") {
      return res.status(400).json({
        success: false,
        message: "Assigned user must be a valid user",
      });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: req.user._id,
      dueDate,
    });
    res.status(201).json({ success: true, message: "Task created", task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getManagerTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id }).populate(
      "assignedTo",
      "name email"
    );
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markTaskCompleted = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (
      !task ||
      (task.assignedTo.toString() !== req.user._id.toString() &&
        task.createdBy.toString() !== req.user._id.toString())
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized or task not found" });
    }

    task.status = "completed";
    await task.save();

    res.json({ success: true, message: "Task marked as completed", task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Update task fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.assignedTo = assignedTo || task.assignedTo;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;

    await task.save();

    res.status(200).json({ success: true, message: "Task updated", task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFilteredTasks = async (req, res) => {
  try {
    const { status, priority, dueDate } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };

    const tasks = await Task.find(filter).populate("assignedTo", "name email");
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getManagerTasks,
  markTaskCompleted,
  updateTask,
  getFilteredTasks,
  deleteTask,
};

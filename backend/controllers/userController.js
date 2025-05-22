const Task = require("../models/taskModel");
const User = require("../models/userModel");
const Deal = require("../models/dealModel");

const getAllManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: "manager" }).select("name email");
    res.status(200).json({ success: true, managers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ assignedTo: userId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      tasks: tasks || [],
    });
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
    const user = await User.findById(userId);

    // ✅ Enforce one team per user
    if (user.manager) {
      return res.status(400).json({
        success: false,
        message:
          "You are already part of a team. Leave the team to send another request.",
      });
    }

    if (user.requestStatus === "pending") {
      return res.status(400).json({
        success: false,
        message: "You already have a pending request.",
      });
    }

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
      return res.status(400).json({
        success: false,
        message: "Request already sent to this manager",
      });
    }

    manager.pendingRequests.push(userId);
    await manager.save();

    user.requestStatus = "pending";
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.requestStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "No pending request to cancel.",
      });
    }

    // Find the manager who has this user's ID in their pendingRequests
    const manager = await User.findOne({
      role: "manager",
      pendingRequests: user._id,
    });

    if (!manager) {
      return res.status(400).json({
        success: false,
        message: "Associated manager not found for cancellation.",
      });
    }

    // Remove user from manager's pendingRequests
    manager.pendingRequests = manager.pendingRequests.filter(
      (id) => id.toString() !== user._id.toString()
    );
    await manager.save();

    // Reset user request status
    user.requestStatus = "none";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Request cancelled successfully.",
    });
  } catch (error) {
    console.error("Cancel Request Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRequestStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "manager",
      "name email"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      status: user.requestStatus,
      manager: user.manager || null,
    });
  } catch (error) {
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

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      manager: user.manager || null, // Show null if no manager
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const leaveTeam = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user.manager) {
      return res
        .status(400)
        .json({ success: false, message: "You are not assigned to any team" });
    }

    const manager = await User.findById(user.manager);

    // Remove user from manager's teamMembers
    manager.teamMembers = manager.teamMembers.filter(
      (memberId) => memberId.toString() !== userId.toString()
    );
    await manager.save();

    // Clear user's manager and status
    user.manager = null;
    user.requestStatus = "none";
    user.requestedManager = null; // optional
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "You have successfully left the team" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyDeals = async (req, res) => {
  try {
    const deals = await Deal.find({ assignedTo: req.user._id }).populate(
      "associatedLead",
      "name email"
    );
    res.status(200).json({ success: true, deals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateMyDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const deal = await Deal.findById(id);

    if (!deal) {
      return res
        .status(404)
        .json({ success: false, message: "Deal not found" });
    }

    if (deal.assignedTo.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    deal.status = req.body.status || deal.status;
    deal.priority = req.body.priority || deal.priority;

    const updated = await deal.save();
    res.status(200).json({ success: true, deal: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  sendRequest,
  getUserTasks,
  updateTaskStatus,
  managerDetails,
  getRequestStatus,
  getAllManagers,
  leaveTeam,
  cancelRequest,
  getMyDeals,
  updateMyDeal,
};

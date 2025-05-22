const User = require("../models/userModel");
const Task = require("../models/taskModel");

const addUserToTeam = async (req, res) => {
  try {
    const { email } = req.body;

    const manager = await User.findById(req.user._id);

    if (!manager || manager.role !== "manager") {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized!" });
    }

    // Check if the user to be added exists
    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (userToAdd.role !== "user") {
      return res
        .status(400)
        .json({ success: false, message: "User must be a valid user" });
    }

    // Check if the user is already a team member
    if (manager.teamMembers.includes(userToAdd._id)) {
      return res
        .status(400)
        .json({ success: false, message: "User is already in the team" });
    }

    if (manager.teamMembers.length >= 10) {
      return res.status(400).json({
        success: false,
        message: "Cannot add more members to the team. Max limit reached.",
      });
    }

    // Add the user to the manager's team
    manager.teamMembers.push(userToAdd._id);
    await manager.save();

    // Optionally, you can also update the userToAdd to reflect they are now assigned to this manager.
    userToAdd.manager = manager._id;
    await userToAdd.save();

    res.status(200).json({
      success: true,
      message: "User added to the team successfully",
      team: manager.teamMembers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeUser = async (req, res) => {
  try {
    const userIdToRemove = req.params.id;

    const manager = await User.findById(req.user._id);

    if (!manager || manager.role !== "manager") {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized!" });
    }

    if (!userIdToRemove || !manager.teamMembers.includes(userIdToRemove)) {
      return res
        .status(400)
        .json({ success: false, message: "User not found in the team" });
    }

    // Remove the user from teamMembers
    manager.teamMembers = manager.teamMembers.filter(
      (member) => member.toString() !== userIdToRemove
    );
    await manager.save();

    // ✅ Clear the user's manager field and reset requestStatus
    const user = await User.findById(userIdToRemove);
    if (user) {
      user.manager = null;
      user.requestStatus = "none";
      await user.save();
    }

    // Optionally remove them from tasks
    await Task.updateMany(
      { assignedTo: userIdToRemove },
      { $set: { assignedTo: null } }
    );

    res.status(200).json({
      success: true,
      message: "User removed from the team successfully",
      team: manager.teamMembers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTeamMembers = async (req, res) => {
  try {
    const manager = await User.findById(req.user._id).populate(
      "teamMembers",
      "name email"
    );

    if (!manager) {
      return res
        .status(404)
        .json({ success: false, message: "Not authorized!" });
    }
    res.status(200).json({ success: true, teamMembers: manager.teamMembers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const manager = await User.findById(req.user._id).populate(
      "pendingRequests",
      "name email"
    );

    if (!manager || manager.role !== "manager") {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized!" });
    }

    res.status(200).json({
      success: true,
      pendingRequests: manager.pendingRequests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    const manager = await User.findById(req.user._id);

    if (!manager || manager.role !== "manager") {
      return res
        .status(401)
        .json({ success: false, message: "Manager not found!" });
    }

    if (!userId || !manager.pendingRequests.includes(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "No pending request from this user" });
    }

    if (manager.teamMembers.includes(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "User is already in the team" });
    }

    if (manager.teamMembers.length >= 10) {
      return res.status(400).json({
        success: false,
        message: "Cannot add more members to the team. Max limit reached.",
      });
    }

    // Remove from pendingRequests
    manager.pendingRequests = manager.pendingRequests.filter(
      (request) => request.toString() !== userId
    );

    // Add to teamMembers
    manager.teamMembers.push(userId);
    await manager.save();

    // ✅ SET MANAGER FIELD FOR THE USER
    const user = await User.findById(userId);
    user.manager = manager._id;
    user.requestStatus = "accepted";
    await user.save();

    res.status(200).json({
      success: true,
      message: "User added to team successfully",
      team: manager.teamMembers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const declineRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    const manager = await User.findById(req.user._id);

    if (!manager || manager.role !== "manager") {
      return res
        .status(401)
        .json({ success: false, message: "Manager not found!" });
    }

    if (!userId || !manager.pendingRequests.includes(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "No pending request from this user" });
    }

    const user = await User.findById(userId);

    // Remove user from pendingRequests
    manager.pendingRequests = manager.pendingRequests.filter(
      (request) => request.toString() !== userId
    );
    await manager.save();

    user.requestStatus = "rejected";
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Request declined successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addUserToTeam,
  getTeamMembers,
  removeUser,
  acceptRequest,
  getPendingRequests,
  declineRequest,
};

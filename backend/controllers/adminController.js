const userModel = require("../models/userModel");
const mongoose = require("mongoose");

const getUser = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const user = await userModel.findById(userId);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });

    if (user.role === "admin")
      return res
        .status(401)
        .json({ success: false, message: "Admin can't be deleted!" });
    
    await userModel.findByIdAndDelete(userId);
    
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getUser,
  deleteUser,
};

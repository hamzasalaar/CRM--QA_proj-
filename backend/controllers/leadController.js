const Lead = require("../models/leadModel");

const createLead = async (req, res) => {
  try {
    const { name, email, phone, source, priority, assignedTo } = req.body;

    const lead = new Lead({
      name,
      email,
      phone,
      source,
      priority,
      status: "New",
      createdBy: req.user._id,
      assignedTo: assignedTo || null,
    });

    await lead.save();
    res
      .status(201)
      .json({ success: true, message: "Lead created successfully", lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const existingLead = await Lead.findById(id);

    if (!existingLead) {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }

    // Clean empty assignedTo value
    if (req.body.assignedTo === "") {
      req.body.assignedTo = null;
    }

    // Merge updated fields only
    Object.assign(existingLead, req.body);
    await existingLead.save();

    const updatedLead = await Lead.findById(id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res
      .status(200)
      .json({ success: true, message: "Lead updated", lead: updatedLead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");
    res.status(200).json({ success: true, leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ assignedTo: req.user._id });
    res.status(200).json({ success: true, leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findOne({ _id: id, assignedTo: req.user._id });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found or not assigned to you",
      });
    }

    const allowedFields = ["email", "phone", "status", "priority"];
    allowedFields.forEach((field) => {
      if (req.body[field]) lead[field] = req.body[field];
    });

    await lead.save();

    res.status(200).json({ success: true, message: "Lead updated", lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addNoteToLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Note content required" });
    }

    const lead = await Lead.findOne({ _id: id, assignedTo: req.user._id });

    if (!lead) {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }

    lead.notes.push({
      content,
      author: req.user._id,
    });

    await lead.save();
    res.status(200).json({ success: true, message: "Note added", lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createLead,
  getAllLeads,
  updateLead,
  deleteLead,
  getMyLeads,
  updateUserLead,
  addNoteToLead,
};

const Lead = require("../models/leadModel");

const createLead = async (req, res) => {
  try {
    const { name, email, phone, source, interestLevel, budget, timeline, notes } = req.body;

    const lead = await Lead.create({
      name,
      email,
      phone,
      source,
      interestLevel,
      budget,
      timeline,
      notes,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: "Lead created successfully", lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getManagerLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ createdBy: req.user._id });
    res.status(200).json({ success: true, leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createLead,
  getManagerLeads,
};

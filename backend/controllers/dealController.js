const Deal = require("../models/dealModel");
const Lead = require("../models/leadModel");
const User = require("../models/userModel");

const createDeal = async (req, res) => {
  try {
    const {
      title,
      value,
      stage,
      status,
      priority,
      associatedLead,
      assignedTo,
    } = req.body;

    const lead = await Lead.findById(associatedLead);
    if (!lead)
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });

    const manager = await User.findById(req.user._id);
    if (!manager || manager.role !== "manager") {
      return res
        .status(403)
        .json({ success: false, message: "Only managers can create deals" });
    }

    // Ensure the lead is in the manager's team
    const isTeamLead = manager.teamMembers.includes(lead.assignedTo.toString());
    if (!isTeamLead) {
      return res
        .status(403)
        .json({ success: false, message: "Lead not in your team" });
    }

    const deal = await Deal.create({
      title,
      value,
      stage,
      status,
      priority,
      associatedLead,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, deal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getDeals = async (req, res) => {
  try {
    const manager = await User.findById(req.user._id).populate("teamMembers");

    if (!manager || manager.role !== "manager") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Find deals where lead belongs to one of the manager’s team members
    const teamMemberIds = manager.teamMembers.map((user) => user._id);

    const deals = await Deal.find()
      .populate("associatedLead", "name email")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .where("associatedLead")
      .in(
        await Lead.find({ assignedTo: { $in: teamMemberIds } }).distinct("_id")
      );

    res.status(200).json({ success: true, deals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal)
      return res
        .status(404)
        .json({ success: false, message: "Deal not found" });

    if (deal.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this deal",
      });
    }

    if (req.body.assignedTo === "") {
      req.body.assignedTo = null;
    }

    Object.assign(deal, req.body);
    await deal.save();

    res.status(200).json({ success: true, deal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal)
      return res
        .status(404)
        .json({ success: false, message: "Deal not found" });

    if (deal.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this deal",
      });
    }

    await deal.deleteOne();
    res.status(200).json({ success: true, message: "Deal deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createDeal,
  getDeals,
  updateDeal,
  deleteDeal,
};

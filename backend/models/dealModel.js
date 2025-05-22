const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    value: { type: Number, default: 0 },
    stage: {
      type: String,
      enum: ["Prospect", "Proposal", "Negotiation", "Closed"],
      default: "Prospect",
    },
    status: {
      type: String,
      enum: ["Open", "Won", "Lost"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    associatedLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deal", dealSchema);

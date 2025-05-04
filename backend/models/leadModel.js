const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    source: { type: String }, // e.g., website, email, social media
    status: {
      type: String,
      enum: ["new", "qualified", "converted", "rejected"],
      default: "new",
    },
    interestLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    budget: { type: Number },
    timeline: { type: String }, // e.g., "1 month", "ASAP"
    notes: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // manager who added the lead
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);

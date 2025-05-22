const express = require("express");

const { isAuthenticated } = require("../middleware/userAuth");
const { isUser } = require("../middleware/isUser");

const {
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
} = require("../controllers/userController");
const { markTaskCompleted } = require("../controllers/taskController");
const {
  getMyLeads,
  updateUserLead,
  addNoteToLead,
} = require("../controllers/leadController");

const UserRoutes = express.Router();

UserRoutes.use(isAuthenticated, isUser);

UserRoutes.get("/managers", getAllManagers);
UserRoutes.get("/manager-details", managerDetails);

UserRoutes.get("/my-tasks", getUserTasks);
UserRoutes.post("/completed/:id", markTaskCompleted);
UserRoutes.put("/update-status/:id", updateTaskStatus);

UserRoutes.post("/send-request", sendRequest);
UserRoutes.post("/cancel-request", cancelRequest);
UserRoutes.get("/my-requests", getRequestStatus);
UserRoutes.post("/leave-team", leaveTeam);

UserRoutes.get("/my-leads", getMyLeads);
UserRoutes.post("/update-lead/:id", updateUserLead);
UserRoutes.post("/add-note/:id", addNoteToLead);

UserRoutes.get("/my-deals", getMyDeals);
UserRoutes.put("/edit-deal/:id", updateMyDeal);

module.exports = UserRoutes;

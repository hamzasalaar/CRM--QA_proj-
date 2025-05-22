const express = require("express");
const {
  createTask,
  getManagerTasks,
  markTaskCompleted,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { isAuthenticated } = require("../middleware/userAuth");
const { isManager } = require("../middleware/isManager");
const {
  createLead,
  getAllLeads,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");
const {
  addUserToTeam,
  getTeamMembers,
  removeUser,
  acceptRequest,
  getPendingRequests,
  declineRequest,
} = require("../controllers/managerController");
const {
  createDeal,
  getDeals,
  updateDeal,
  deleteDeal,
} = require("../controllers/dealController");

const ManagerRoutes = express.Router();

ManagerRoutes.use(isAuthenticated, isManager); // Apply middleware to all routes

ManagerRoutes.post("/create-task", createTask);
ManagerRoutes.get("/manager-tasks", getManagerTasks);
ManagerRoutes.post("/completed/:id", markTaskCompleted);
ManagerRoutes.put("/update-task/:id", updateTask);
ManagerRoutes.delete("/delete-task/:id", deleteTask);

ManagerRoutes.post("/add-user", addUserToTeam);
ManagerRoutes.get("/my-team", getTeamMembers);
ManagerRoutes.delete("/remove-user/:id", removeUser);

ManagerRoutes.post("/create-lead", createLead);
ManagerRoutes.get("/all-leads", getAllLeads);
ManagerRoutes.post("/edit-lead/:id", updateLead);
ManagerRoutes.delete("/delete-lead/:id", deleteLead);

ManagerRoutes.get("/pending", getPendingRequests);
ManagerRoutes.post("/accept-request", acceptRequest);
ManagerRoutes.post("/decline-request", declineRequest);

ManagerRoutes.post("/deals/create", createDeal);
ManagerRoutes.get("/deals", getDeals);
ManagerRoutes.put("/deals/:id", updateDeal);
ManagerRoutes.delete("/deals/:id", deleteDeal);

module.exports = ManagerRoutes;

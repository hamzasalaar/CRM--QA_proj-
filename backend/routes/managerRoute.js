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
  getManagerLeads,
} = require("../controllers/leadController");
const { addUserToTeam, getTeamMembers, removeUser, acceptRequest } = require("../controllers/managerController");

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
ManagerRoutes.get("/my-leads", getManagerLeads);

ManagerRoutes.post("/accept-request", acceptRequest);

module.exports = ManagerRoutes;

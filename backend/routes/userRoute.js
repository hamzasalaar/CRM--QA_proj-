const express = require("express");

const { isAuthenticated } = require("../middleware/userAuth");

const {
  sendRequest,
  getUserTasks,
  updateTaskStatus,
  managerDetails,
} = require("../controllers/userController");
const { markTaskCompleted } = require("../controllers/taskController");

const UserRoutes = express.Router();

UserRoutes.use(isAuthenticated);

UserRoutes.get("/manager-details", managerDetails);

UserRoutes.get("/my-tasks", getUserTasks);
UserRoutes.post("/completed/:id", markTaskCompleted);
UserRoutes.put("/update-status/:id", updateTaskStatus);

UserRoutes.post("/send-request", sendRequest);

module.exports = UserRoutes;

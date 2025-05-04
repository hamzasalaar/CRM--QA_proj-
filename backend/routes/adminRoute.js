const express = require("express");
const { getUser, deleteUser, updateUser } = require("../controllers/adminController");
const { isAdmin } = require("../middleware/adminAuth");
const { createTask, getAllTasks } = require("../controllers/taskController");

const AdminRoute = express.Router();

// User operations for admin
AdminRoute.get("/getuser", isAdmin, getUser);
AdminRoute.post("/deleteuser/:id", isAdmin, deleteUser);
AdminRoute.put("/update/:id", isAdmin, updateUser);

// Task operations for admin
AdminRoute.post("/create-task", isAdmin, createTask);
AdminRoute.get("/tasks", isAdmin, getAllTasks);

module.exports = AdminRoute;

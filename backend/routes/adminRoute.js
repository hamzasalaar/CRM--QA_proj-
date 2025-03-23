const express = require("express");
const { getUser, deleteUser } = require("../controllers/adminController");
const { isAdmin } = require("../middleware/adminAuth");

const AdminRoute = express.Router();

AdminRoute.get("/getuser", isAdmin, getUser);
AdminRoute.post("/deleteuser/:id", isAdmin, deleteUser);

module.exports = AdminRoute;

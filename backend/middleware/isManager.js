const isManager = function isManager(req, res, next) {
  if (req.user && req.user.role === "manager") {
    return next();
  }

  return res
    .status(403)
    .json({ success: false, message: "Access denied. Manager only." });
};

module.exports = { isManager };

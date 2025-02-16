const roleModel = require("../Models/RoleModel.js");

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (user?.role === "super admin") {
        return next();
      }

      // Check if user and role ID exist
      if (!user || !user.roleId) {
        return res
          .status(401)
          .json({ message: "Unauthorized: Role not assigned to user" });
      }

      const role = await roleModel.findById(user?.roleId);

      if (!role || !role?.permissions) {
        return res
          .status(403)
          .json({ message: "Forbidden: Role or permissions not found" });
      }

      if (role?.permissions.includes(requiredPermission)) {
        return next();
      }

      return res.status(403).json({
        message: "Forbidden: You do not have the required permission.",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  };
};

module.exports = checkPermission;

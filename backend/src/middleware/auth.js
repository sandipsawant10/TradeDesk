import { verifyToken } from "../utils/jwt";
import { sendError } from "../utils/response";

const protect = (req, res, next) => {
  const header = req.header.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return sendError(res, "Unauthorized", 401);
  }

  try {
    const token = header.split(" ")[1];
    req.user = verifyToken(token);
    next();
  } catch {
    sendError(res, "Invalid or expired token", 401);
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, "You do not have permission to do this", 403);
    }
    next();
  };
};

export { protect, requireRole };

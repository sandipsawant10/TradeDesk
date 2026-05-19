import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.type === "field" ? e.path : "unknown",
      message: e.msg,
    }));
    return res
      .status(400)
      .json({ success: false, message: "Validation error", errors: formatted });
  }
  next();
};

export { validate };

import User from "../models/User.model.js";
import { signToken } from "../utils/jwt.js";
import { sendSuccess } from "../utils/response.js";
import { AppError, asyncHandler } from "../middleware/error.js";

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new AppError("User already exists", 409);

  const user = await User.create({ name, email, password, role });
  const token = signToken({ userId: user._id.toString(), role: user.role });

  sendSuccess(res, "Account created successfully", { user, token }, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError("Invalid credentials", 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  const token = signToken({ userId: user._id.toString(), role: user.role });

  const userObj = user.toObject();
  delete userObj.password;

  sendSuccess(res, "Logged in successfully", { user: userObj, token });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  sendSuccess(res, "Users retrieved successfully", {
    users,
    count: users.length,
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  sendSuccess(res, "Profile fetched successfully", { user });
});

export { register, login, getAllUsers, getMe };

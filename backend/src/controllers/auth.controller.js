import User from "../models/User.model";
import { signToken } from "../utils/jwt.js";
import { sendSuccess } from "../utils/response.js";

const register = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists", 400);

  const user = await User.create({ username, email, password, role });
  const token = signToken({ userId: user._id.toString(), role: user.role });

  sendSuccess(res, "Account created successfully", { user, token }, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials", 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials", 401);

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

export { register, login, getAllUsers };

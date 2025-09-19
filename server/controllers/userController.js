import User from "../models/User.js";
import wrapAsync from "../utils/wrapAsync.js";

// Get user data using userId
export const getUserData = wrapAsync(async (req, res) => {
  const { userId } = req.auth();
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true, user });
});

// Update user data
export const updateUserData = wrapAsync(async (req, res) => {
  const { userId } = req.auth();
  let { username, bio, location, full_name } = req.body;

  const tempUser = await User.findById(userId);

  // Fallback to existing values if not provided
  if (!username) username = tempUser.username;

  // Prevent duplicate usernames
  if (tempUser.username !== username) {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      username = tempUser.username;
    }
  }

  const updatedData = {
    username,
    bio,
    location,
    full_name,
  };

  const profile = req.files?.profile?.[0];
  const cover = req.files?.cover?.[0];

  // TODO: Upload images to cloud storage (ImageKit)
});

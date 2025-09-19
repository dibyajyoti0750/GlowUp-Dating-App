import wrapAsync from "../utils/wrapAsync.js";

export const protect = wrapAsync(async (req, res, next) => {
  const { userId } = await req.auth();
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  next();
});

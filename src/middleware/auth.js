import jwt from "jsonwebtoken";
import { User } from "../DB/models/user.model.js";
import { getCache } from "../utils/redis.js";

const JWT_SECRET = process.env.JWT_SECRET || "saraha_secret_key";

export const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token required" });
    }
    const token = authorization.split(" ")[1];

    // Check if token was revoked in Redis
    const isRevoked = await getCache(evoked_);
    if (isRevoked) {
      return res.status(401).json({ message: "Token has been revoked. Please sign in again." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

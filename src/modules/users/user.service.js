import { User } from "../../DB/models/user.model.js";

export const getProfile = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image file is required." });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: req.file.path },
      { new: true }
    ).select("-password");

    return res.status(200).json({ message: "Profile picture uploaded successfully", user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

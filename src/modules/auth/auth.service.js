import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../DB/models/user.model.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { setCache, getCache, delCache } from "../../utils/redis.js";

const JWT_SECRET = process.env.JWT_SECRET || "saraha_secret_key";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({ name, email, password: hashedPassword });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await setCache(otp_, otp, 600); // 10 min

    console.log(\n======================================\n[VERIFICATION OTP for ]: \n======================================\n);

    await sendEmail({
      to: email,
      subject: "Verify your Sara7a Account",
      html: <h2>Your OTP code is: </h2>
    });

    return res.status(201).json({ message: "Registration successful. Please verify the OTP sent to your email.", userId: user._id, testOtp: otp });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cachedOtp = await getCache(otp_);
    if (!cachedOtp || cachedOtp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    await User.findOneAndUpdate({ email }, { isConfirmed: true });
    await delCache(otp_);

    return res.status(200).json({ message: "Account confirmed successfully." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    // Revoke token in Redis for 1 day
    await setCache(evoked_, true, 86400);
    return res.status(200).json({ message: "Logged out successfully (token revoked)." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

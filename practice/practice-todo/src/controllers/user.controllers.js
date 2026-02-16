import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if ([username, email, password].some(f => !f?.trim())) {
      throw new ApiError(400, "All fields are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new ApiError(409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      _id: user._id,
      username: user.username,
      email: user.email,
      token: jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      )
    });

  } catch (error) {
    console.log(error);
    throw error;
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    res.status(200).json({
      success: true,
      _id: user._id,
      username: user.username,
      email: user.email,
      token: jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      )
    });

  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { registerUser, loginUser };

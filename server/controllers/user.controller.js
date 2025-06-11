import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js"
import getDataUri from "../utils/dataUri.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found, Please Register first!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // generate token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.name}`,
        success: true,
        user,
      });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login user",
    });
  }
};


export const logout = async (_, res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge: 0}).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        console.error("Error in logout:", error);
        res.status(500).json({
            success: false,
            message: "Failed to logout user",
        });
    }
}



export const updateProfile = async (req, res) => {
  try {
     const userId = req.id;
     const { name, description } = req.body;
     const file = req.file;

     const user = await User.findById(userId).select("-password");

      if (!user) {
          return res.status(404).json({
              success: false,
              message: "User not found",
          });
      }


    if(file) { 
     const fileUri = getDataUri(file);
     let cloudResponse = await cloudinary.uploader.upload(fileUri)
     user.photoUrl = cloudResponse.secure_url;
    }

      // updating data 
      if(name) user.name = name;
      if(description) user.description = description;
      

      await user.save();

      return res.status(200).json({
          success: true,
          message: "Profile updated successfully",
          user,
      });
      
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
}













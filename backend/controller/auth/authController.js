import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const checkUser = await User.findOne({ email });
        if (checkUser)
            return res.json({
                success: false,
                message: "User already exists with the same email ! please try again",
            });
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            username,
            email,
            password: hashPassword,
        });

        await newUser.save();
        res.status(200).json({
            success: true,
            message: "Registration successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
};






export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email })
      .select("username email role password _id")
      .lean();

    if (!checkUser) {
      return res.json({
        success: false,
        message: "User doesn't exist! Please register first",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);

    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        username: checkUser.username,
      },
      process.env.JWT_SECRET_KEY, // ✅ env use cheyyu
      { expiresIn: "60m" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,          // 🔥 MUST for production
        sameSite: "None",      // 🔥 MUST for cross-origin
        maxAge: 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Logged in successfully",
        user: {
          email: checkUser.email,
          role: checkUser.role,
          id: checkUser._id,
          username: checkUser.username,
        },
      });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};





export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  }).json({
    success: true,
    message: "Logged out successfully!",
  });
};
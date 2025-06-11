import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    req.id = decoded.userId;

    next();
  } catch (error) {
    console.error("Error in isAuthenticated:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

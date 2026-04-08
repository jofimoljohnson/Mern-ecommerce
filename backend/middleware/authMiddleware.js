
import jwt from 'jsonwebtoken'
export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  

  if (!token) return res.status(401).json({ success: false });

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false });
  }
};
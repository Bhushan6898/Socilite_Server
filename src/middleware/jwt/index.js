import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import dotenv from 'dotenv';
dotenv.config();
export const createToken = (user) => {
  if (!process.env.JWT_SECRET || !process.env.EXPIRESIN) {
    throw new Error("JWT_SECRET and EXPIRESIN must be defined");
  }
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.EXPIRESIN } // 30d
  );
};



export const cheack = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(createError(401, "Authentication token not found")); // 401 Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is not valid")); // 403 Forbidden

    req.user = user;
    next();
  });
};

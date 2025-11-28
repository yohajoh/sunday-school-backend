// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// ==================== PROTECT ROUTES ====================
export const protect = async (req, res, next) => {
  try {
    // 1. Get token from cookie
    let token;
    if (req.cookies.token) {
      token = req.cookies.token;
    }

    // 2. Check if token exists
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.',
      });
    }
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // 5. Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        status: 'fail',
        message: 'Your account has been deactivated.',
      });
    }

    // 6. Grant access to protected route
    req.user = user;

    console.log('🔐 [protect] User authenticated:', {
      id: user._id,
      email: user.email,
    });

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token.',
    });
  }
};

// ==================== RESTRICT TO ROLES ====================
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action.',
      });
    }
    next();
  };
};

// controllers/authController.js
import User from '../models/userModel.js';

// ==================== REGISTER USER ====================
export const register = async (req, res, next) => {
  try {
    const {
      studentId,
      email,
      password,
      firstName,
      lastName,
      sex,
      phoneNumber,
      dateOfBirth,
      nationalId,
      region,
      church,
      parentStatus,
      parentFullName,
      parentPhoneNumber,
    } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { studentId }, { nationalId }],
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message:
          'User with this email, student ID, or national ID already exists.',
      });
    }

    // 2. Create new user
    const user = await User.create(req.body);

    // 3. Generate JWT token
    const token = user.generateAuthToken();

    // 4. Set JWT as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 5. Remove password from output
    user.password = undefined;

    // 6. Send response
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user,
      },
      token,
    });
  } catch (error) {
    console.log('Registration Error:', error.message);
    next(error);
  }
};

// ==================== LOGIN USER ====================
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password',
      });
    }

    // 2. Find user and include password
    const user = await User.findOne({ email, status: 'active' }).select(
      '+password',
    );

    // 3. Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password',
      });
    }

    // 4. Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // 5. Generate JWT token
    const token = user.generateAuthToken();

    // 6. Set JWT as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 7. Remove password from output
    user.password = undefined;

    // 8. Send response
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user,
      },
      token,
    });
  } catch (error) {
    console.log('Login Error:', error.message);
    next(error);
  }
};

// ==================== LOGOUT USER ====================
export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({
    status: 'success',
    message: 'Logout successful',
  });
};

// ==================== GET CURRENT USER ====================
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    console.log('Get Me Error:', error.message);
    next(error);
  }
};

// ==================== UPDATE CURRENT USER PROFILE ====================
export const updateMe = async (req, res, next) => {
  try {
    console.log('🔄 [updateMe] Updating user profile:', {
      userId: req.user._id,
      updateData: req.body,
    });

    // 1. Create filtered object with only allowed fields
    const filteredBody = { ...req.body };

    // 2. Remove fields that are not allowed to be updated
    const restrictedFields = [
      'password',
      'email',
      'studentId',
      'role',
      'nationalId',
    ];
    restrictedFields.forEach((field) => delete filteredBody[field]);

    // 3. Update user document
    const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    console.log('✅ [updateMe] Profile updated successfully:', user.email);

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    console.log('❌ [updateMe] Error:', error.message);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: errors,
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        status: 'fail',
        message: `${field} already exists`,
      });
    }

    next(error);
  }
};

// ==================== CHANGE PASSWORD ====================
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1. Get user from collection (include password)
    const user = await User.findById(req.user._id).select('+password');

    // 2. Check if current password is correct
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({
        status: 'fail',
        message: 'Current password is incorrect',
      });
    }

    // 3. Update password
    user.password = newPassword;
    await user.save();

    // 4. Generate new token
    const token = user.generateAuthToken();

    // 5. Update cookie with new token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully',
      token,
    });
  } catch (error) {
    console.log('Change Password Error:', error.message);
    next(error);
  }
};

import User from "../models/User.js";
import Resume from "../models/Resume.js";
import Analysis from "../models/Analysis.js";
import JobMatch from "../models/JobMatch.js";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const resumesCount = await Resume.countDocuments({ userId: req.userId });
    const jobMatchesCount = await JobMatch.countDocuments({ userId: req.userId });
    const latestAnalysis = await Analysis.findOne({ userId: req.userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          targetRoles: user.targetRoles,
          skills: user.skills,
          bio: user.bio,
          createdAt: user.createdAt,
        },
        stats: {
          resumesCount,
          jobMatchesCount,
          latestScore: latestAnalysis?.score || 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, targetRoles, skills, bio } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (name) user.name = name.trim();
    if (email) {
      const emailExists = await User.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: req.userId },
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email address is already taken by another account.",
        });
      }
      user.email = email.toLowerCase().trim();
    }
    if (targetRoles && Array.isArray(targetRoles)) user.targetRoles = targetRoles;
    if (skills && Array.isArray(skills)) user.skills = skills;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          targetRoles: user.targetRoles,
          skills: user.skills,
          bio: user.bio,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide both current and new password.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    const user = await User.findById(req.userId).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password does not match our records.",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

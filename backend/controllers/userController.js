const User = require('../models/User');

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    if (req.user._id.toString() !== user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this profile');
    }
    const { fullName, bio, avatar } = req.body;
    if (fullName) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      res.status(400);
      throw new Error('Invalid role');
    }
    user.role = role;
    await user.save();
    res.json({ message: 'User role updated', role: user.role });
  } catch (error) {
    next(error);
  }
};

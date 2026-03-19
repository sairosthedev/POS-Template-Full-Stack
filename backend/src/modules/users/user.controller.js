const User = require('./user.model');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return successResponse(res, users);
  } catch (error) { return errorResponse(res, error.message); }
};

exports.createUser = async (req, res) => {
  try {
    const body = { ...req.body };
    // Accept "pin" from admin UI and store into pinHash for hashing hook
    if (body.pin) {
      body.pinHash = String(body.pin);
      delete body.pin;
    }
    const user = new User(body);
    const saved = await user.save();
    const result = await User.findById(saved._id).select('-password');
    return successResponse(res, result, 'Employee created', 201);
  } catch (error) { return errorResponse(res, error.message, 400); }
};

exports.updateUser = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.pin) {
      // For updates, we need to trigger hashing hook, so use save()
      const u = await User.findById(req.params.id).select('+pinHash');
      if (!u) return errorResponse(res, 'User not found', 404);
      u.name = body.name ?? u.name;
      u.email = body.email ?? u.email;
      u.role = body.role ?? u.role;
      u.branchId = body.branchId ?? u.branchId;
      if (body.password) u.password = body.password;
      if (body.pin) u.pinHash = String(body.pin);
      await u.save();
      const result = await User.findById(u._id).select('-password');
      return successResponse(res, result);
    }

    const user = await User.findByIdAndUpdate(req.params.id, body, { new: true }).select('-password');
    return successResponse(res, user);
  } catch (error) { return errorResponse(res, error.message, 400); }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Employee deleted');
  } catch (error) { return errorResponse(res, error.message); }
};

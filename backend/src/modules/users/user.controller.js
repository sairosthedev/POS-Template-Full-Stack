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
    const user = new User(req.body);
    const saved = await user.save();
    const result = await User.findById(saved._id).select('-password');
    return successResponse(res, result, 'Employee created', 201);
  } catch (error) { return errorResponse(res, error.message, 400); }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    return successResponse(res, user);
  } catch (error) { return errorResponse(res, error.message, 400); }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Employee deleted');
  } catch (error) { return errorResponse(res, error.message); }
};

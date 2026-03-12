const Branch = require('./branch.model');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find({}).sort({ createdAt: -1 });
    return successResponse(res, branches);
  } catch (error) { return errorResponse(res, error.message); }
};

exports.createBranch = async (req, res) => {
  try {
    const branch = new Branch(req.body);
    const saved = await branch.save();
    return successResponse(res, saved, 'Branch created', 201);
  } catch (error) { return errorResponse(res, error.message, 400); }
};

exports.updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return successResponse(res, branch);
  } catch (error) { return errorResponse(res, error.message, 400); }
};

exports.deleteBranch = async (req, res) => {
  try {
    await Branch.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Branch deleted');
  } catch (error) { return errorResponse(res, error.message); }
};

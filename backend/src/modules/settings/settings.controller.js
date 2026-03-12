const Settings = require('./settings.model');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
      await settings.save();
    }
    return successResponse(res, settings);
  } catch (error) { return errorResponse(res, error.message); }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings(req.body);
    else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    return successResponse(res, settings, 'Settings updated');
  } catch (error) { return errorResponse(res, error.message, 400); }
};

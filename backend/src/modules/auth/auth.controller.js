const User = require('../users/user.model');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, 'Invalid email or password', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return errorResponse(res, 'Invalid email or password', 401);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return successResponse(res, {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    }, 'Login successful');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
// Bootstrap only: creates the first Admin when the database has no users yet.
// After that, accounts are created by admins/managers via POST /api/users.
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userCount = await User.estimatedDocumentCount();
    if (userCount > 0) {
      return errorResponse(res, 'Registration is disabled. Ask an administrator to create your account.', 403);
    }

    const user = new User({ name, email, password, role: 'Admin' });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return successResponse(res, {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    }, 'User registered successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.pinLogin = async (req, res) => {
  const { email, pin } = req.body;
  try {
    const user = await User.findOne({ email }).select('+pinHash');
    if (!user) return errorResponse(res, 'Invalid email or PIN', 401);

    const ok = await user.comparePin(String(pin || ''));
    if (!ok) return errorResponse(res, 'Invalid email or PIN', 401);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return successResponse(
      res,
      {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
      'Login successful',
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

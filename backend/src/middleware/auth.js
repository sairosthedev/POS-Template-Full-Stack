const jwt = require('jsonwebtoken');

function getToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header || typeof header !== 'string') return null;
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) return null;
  return token;
}

exports.protect = (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    return next();
  } catch (e) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

exports.authorizeRoles = (...roles) => {
  const allowed = roles.map((r) => String(r).toLowerCase());
  return (req, res, next) => {
    const role = String(req.user?.role || '').toLowerCase();
    if (!role || !allowed.includes(role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    return next();
  };
};


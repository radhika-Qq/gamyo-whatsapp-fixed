/**
 * isAuthenticated
 *
 * Policy to check if user is authenticated via JWT
 */

const jwt = require('jsonwebtoken');

module.exports = async function (req, res, proceed) {

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.unauthorized({
        error: 'No authorization token provided',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, sails.config.custom.jwtSecret);

    // Find user
    const user = await User.findOne({ id: decoded.id });

    if (!user) {
      return res.unauthorized({
        error: 'Invalid token - user not found',
      });
    }

    if (!user.isActive) {
      return res.forbidden({
        error: 'Account is deactivated',
      });
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Allow the request to continue
    return proceed();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.unauthorized({
        error: 'Invalid token',
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.unauthorized({
        error: 'Token expired',
      });
    }

    sails.log.error('isAuthenticated policy error:', error);
    return res.serverError({
      error: 'Authentication failed',
      details: error.message,
    });
  }

};


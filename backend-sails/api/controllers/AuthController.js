/**
 * AuthController
 *
 * Authentication controller
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {

  /**
   * Register a new user
   */
  register: async function (req, res) {
    try {
      const { email, password, fullName, companyName, phoneNumber } = req.body;

      // Validate required fields
      if (!email || !password || !fullName) {
        return res.badRequest({
          error: 'Email, password, and fullName are required',
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.badRequest({
          error: 'User with this email already exists',
        });
      }

      // Create new user
      const user = await User.create({
        email: email.toLowerCase(),
        password: password,
        fullName: fullName,
        companyName: companyName,
        phoneNumber: phoneNumber,
      }).fetch();

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        sails.config.custom.jwtSecret,
        { expiresIn: sails.config.custom.jwtExpiry }
      );

      return res.json({
        success: true,
        message: 'User registered successfully',
        token: token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          companyName: user.companyName,
        },
      });
    } catch (error) {
      sails.log.error('AuthController.register error:', error);
      return res.serverError({
        error: 'Failed to register user',
        details: error.message,
      });
    }
  },

  /**
   * Login user
   */
  login: async function (req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.badRequest({
          error: 'Email and password are required',
        });
      }

      // Find user
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.badRequest({
          error: 'Invalid email or password',
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.forbidden({
          error: 'Account is deactivated',
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.badRequest({
          error: 'Invalid email or password',
        });
      }

      // Update last login
      await User.updateOne({ id: user.id }).set({
        lastLogin: new Date(),
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        sails.config.custom.jwtSecret,
        { expiresIn: sails.config.custom.jwtExpiry }
      );

      return res.json({
        success: true,
        message: 'Login successful',
        token: token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          companyName: user.companyName,
        },
      });
    } catch (error) {
      sails.log.error('AuthController.login error:', error);
      return res.serverError({
        error: 'Failed to login',
        details: error.message,
      });
    }
  },

  /**
   * Get current user info
   */
  me: async function (req, res) {
    try {
      const user = await User.findOne({ id: req.user.id });

      if (!user) {
        return res.notFound({
          error: 'User not found',
        });
      }

      return res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          companyName: user.companyName,
          phoneNumber: user.phoneNumber,
          role: user.role,
          connectedAccounts: user.connectedAccounts,
          lastLogin: user.lastLogin,
        },
      });
    } catch (error) {
      sails.log.error('AuthController.me error:', error);
      return res.serverError({
        error: 'Failed to fetch user info',
        details: error.message,
      });
    }
  },

  /**
   * Logout user
   */
  logout: async function (req, res) {
    try {
      // With JWT, logout is handled client-side by removing the token
      // But we can log the event for audit purposes
      sails.log.info(`User ${req.user.id} logged out`);

      return res.json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      sails.log.error('AuthController.logout error:', error);
      return res.serverError({
        error: 'Failed to logout',
        details: error.message,
      });
    }
  },

};


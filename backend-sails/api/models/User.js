/**
 * User.js
 *
 * User model for authentication and profile management
 */

const bcrypt = require('bcryptjs');

module.exports = {

  attributes: {

    // Email address
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
    },

    // Hashed password
    password: {
      type: 'string',
      required: true,
      minLength: 6,
    },

    // Full name
    fullName: {
      type: 'string',
      required: true,
      maxLength: 120,
    },

    // Company/Organization name
    companyName: {
      type: 'string',
      maxLength: 200,
    },

    // Phone number
    phoneNumber: {
      type: 'string',
      maxLength: 20,
    },

    // User role
    role: {
      type: 'string',
      isIn: ['admin', 'user', 'manager'],
      defaultsTo: 'user',
    },

    // Account status
    isActive: {
      type: 'boolean',
      defaultsTo: true,
    },

    // Last login timestamp
    lastLogin: {
      type: 'ref',
      columnType: 'datetime',
    },

    // Connected platform accounts
    connectedAccounts: {
      type: 'json',
      defaultsTo: {},
      description: 'Stores tokens and info for WhatsApp, Facebook, Instagram, LinkedIn',
    },

    // Relationships
    posts: {
      collection: 'post',
      via: 'owner',
    },

  },

  // Lifecycle callbacks
  beforeCreate: async function (values, proceed) {
    // Hash password before creating
    if (values.password) {
      const salt = await bcrypt.genSalt(10);
      values.password = await bcrypt.hash(values.password, salt);
    }
    return proceed();
  },

  beforeUpdate: async function (values, proceed) {
    // Hash password if it's being updated
    if (values.password) {
      const salt = await bcrypt.genSalt(10);
      values.password = await bcrypt.hash(values.password, salt);
    }
    return proceed();
  },

  // Custom methods
  customToJSON: function () {
    // Remove password from JSON representation
    return _.omit(this, ['password']);
  },

};


const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
// const Phone = require('joi-phone-number');
// const Joi = BaseJoi.extend(Phone);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  zip: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5,
  },
  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 13,
  },
  marketing: Boolean,
  isAdmin: Boolean,
  isProvider: Boolean,
  isValidated: Boolean,
  date: {
    type: Date,
    default: Date.now,
  },
});

// Insert a new method called generateAuthToken() into the userSchema object
userSchema.methods.generateAuthToken = function () {
  // Create a JSON Web Token
  const token = jwt.sign({ _id: this._id, name: this.name, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
};

// Create the User model.
const User = mongoose.model('User', userSchema);

function validateUser(user) {
  // Joi schema now uses Joi.object({})
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
    zip: Joi.string().min(5).max(5).required(),
    phone: Joi.string().min(9).max(13).required(),
    marketing: Joi.bool(),
  });

  // Joi.validate() is now deprecated.
  // Use schema.validate({}) instead.
  return schema.validate(user);
}

// Export the User model and validate function.
exports.User = User;
exports.validate = validateUser;

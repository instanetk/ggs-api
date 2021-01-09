const mongoose = require('mongoose');
const Joi = require('joi');

const scheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
  },
  phone: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 255,
  },
  address: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
  },
  date: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
  },
  service: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
  },
  submitted: {
    type: Date,
    default: Date.now,
  },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

function validateSchedule(appointment) {
  // Joi schema now uses Joi.object({})
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    phone: Joi.string().min(10).max(255).required(),
    address: Joi.string().min(5).max(255).required(),
    date: Joi.string().min(5).max(255).required(),
    service: Joi.string().min(5).max(255).required(),
  });

  // Joi.validate() is now deprecated.
  // Use schema.validate({}) instead.
  return schema.validate(appointment);
}

exports.Schedule = Schedule;
exports.validate = validateSchedule;

const mongoose = require('mongoose');
const Joi = require('joi');

const scheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  last: {
    type: String,
    required: true,
    minLength: 2,
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
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
  },
  note: {
    type: String,
    required: false,
    minLength: 0,
    maxLength: 1024,
  },
  coordinates: {
    type: Object,
    required: true,
  },
  date: {
    type: Date,
    required: true,
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
  status: {
    type: String,
    minLength: 5,
    maxLength: 11,
    default: 'active',
  },
  notes: {
    type: String,
  },
  testimonial: {
    type: Boolean,
    default: false,
  },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

function validateSchedule(appointment) {
  // Joi schema now uses Joi.object({})
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    last: Joi.string().min(2).max(255).required(),
    phone: Joi.string().min(10).max(255).required(),
    address: Joi.string().min(5).max(255).required(),
    date: Joi.string().min(5).max(255).required(),
    service: Joi.string().min(5).max(255).required(),
    email: Joi.string().email().min(5).max(255).required(),
    note: Joi.string().allow('').optional(),
    coordinates: Joi.object().required(),
  });

  // Joi.validate() is now deprecated.
  // Use schema.validate({}) instead.
  return schema.validate(appointment);
}

exports.Schedule = Schedule;
exports.validate = validateSchedule;

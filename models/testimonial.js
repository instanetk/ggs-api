const mongoose = require('mongoose');
const Joi = require('joi');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  zip: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5,
  },
  city: {
    type: Object,
  },
  testimonial: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5120,
  },
  language: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 2,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  published: {
    type: Boolean,
    default: false,
  },
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

function validateSchedule(testimonial) {
  // Joi schema now uses Joi.object({})
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().min(5).max(255).required(),
    zip: Joi.string().min(5).max(5).required(),
    testimonial: Joi.string().min(5).max(5120).required(),
    language: Joi.string().min(2).max(2).required(),
  });

  // Joi.validate() is now deprecated.
  // Use schema.validate({}) instead.
  return schema.validate(testimonial);
}

exports.Testimonial = Testimonial;
exports.validate = validateSchedule;

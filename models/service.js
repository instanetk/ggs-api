const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  i18n: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
  },
  image: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
  },
  weight: {
    type: Number,
    required: true,
    minLength: 2,
    maxLength: 3,
  },
  featured: {
    type: Boolean,
    required: true,
  },
});

const Service = mongoose.model('Service', serviceSchema);

function validateService(service) {
  // Joi schema now uses Joi.object({})
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    category: Joi.objectId().required(),
    i18n: Joi.string().min(5).max(255).required(),
    image: Joi.string().min(5).max(255).required(),
    weight: Joi.number().min(10).max(990).required(),
    featured: Joi.boolean().required(),
  });

  // Joi.validate() is now deprecated.
  // Use schema.validate({}) instead.
  return schema.validate(service);
}

exports.Service = Service;
exports.validate = validateService;
